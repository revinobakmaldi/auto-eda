"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { BarChart3, Grid3X3, Variable, AlertTriangle, GitBranch, Table } from "lucide-react";
import { cn } from "@/lib/utils";

const tabs = [
  { id: "overview", label: "Overview", icon: Grid3X3 },
  { id: "variables", label: "Variables", icon: Variable },
  { id: "missing", label: "Missing", icon: AlertTriangle },
  { id: "correlations", label: "Correlations", icon: GitBranch },
  { id: "sample", label: "Sample", icon: Table },
] as const;

interface DashboardNavProps {
  hasMissing: boolean;
  hasCorrelations: boolean;
}

export function DashboardNav({ hasMissing, hasCorrelations }: DashboardNavProps) {
  const [active, setActive] = useState("overview");

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) {
            setActive(entry.target.id.replace("section-", ""));
          }
        }
      },
      { rootMargin: "-20% 0px -60% 0px" }
    );

    tabs.forEach((tab) => {
      const el = document.getElementById(`section-${tab.id}`);
      if (el) observer.observe(el);
    });

    return () => observer.disconnect();
  }, []);

  const handleClick = (id: string) => {
    const el = document.getElementById(`section-${id}`);
    if (el) {
      el.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  };

  const visibleTabs = tabs.filter((tab) => {
    if (tab.id === "missing" && !hasMissing) return false;
    if (tab.id === "correlations" && !hasCorrelations) return false;
    return true;
  });

  return (
    <motion.div
      initial={{ opacity: 0, y: -10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.2 }}
      className="sticky top-0 z-40 -mx-4 mb-8 overflow-x-auto border-b border-white/10 bg-background px-4 pt-[57px] sm:-mx-6 sm:px-6"
    >
      <div className="flex gap-1">
        {visibleTabs.map((tab) => {
          const Icon = tab.icon;
          return (
            <button
              key={tab.id}
              onClick={() => handleClick(tab.id)}
              className={cn(
                "flex items-center gap-1.5 whitespace-nowrap border-b-2 px-3 py-3 text-sm transition-colors",
                active === tab.id
                  ? "border-primary text-primary"
                  : "border-transparent text-gray-400 hover:border-white/20 hover:text-gray-200"
              )}
            >
              <Icon className="h-4 w-4" />
              {tab.label}
            </button>
          );
        })}
      </div>
    </motion.div>
  );
}

// Suppress unused import warning — icon is used dynamically
void BarChart3;
