// Lab shell content: thesis, methodology, link-out strips, contact.
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
    "I turn strange ideas into working systems. I build at the boundaries — software and hardware, agents and operating systems, research and engineering.",
  howIThink: [
    {
      title: "Define the trust boundary",
      description: "What is allowed to do what, to whom? Write it down before code.",
    },
    {
      title: "Define the resource envelope",
      description: "Memory, latency, power, money. Constraints are the design.",
    },
    {
      title: "Minimize capabilities",
      description: "Give each part the smallest power that lets it do its job.",
    },
    {
      title: "Make failure explicit",
      description: "Every ugly case gets a path, a log line, and a status.",
    },
    {
      title: "Instrument everything",
      description: "If you can't see it, you can't claim it works.",
    },
    {
      title: "Test the ugly cases",
      description: "Power loss, packet loss, bad input, tired operator.",
    },
  ] as HowIThinkStep[],
  currentlyThinking: {
    label: "@ZacariahHeim on X",
    href: "https://x.com/ZacariahHeim",
  } as LinkOut,
  consultancy: {
    label: "Consultancy",
    href: "https://zacariahheim.com",
  } as LinkOut,
  benchScraps: [
    { label: "Gists — bench scraps", href: "https://gist.github.com/ZanzyTHEbar" },
  ] as LinkOut[],
  contact: {
    email: "",
    github: "https://github.com/ZanzyTHEbar",
    x: "https://x.com/ZacariahHeim",
    consultancy: "https://zacariahheim.com",
    linkedin: "https://www.linkedin.com/in/zacariahheim",
  },
};
