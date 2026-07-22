import React from "react";
import { MapPin, Compass, Sparkles, Building2, Layers } from "lucide-react";

/**
 * Skeleton component for Directory / Service Cards view
 */
export function DirectorySkeleton() {
  return (
    <div className="space-y-4 animate-fade-in w-full">
      {/* Feed Header Skeleton */}
      <div className="flex justify-between items-end gap-4 px-1 mb-2">
        <div className="space-y-1.5">
          <div className="h-2.5 w-24 bg-zinc-800/80 rounded-full animate-pulse" />
          <div className="h-5 w-48 bg-zinc-800/90 rounded-md animate-pulse" />
        </div>
        <div className="h-3 w-28 bg-zinc-800/60 rounded-full animate-pulse" />
      </div>

      {/* Grid / List of card skeletons */}
      <div className="grid grid-cols-1 gap-3.5">
        {[1, 2, 3, 4, 5, 6].map((idx) => (
          <div
            key={idx}
            className="bg-zinc-900/80 border border-zinc-800/60 rounded-2xl p-4 sm:p-5 flex flex-row gap-3 sm:gap-4 relative overflow-hidden"
            style={{ animationDelay: `${idx * 0.08}s` }}
          >
            {/* Shimmer gradient overlay */}
            <div className="absolute inset-0 -translate-x-full animate-[shimmer_2s_infinite] bg-gradient-to-r from-transparent via-zinc-800/20 to-transparent" />

            {/* Icon Tile Skeleton */}
            <div className="w-12 h-12 lg:w-13 lg:h-13 rounded-xl bg-zinc-800/90 animate-pulse shrink-0 flex items-center justify-center">
              <Building2 className="w-5 h-5 text-zinc-700/60" />
            </div>

            {/* Content Skeleton */}
            <div className="flex-1 min-w-0 space-y-2.5">
              <div className="flex items-start justify-between gap-2">
                <div className="h-4 w-3/5 bg-zinc-800/90 rounded-md animate-pulse" />
                <div className="h-4 w-16 bg-emerald-950/40 border border-emerald-500/20 rounded-full animate-pulse" />
              </div>

              <div className="h-2.5 w-24 bg-zinc-800/60 rounded-full animate-pulse" />

              <div className="space-y-1.5 pt-0.5">
                <div className="h-3 w-full bg-zinc-800/50 rounded animate-pulse" />
                <div className="h-3 w-4/5 bg-zinc-800/40 rounded animate-pulse" />
              </div>

              <div className="flex items-center gap-4 pt-1">
                <div className="h-3 w-16 bg-zinc-800/60 rounded animate-pulse" />
                <div className="h-3 w-20 bg-zinc-800/50 rounded animate-pulse" />
                <div className="h-3 w-24 bg-zinc-800/40 rounded animate-pulse" />
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

/**
 * Skeleton component for Map view (shown during lazy loading and transition)
 */
export function MapSkeleton() {
  return (
    <div className="flex-1 flex flex-col gap-4 p-4 sm:p-5 animate-fade-in w-full h-full min-h-[420px]">
      {/* Map Toolbar Skeleton */}
      <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-none">
        {[1, 2, 3, 4, 6].map((i) => (
          <div
            key={i}
            className="h-8 w-20 bg-zinc-900 border border-zinc-800/80 rounded-full animate-pulse shrink-0"
          />
        ))}
        <div className="ml-auto h-4 w-28 bg-zinc-800/60 rounded-full animate-pulse shrink-0 hidden sm:block" />
      </div>

      {/* Map Canvas Skeleton */}
      <div className="flex-1 relative rounded-2xl overflow-hidden bg-zinc-950 border border-zinc-800/90 shadow-2xl flex flex-col justify-between p-6">
        {/* Subtle grid pattern background */}
        <div 
          className="absolute inset-0 opacity-20" 
          style={{
            backgroundImage: `radial-gradient(circle, #3f3f46 1px, transparent 1px)`,
            backgroundSize: "24px 24px"
          }} 
        />

        {/* Shimmer overlay */}
        <div className="absolute inset-0 -translate-x-full animate-[shimmer_2.5s_infinite] bg-gradient-to-r from-transparent via-emerald-500/5 to-transparent" />

        {/* Top left floating badge */}
        <div className="relative z-10 flex items-center gap-2 bg-zinc-900/90 border border-zinc-800 backdrop-blur-md px-3.5 py-2 rounded-xl text-xs text-zinc-300 w-fit shadow-lg">
          <Compass className="w-4 h-4 text-emerald-400 animate-spin" style={{ animationDuration: "6s" }} />
          <span className="font-bold tracking-wide">Initializing interactive map...</span>
        </div>

        {/* Simulated Map Markers pulsing on grid */}
        <div className="absolute inset-0 pointer-events-none flex items-center justify-center">
          {/* Center radar pulse */}
          <div className="relative flex items-center justify-center">
            <div className="w-32 h-32 rounded-full border border-emerald-500/20 bg-emerald-500/5 animate-ping" style={{ animationDuration: "3s" }} />
            <div className="absolute w-20 h-20 rounded-full border border-emerald-500/30 bg-emerald-500/10 animate-pulse" />
            <div className="absolute w-10 h-10 rounded-full bg-emerald-500/20 border border-emerald-400/50 flex items-center justify-center shadow-lg shadow-emerald-500/20">
              <MapPin className="w-5 h-5 text-emerald-400 animate-bounce" />
            </div>
          </div>

          {/* Random pulsing nodes */}
          <div className="absolute top-1/4 left-1/4 w-3 h-3 rounded-full bg-rose-500/80 animate-ping" style={{ animationDuration: "2.2s" }} />
          <div className="absolute top-1/3 right-1/4 w-3 h-3 rounded-full bg-amber-500/80 animate-ping" style={{ animationDuration: "2.8s" }} />
          <div className="absolute bottom-1/4 left-1/3 w-3 h-3 rounded-full bg-blue-500/80 animate-ping" style={{ animationDuration: "1.9s" }} />
          <div className="absolute bottom-1/3 right-1/3 w-3 h-3 rounded-full bg-purple-500/80 animate-ping" style={{ animationDuration: "2.5s" }} />
        </div>

        {/* Bottom controls skeleton */}
        <div className="relative z-10 flex justify-between items-end gap-3">
          <div className="bg-zinc-900/90 border border-zinc-800 backdrop-blur-md px-3 py-2 rounded-xl text-[10px] text-zinc-400 font-mono space-y-1">
            <div className="flex items-center gap-1.5 font-bold text-emerald-400">
              <Sparkles className="w-3 h-3" />
              <span>Vector Tile Renderer</span>
            </div>
            <div>Loading spatial coordinates...</div>
          </div>

          <div className="flex flex-col gap-1.5">
            <div className="w-8 h-8 rounded-lg bg-zinc-900 border border-zinc-800 animate-pulse" />
            <div className="w-8 h-8 rounded-lg bg-zinc-900 border border-zinc-800 animate-pulse" />
          </div>
        </div>
      </div>
    </div>
  );
}
