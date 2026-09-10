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
    title: "Embedded beginnings",
    kind: "experiment",
    summary: "Firmware, boards, and the first control loops.",
    projectSlugs: ["openiris"],
  },
  {
    period: "2019",
    title: "Prometheon — CTO/co-founder",
    kind: "career",
    summary: "Deep-tech energy storage; fuel-cell materials research to company.",
    projectSlugs: ["prometheon"],
  },
  {
    period: "2022",
    title: "Platforms + open-source hardware",
    kind: "career",
    summary: "Platform engineering by day; EyeTrackVR firmware by night.",
    projectSlugs: ["openiris", "easynetworkmanager"],
  },
  {
    period: "2023",
    title: "Hardware meets reality",
    kind: "experiment",
    summary: "Hydroponics, sensors, PCBs — software with a watering schedule.",
    projectSlugs: ["esp32-greenhouse"],
  },
  {
    period: "2024",
    title: "Linux, Go, and the AI-native toolchain",
    kind: "experiment",
    summary: "Reproducible environments, Go systems, cursor-rules era begins.",
    projectSlugs: ["agent-tooling"],
  },
  {
    period: "2025",
    title: "Agent infrastructure",
    kind: "career",
    summary: "Runtimes, memory, isolation: DragonScale, MCP Memory, WyrmLock, AIRE.",
    projectSlugs: ["dragonscale", "mcp-memory", "wyrmlock", "aire"],
  },
  {
    period: "2026",
    title: "The Lab",
    kind: "experiment",
    summary: "This site — the operating system over the archive.",
  },
];
