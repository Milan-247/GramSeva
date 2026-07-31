// AO* (And/Or Graph Search) Solver for Certificate & Document Dependency Graphs
// Solves joint multi-target certificate requests with shared prerequisite optimization.

import { STATE_DATASETS, ANCHOR_DOCUMENTS, TARGET_CERTIFICATES, getCertificateDetails } from "../data/certificateGraphData.js";

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
 * Fallback route resolver for any certificate/node missing explicit state routes
 */
function getRoutesForNode(nodeId, stateKey) {
  const dataset = STATE_DATASETS[stateKey] || STATE_DATASETS.kerala;
  if (dataset.routes && dataset.routes[nodeId] && dataset.routes[nodeId].length > 0) {
    return dataset.routes[nodeId];
  }
  // Try Kerala fallback
  if (STATE_DATASETS.kerala.routes && STATE_DATASETS.kerala.routes[nodeId] && STATE_DATASETS.kerala.routes[nodeId].length > 0) {
    return STATE_DATASETS.kerala.routes[nodeId];
  }
  // Try Pan-India fallback
  if (STATE_DATASETS.pan_india.routes && STATE_DATASETS.pan_india.routes[nodeId] && STATE_DATASETS.pan_india.routes[nodeId].length > 0) {
    return STATE_DATASETS.pan_india.routes[nodeId];
  }

  // Construct dynamic route from procedural details or anchor/target metadata
  const certDetails = getCertificateDetails(nodeId, stateKey);
  const targetCert = TARGET_CERTIFICATES.find((t) => t.id === nodeId);
  const anchorDoc = ANCHOR_DOCUMENTS.find((a) => a.id === nodeId);
  const nodeInfo = (dataset.nodes && dataset.nodes[nodeId]) || {
    name: targetCert?.name || anchorDoc?.name || certDetails?.name || nodeId,
    issueOffice: certDetails?.authority || "Tehsil / Revenue Office"
  };

  let prereqs = ["aadhaar", "ration_card"];
  if (certDetails?.whatRequired && Array.isArray(certDetails.whatRequired)) {
    const derived = [];
    certDetails.whatRequired.forEach((reqStr) => {
      const lower = reqStr.toLowerCase();
      if (lower.includes("aadhaar") && !derived.includes("aadhaar")) derived.push("aadhaar");
      if ((lower.includes("ration") || lower.includes("address") || lower.includes("residence")) && !derived.includes("ration_card")) derived.push("ration_card");
      if ((lower.includes("marksheet") || lower.includes("sslc") || lower.includes("10th") || lower.includes("education")) && !derived.includes("sslc_marksheet")) derived.push("sslc_marksheet");
      if ((lower.includes("photo") || lower.includes("passport")) && !derived.includes("passport_photo")) derived.push("passport_photo");
      if ((lower.includes("salary") || lower.includes("income") || lower.includes("form 16") || lower.includes("pay")) && !derived.includes("salary_slip")) derived.push("salary_slip");
      if ((lower.includes("electricity") || lower.includes("utility") || lower.includes("bill")) && !derived.includes("electricity_bill")) derived.push("electricity_bill");
      if ((lower.includes("tax") || lower.includes("land") || lower.includes("patta") || lower.includes("property")) && !derived.includes("land_tax_receipt")) derived.push("land_tax_receipt");
      if ((lower.includes("caste") || lower.includes("community")) && !derived.includes("parent_caste_cert")) derived.push("parent_caste_cert");
      if ((lower.includes("affidavit") || lower.includes("stamp")) && !derived.includes("notarized_affidavit")) derived.push("notarized_affidavit");
    });
    if (derived.length > 0) prereqs = derived;
  }

  const visits = certDetails?.visits || 1;
  const days = certDetails?.days || 5;
  const fee = certDetails?.fee || 30;
  const office = certDetails?.authority || nodeInfo.issueOffice || "e-District / Revenue Counter";
  const tips = certDetails?.tips || "Verify document names and photo clarity before submitting.";

  return [
    {
      id: `${nodeId}_gen_route`,
      label: `${dataset.stateName || "State"} Standard Service Route`,
      prerequisites: prereqs,
      visits,
      days,
      fee,
      office,
      tips
    }
  ];
}

/**
 * Main AO* Solver Engine
 */
export function solveCertificateGraph({
  targetIds,
  targetCertIds,
  heldDocIds = [],
  stateKey = "kerala",
  objective = "fewest_visits" // 'fewest_visits' | 'fastest' | 'lowest_fee'
}) {
  const actualTargetIds = Array.isArray(targetIds) && targetIds.length > 0
    ? targetIds
    : (Array.isArray(targetCertIds) ? targetCertIds : []);

  const dataset = STATE_DATASETS[stateKey] || STATE_DATASETS.kerala;
  
  // Effective held set: target certificates selected as GOALS should not be treated as held
  const effectiveHeldSet = new Set(heldDocIds);
  for (const tId of actualTargetIds) {
    effectiveHeldSet.delete(tId);
  }

  const targetSet = new Set(actualTargetIds);

  if (actualTargetIds.length === 0) {
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
  const requiredNodes = new Set(); // nodes needed in the plan

  function solveNode(nodeId, currentPath = new Set()) {
    // If user already holds this document, no further expansion needed
    if (effectiveHeldSet.has(nodeId)) {
      return { cost: 0, visits: 0, days: 0, fee: 0, solved: true };
    }

    if (currentPath.has(nodeId)) {
      // Cycle detection fallback
      return { cost: Infinity, visits: Infinity, days: Infinity, fee: Infinity, solved: false };
    }

    const availableRoutes = getRoutesForNode(nodeId, stateKey);

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
        if (effectiveHeldSet.has(prereqId)) continue; // Already held

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

    // Fallback if no route satisfied prerequisites strictly
    if (!bestRoute && availableRoutes.length > 0) {
      bestRoute = availableRoutes[0];
      bestScore = getRouteCost(bestRoute, objective);
      bestSubMetrics = { visits: bestRoute.visits, days: bestRoute.days, fee: bestRoute.fee };
    } else if (!bestRoute) {
      const certDetails = getCertificateDetails(nodeId, stateKey);
      const targetCert = TARGET_CERTIFICATES.find((t) => t.id === nodeId);
      const anchorDoc = ANCHOR_DOCUMENTS.find((a) => a.id === nodeId);
      const nodeInfo = (dataset.nodes && dataset.nodes[nodeId]) || {
        name: targetCert?.name || anchorDoc?.name || certDetails?.name || nodeId,
        issueOffice: certDetails?.authority || "e-District / Revenue Office"
      };

      bestRoute = {
        id: `${nodeId}_direct_fallback`,
        label: `${dataset.stateName || "State"} Direct Revenue Service`,
        prerequisites: ["aadhaar", "ration_card"].filter(p => p !== nodeId),
        visits: certDetails?.visits || 1,
        days: certDetails?.days || 5,
        fee: certDetails?.fee || 30,
        office: certDetails?.authority || nodeInfo.issueOffice || "Tehsildar / e-District Counter",
        tips: certDetails?.tips || "Visit nearest revenue office with identity proof and application form."
      };
      bestScore = getRouteCost(bestRoute, objective);
      bestSubMetrics = { visits: bestRoute.visits, days: bestRoute.days, fee: bestRoute.fee };
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
  for (const targetId of actualTargetIds) {
    solveNode(targetId);
  }

  // Build the unified execution plan DAG (Topological ordering of steps)
  const stepsMap = new Map(); // nodeId -> step details
  const evaluatedInPlan = new Set();

  function buildPlanSteps(nodeId) {
    if (evaluatedInPlan.has(nodeId) || effectiveHeldSet.has(nodeId)) return;
    evaluatedInPlan.add(nodeId);

    let chosenRoute = chosenRoutes[nodeId];
    if (!chosenRoute) {
      const fallbackRoutes = getRoutesForNode(nodeId, stateKey);
      chosenRoute = fallbackRoutes[0];
    }
    if (!chosenRoute) return;

    // First build prerequisites (bottom-up dependency order)
    if (chosenRoute.prerequisites && Array.isArray(chosenRoute.prerequisites)) {
      for (const prereqId of chosenRoute.prerequisites) {
        if (!effectiveHeldSet.has(prereqId)) {
          buildPlanSteps(prereqId);
        }
      }
    }

    const certDetails = getCertificateDetails(nodeId, stateKey);
    const targetCert = TARGET_CERTIFICATES.find((t) => t.id === nodeId);
    const anchorDoc = ANCHOR_DOCUMENTS.find((a) => a.id === nodeId);
    const nodeInfo = (dataset.nodes && dataset.nodes[nodeId]) || {
      name: targetCert?.name || anchorDoc?.name || certDetails?.name || nodeId,
      level: certDetails?.category || "Tehsil / Office",
      issueOffice: certDetails?.authority || "Government Office"
    };

    const prereqs = chosenRoute.prerequisites || [];
    const missingPrereqs = prereqs.filter((p) => !effectiveHeldSet.has(p));
    const heldPrereqs = prereqs.filter((p) => effectiveHeldSet.has(p));

    stepsMap.set(nodeId, {
      nodeId,
      title: nodeInfo.name,
      isTarget: targetSet.has(nodeId),
      level: nodeInfo.level,
      office: chosenRoute.office || nodeInfo.issueOffice,
      routeLabel: chosenRoute.label,
      prerequisites: prereqs,
      missingPrereqs,
      heldPrereqs,
      visits: chosenRoute.visits || 1,
      days: chosenRoute.days || 5,
      fee: chosenRoute.fee || 30,
      tips: chosenRoute.tips || "Verify document requirements before applying."
    });
  }

  for (const targetId of actualTargetIds) {
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
  for (const tId of actualTargetIds) {
    if (effectiveHeldSet.has(tId)) continue;
    const naiveRoutes = getRoutesForNode(tId, stateKey);
    const naiveRoute = naiveRoutes[0];
    if (naiveRoute) {
      naiveVisits += naiveRoute.visits;
      naiveFee += naiveRoute.fee;
      // Assume naive approach also duplicates prerequisite steps
      naiveRoute.prerequisites.forEach((pId) => {
        if (!effectiveHeldSet.has(pId)) {
          const pRoutes = getRoutesForNode(pId, stateKey);
          const pRoute = pRoutes[0];
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
    .filter((id) => !effectiveHeldSet.has(id) && (!dataset.nodes || !dataset.nodes[id]))
    .map((id) => {
      const anchor = ANCHOR_DOCUMENTS.find((a) => a.id === id);
      return anchor ? anchor.name : id;
    });

  const fulfilledDocs = ANCHOR_DOCUMENTS.filter((a) => effectiveHeldSet.has(a.id)).map((a) => a.name);

  return {
    success: true,
    stateName: dataset.stateName || "Selected State",
    portalName: dataset.portalName || "e-District Portal",
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
        ? `Saved ${savedVisits} extra office trip(s) & saved ₹${savedFees} in duplicate fees by reusing your ID papers!`
        : "Optimal direct route identified for your certificates with no extra trips."
  };
}

