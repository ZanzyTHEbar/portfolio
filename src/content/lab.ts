// Site content: thesis, working practices, link-out strips, contact.
// Social properties are LINKS, not feeds (DECISIONS.md D6). Handles per owner spec:
// X ZacariahHeim, GitHub ZanzyTHEbar, LinkedIn zacariahheim.

export interface HowIThinkStep {
  title: string;
  description: string;
}

export interface LinkOut {
  label: string;
  href: string;
}

export const lab = {
  thesis:
    "I build embedded hardware, Go systems, and tools for agents.",
  howIThink: [
    {
      title: "Map trust boundaries",
      description: "Before implementation, list each actor, its data access, and its allowed actions.",
    },
    {
      title: "Set resource limits",
      description: "Set memory, latency, power, and cost limits before choosing an approach.",
    },
    {
      title: "Use least privilege",
      description: "Each component receives only the permissions needed for its task.",
    },
    {
      title: "Handle failures explicitly",
      description: "For expected failures, define recovery paths, logs, and user-visible status.",
    },
    {
      title: "Add instrumentation",
      description: "Add metrics, logs, and traces that show how the system behaves.",
    },
    {
      title: "Test adverse conditions",
      description: "Run tests for power loss, packet loss, invalid input, and operator mistakes.",
    },
  ] as HowIThinkStep[],
  currentlyThinking: {
    label: "@ZacariahHeim",
    href: "https://x.com/ZacariahHeim",
  } as LinkOut,
  consultancy: {
    label: "Consultancy",
    href: "https://zacariahheim.com",
  } as LinkOut,
  benchScraps: [
    { label: "Gists", href: "https://gist.github.com/ZanzyTHEbar" },
  ] as LinkOut[],
  contact: {
    email: "",
    github: "https://github.com/ZanzyTHEbar",
    x: "https://x.com/ZacariahHeim",
    consultancy: "https://zacariahheim.com",
    linkedin: "https://www.linkedin.com/in/zacariahheim",
  },
};
