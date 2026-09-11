// Trajectory: two-lane timeline (career / experiment). LinkedIn owns the canonical
// chronology; this file is the editorial cut. Dates + titles to verify against
// LinkedIn/GitHub before publish. Origins: docs/PROVENANCE.md §1–§2.

export interface TrajectoryEntry {
  period: string;
  title: string;
  kind: "career" | "experiment";
  summary: string;
  projectSlugs?: string[];
}

export const trajectory: TrajectoryEntry[] = [
  {
    period: "2018",
    title: "Embedded systems",
    kind: "experiment",
    summary: "Firmware, boards, and control loops.",
  },
  {
    period: "2019",
    title: "Prometheon co-founder/director",
    kind: "career",
    summary: "Fuel-cell materials research at Prometheon.",
    projectSlugs: ["prometheon"],
  },
  {
    period: "2022",
    title: "Platform engineering and open-source hardware",
    kind: "career",
    summary: "Platform engineering and open-source hardware work.",
    projectSlugs: ["easynetworkmanager"],
  },
  {
    period: "2023",
    title: "Greenhouse hardware",
    kind: "experiment",
    summary: "Hydroponics, sensors, and PCBs for a greenhouse system.",
    projectSlugs: ["esp32-greenhouse"],
  },
  {
    period: "2024",
    title: "Linux, Go, and developer tooling",
    kind: "experiment",
    summary: "Reproducible environments, Go systems, and cursor-rules.",
    projectSlugs: ["agent-tooling"],
  },
  {
    period: "2025",
    title: "Agent infrastructure",
    kind: "career",
    summary: "Runtimes, memory, and isolation across DragonScale, MCP Memory, WyrmLock, and AIRE.",
    projectSlugs: ["dragonscale", "mcp-memory", "wyrmlock", "aire"],
  },
  {
    period: "2026",
    title: "Portfolio site",
    kind: "experiment",
    summary: "A portfolio site for projects, notes, and trajectory.",
  },
];
