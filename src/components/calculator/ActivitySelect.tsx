"use client";

import { useState, useMemo } from "react";
import { getYearConfig, getNormaForCounty, type NormaActivity } from "@/lib/tax-engine";
import { getActivitiesForCounty } from "@/lib/tax-engine/norme-lookup";
import { Search, X } from "lucide-react";
import { formatNumber } from "@/lib/format";

interface ActivitySelectProps {
  readonly value: string;
  readonly year: number;
  readonly county: string;
  readonly onChange: (code: string) => void;
}

interface ActivityItem {
  readonly code: string;
  readonly label: string;
  readonly norma: number;
}

export function ActivitySelect({ value, year, county, onChange }: ActivitySelectProps) {
  const [search, setSearch] = useState("");
  const [isOpen, setIsOpen] = useState(false);

  // Merge county ANAF data with config defaults
  const activities: ActivityItem[] = useMemo(() => {
    const config = getYearConfig(year);
    const countyActivities = getActivitiesForCounty(county, year);

    if (countyActivities.length > 0) {
      // Use county data, enriching labels from config where available
      const configLabels = new Map(
        config.normaActivities.map((a) => [a.code, a.label])
      );
      const countyCAENs = new Set(countyActivities.map((a) => a.caen));

      const countyItems: ActivityItem[] = countyActivities.map((a) => ({
        code: a.caen,
        label: a.label || configLabels.get(a.caen) || `CAEN ${a.caen}`,
        norma: a.norma,
      }));

      // Add config defaults that are missing from county data (e.g. IT codes 6201, 6311)
      const missingDefaults: ActivityItem[] = config.normaActivities
        .filter((a) => !countyCAENs.has(a.code))
        .map((a) => ({
          code: a.code,
          label: a.label,
          norma: a.annualNorma,
        }));

      return [...missingDefaults, ...countyItems];
    }

    // Fallback to config defaults
    return config.normaActivities.map((a) => ({
      code: a.code,
      label: a.label,
      norma: a.annualNorma,
    }));
  }, [year, county]);

  const filtered = useMemo(() => {
    if (!search) return activities;
    const lower = search.toLowerCase();
    return activities.filter(
      (a) =>
        a.label.toLowerCase().includes(lower) || a.code.includes(search)
    );
  }, [activities, search]);

  const selected = activities.find((a) => a.code === value);

  return (
    <div className="relative">
      <label className="block text-sm font-medium text-zinc-700 mb-1.5">
        Ce activitate ai?
      </label>
      <div
        className="relative cursor-pointer"
        onClick={() => setIsOpen(!isOpen)}
      >
        <div className="flex items-center gap-2 rounded-xl border border-zinc-300 bg-white px-4 py-3 text-sm transition-colors hover:border-zinc-400">
          <Search className="h-4 w-4 text-zinc-500 shrink-0" />
          {isOpen ? (
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              onClick={(e) => e.stopPropagation()}
              placeholder="Cauta activitate sau cod CAEN..."
              className="flex-1 bg-transparent outline-none placeholder:text-zinc-500"
              autoFocus
            />
          ) : (
            <span className="flex-1 truncate text-zinc-700">
              {selected ? (
                <>
                  <span className="text-zinc-500 mr-1.5">{selected.code}</span>
                  {selected.label}
                </>
              ) : (
                <span className="text-zinc-500">Selecteaza activitatea</span>
              )}
            </span>
          )}
          {search && isOpen && (
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                setSearch("");
              }}
              className="text-zinc-500 hover:text-zinc-600"
            >
              <X className="h-4 w-4" />
            </button>
          )}
        </div>
      </div>

      {isOpen && (
        <div className="absolute z-20 mt-1.5 w-full rounded-xl border border-zinc-200 bg-white shadow-lg max-h-64 overflow-y-auto">
          {filtered.length === 0 ? (
            <div className="px-4 py-3 text-sm text-zinc-500">
              Nicio activitate gasita
            </div>
          ) : (
            filtered.map((activity) => (
              <button
                key={activity.code}
                type="button"
                onClick={() => {
                  onChange(activity.code);
                  setIsOpen(false);
                  setSearch("");
                }}
                className={`w-full px-4 py-2.5 text-left text-sm transition-colors hover:bg-zinc-50 flex items-center justify-between ${
                  activity.code === value ? "bg-zinc-50 font-medium" : ""
                }`}
              >
                <span className="truncate">
                  <span className="text-zinc-500 mr-1.5">{activity.code}</span>
                  {activity.label}
                </span>
                <span className="text-xs text-zinc-500 ml-2 shrink-0">
                  {formatNumber(activity.norma)} lei/an
                </span>
              </button>
            ))
          )}
        </div>
      )}
    </div>
  );
}
