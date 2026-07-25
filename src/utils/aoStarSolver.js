// AO* (And/Or Graph Search) Solver for Certificate & Document Dependency Graphs
// Solves joint multi-target certificate requests with shared prerequisite optimization.

import { STATE_DATASETS, ANCHOR_DOCUMENTS } from "../data/certificateGraphData.js";

/**
 * Evaluates cost based on objective
 */
function getRouteCost(route, objective) {
  if (!route) return Infinity;
  switch (objective) {
    case "fastest":
      return route.days * 100 + route.visits * 10 + route.fee * 0.1;
    case "lowest_fee":
      return route.fee * 100 + route.visits * 10 + route.days;
    case "fewest_visits":
    default:
      return route.visits * 100 + route.days * 2 + route.fee * 0.1;
  }
}

/**
 * Main AO* Solver Engine
 */
export function solveCertificateGraph({
  targetIds = [],
  heldDocIds = [],
  stateKey = "kerala",
  objective = "fewest_visits" // 'fewest_visits' | 'fastest' | 'lowest_fee'
}) {
  const dataset = STATE_DATASETS[stateKey] || STATE_DATASETS.kerala;
  const heldSet = new Set(heldDocIds);
  const targetSet = new Set(targetIds);

  if (targetIds.length === 0) {
    return {
      success: true,
      totalVisits: 0,
      totalDays: 0,
      totalFee: 0,
      savedVisits: 0,
      savedFees: 0,
      executionSteps: [],
      chosenRoutes: {},
      missingDocs: [],
      fulfilledDocs: [],
      redundancySavings: "Select one or more target certificates to compute your optimal application route."
    };
  }

  // Memoized solver for AND/OR tree expansion
  const chosenRoutes = {}; // nodeId -> route object chosen
  const visitedNodes = new Set();
  const requiredNodes = new Set(); // nodes needed in the plan

  function solveNode(nodeId, currentPath = new Set()) {
    // If user already holds this document, no further expansion needed
    if (heldSet.has(nodeId)) {
      return { cost: 0, visits: 0, days: 0, fee: 0, solved: true };
    }

    if (currentPath.has(nodeId)) {
      // Cycle detection fallback
      return { cost: Infinity, visits: Infinity, days: Infinity, fee: Infinity, solved: false };
    }

    const availableRoutes = dataset.routes[nodeId] || [];
    if (availableRoutes.length === 0) {
      // Leaf node that user doesn't hold and has no recipe to get
      return { cost: 1000, visits: 1, days: 5, fee: 50, solved: false, missingLeaf: true };
    }

    let bestRoute = null;
    let bestScore = Infinity;
    let bestSubMetrics = { visits: 0, days: 0, fee: 0 };

    const newPath = new Set(currentPath).add(nodeId);

    // Evaluate OR branches (alternative routes)
    for (const route of availableRoutes) {
      let routeVisits = route.visits;
      let routeDays = route.days;
      let routeFee = route.fee;
      let possible = true;

      // Evaluate AND branches (prerequisites for this route)
      for (const prereqId of route.prerequisites) {
        if (heldSet.has(prereqId)) continue; // Already held

        const subRes = solveNode(prereqId, newPath);
        if (subRes.cost === Infinity) {
          possible = false;
          break;
        }
        
        // Add prerequisites metrics
        routeVisits += subRes.visits;
        routeDays = Math.max(routeDays, route.days + subRes.days); // sequential bottleneck
        routeFee += subRes.fee;
      }

      if (!possible) continue;

      const evalScore = getRouteCost({ visits: routeVisits, days: routeDays, fee: routeFee }, objective);
      if (evalScore < bestScore) {
        bestScore = evalScore;
        bestRoute = route;
        bestSubMetrics = { visits: routeVisits, days: routeDays, fee: routeFee };
      }
    }

    if (bestRoute) {
      chosenRoutes[nodeId] = bestRoute;
      requiredNodes.add(nodeId);
      return {
        cost: bestScore,
        visits: bestSubMetrics.visits,
        days: bestSubMetrics.days,
        fee: bestSubMetrics.fee,
        solved: true
      };
    }

    return { cost: Infinity, visits: Infinity, days: Infinity, fee: Infinity, solved: false };
  }

  // Solve for all requested target certificates
  for (const targetId of targetIds) {
    solveNode(targetId);
  }

  // Build the unified execution plan DAG (Topological ordering of steps)
  const stepsMap = new Map(); // nodeId -> step details
  const evaluatedInPlan = new Set();

  function buildPlanSteps(nodeId) {
    if (evaluatedInPlan.has(nodeId) || heldSet.has(nodeId)) return;
    evaluatedInPlan.add(nodeId);

    const chosenRoute = chosenRoutes[nodeId];
    if (!chosenRoute) return;

    // First build prerequisites (bottom-up dependency order)
    for (const prereqId of chosenRoute.prerequisites) {
      if (!heldSet.has(prereqId)) {
        buildPlanSteps(prereqId);
      }
    }

    const nodeInfo = dataset.nodes[nodeId] || { name: nodeId, level: "Office", issueOffice: "Government Office" };
    const missingPrereqs = chosenRoute.prerequisites.filter((p) => !heldSet.has(p));
    const heldPrereqs = chosenRoute.prerequisites.filter((p) => heldSet.has(p));

    stepsMap.set(nodeId, {
      nodeId,
      title: nodeInfo.name,
      isTarget: targetSet.has(nodeId),
      level: nodeInfo.level,
      office: chosenRoute.office || nodeInfo.issueOffice,
      routeLabel: chosenRoute.label,
      prerequisites: chosenRoute.prerequisites,
      missingPrereqs,
      heldPrereqs,
      visits: chosenRoute.visits,
      days: chosenRoute.days,
      fee: chosenRoute.fee,
      tips: chosenRoute.tips
    });
  }

  for (const targetId of targetIds) {
    buildPlanSteps(targetId);
  }

  const executionSteps = Array.from(stepsMap.values());

  // Calculate totals and shared prerequisite savings
  let totalVisits = 0;
  let totalFee = 0;
  let maxCriticalDays = 0;

  // Calculate un-optimized naive sum (if each target was done independently without sharing)
  let naiveVisits = 0;
  let naiveFee = 0;

  executionSteps.forEach((step, idx) => {
    step.stepNumber = idx + 1;
    totalVisits += step.visits;
    totalFee += step.fee;
    maxCriticalDays = Math.max(maxCriticalDays, step.days);
  });

  // Calculate naive benchmark for savings calculation
  for (const tId of targetIds) {
    if (heldSet.has(tId)) continue;
    const naiveRoute = (dataset.routes[tId] || [])[0];
    if (naiveRoute) {
      naiveVisits += naiveRoute.visits;
      naiveFee += naiveRoute.fee;
      // Assume naive approach also duplicates prerequisite steps
      naiveRoute.prerequisites.forEach((pId) => {
        if (!heldSet.has(pId)) {
          const pRoute = (dataset.routes[pId] || [])[0];
          if (pRoute) {
            naiveVisits += pRoute.visits;
            naiveFee += pRoute.fee;
          }
        }
      });
    }
  }

  const savedVisits = Math.max(0, naiveVisits - totalVisits);
  const savedFees = Math.max(0, naiveFee - totalFee);

  // Missing & Fulfilled doc lists
  const allNeededPrereqs = new Set();
  executionSteps.forEach((s) => {
    s.prerequisites.forEach((p) => allNeededPrereqs.add(p));
  });

  const missingAnchorDocs = Array.from(allNeededPrereqs)
    .filter((id) => !heldSet.has(id) && !dataset.nodes[id])
    .map((id) => {
      const anchor = ANCHOR_DOCUMENTS.find((a) => a.id === id);
      return anchor ? anchor.name : id;
    });

  const fulfilledDocs = ANCHOR_DOCUMENTS.filter((a) => heldSet.has(a.id)).map((a) => a.name);

  return {
    success: true,
    stateName: dataset.stateName,
    portalName: dataset.portalName,
    objective,
    totalVisits,
    totalDays: maxCriticalDays,
    totalFee,
    savedVisits,
    savedFees,
    executionSteps,
    chosenRoutes,
    missingAnchorDocs,
    fulfilledDocs,
    redundancySavings:
      savedVisits > 0 || savedFees > 0
        ? `Joint graph solver eliminated ${savedVisits} redundant office visits & saved ₹${savedFees} in duplicate processing fees by sharing prerequisite documents!`
        : "Optimal shortest route identified across government revenue offices."
  };
}
