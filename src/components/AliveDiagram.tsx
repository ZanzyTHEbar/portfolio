import { useState } from "react";
import { motion, useReducedMotion } from "motion/react";

export interface DiagramItem {
  slug: string;
  title: string;
  thesis: string;
}

export interface AliveDiagramProps {
  items: DiagramItem[];
  selected: string | null;
  onSelect: (slug: string | null) => void;
}

interface NodeDef {
  id: string;
  label: string;
  /** Desktop box in viewBox units. */
  x: number;
  y: number;
  w: number;
  h: number;
  /** Mobile (<640px) box in viewBox units. */
  mx: number;
  my: number;
  mw: number;
  mh: number;
  /** Mobile tooltip renders above the node (default below). */
  tipAboveMobile?: boolean;
}

const CHIP_ID = "you-are-here";

// ponytail: fixed geometry, no graph lib; revisit with @xyflow/react past ~100 nodes.
const NODES: NodeDef[] = [
  { id: "strange", label: "STRANGE IDEA", x: 48, y: 157, w: 124, h: 46, mx: 370, my: 6, mw: 220, mh: 30 },
  { id: "hypothesis", label: "HYPOTHESIS", x: 196, y: 157, w: 124, h: 46, mx: 370, my: 50, mw: 220, mh: 30 },
  { id: "constraint", label: "CONSTRAINT", x: 344, y: 157, w: 124, h: 46, mx: 370, my: 94, mw: 220, mh: 30 },
  { id: "system", label: "SYSTEM", x: 492, y: 157, w: 110, h: 46, mx: 370, my: 138, mw: 220, mh: 30 },
  { id: "software", label: "SOFTWARE", x: 638, y: 70, w: 140, h: 42, mx: 370, my: 182, mw: 220, mh: 30 },
  { id: "hardware", label: "HARDWARE", x: 638, y: 159, w: 140, h: 42, mx: 370, my: 226, mw: 220, mh: 30 },
  { id: "research", label: "RESEARCH", x: 638, y: 248, w: 140, h: 42, mx: 370, my: 270, mw: 220, mh: 30 },
  { id: "reality", label: "REALITY", x: 803, y: 159, w: 120, h: 42, mx: 370, my: 314, mw: 220, mh: 30 },
  { id: "you-are-here", label: "YOU ARE HERE", x: 788, y: 64, w: 150, h: 30, mx: 370, my: 358, mw: 220, mh: 30, tipAboveMobile: true },
];

const CHIP_CAPTION = "Present state of the lab.";

const DESKTOP_EDGES: Array<[number, number, number, number]> = [
  [172, 180, 192, 180],
  [320, 180, 340, 180],
  [468, 180, 488, 180],
  [602, 172, 634, 95],
  [602, 180, 634, 180],
  [602, 188, 634, 265],
  [782, 95, 799, 176],
  [782, 180, 799, 180],
  [782, 265, 799, 184],
];

const MOBILE_EDGES: Array<[number, number, number, number]> = [
  [480, 36, 480, 50],
  [480, 80, 480, 94],
  [480, 124, 480, 138],
  [480, 168, 480, 182],
  [480, 212, 480, 226],
  [480, 256, 480, 270],
  [480, 300, 480, 314],
  [480, 344, 480, 358],
];

// CSS-only tooltips: each HTML tip is revealed by :hover / :focus-visible on
// its node button. Tips live in an overlay layer (not foreignObject) so long
// theses are never clipped by the node box.
const tipCss =
  NODES.map((n) =>
    (["d", "m"] as const)
      .map(
        (g) =>
          `.alive-root:has(#alive-node-${g}-${n.id}:is(:hover,:focus-visible)) #alive-tip-${g}-${n.id}`,
      )
      .join(",\n"),
  ).join(",\n") +
  "\n{ opacity: 1; }\n@media (prefers-reduced-motion: reduce) {\n  .alive-tip { transition: none !important; }\n}";

const TIP_BASE =
  "alive-tip pointer-events-none absolute w-[180px] max-w-[calc(100vw-2rem)] -translate-x-1/2 border border-border bg-surface px-3 py-2 font-mono text-[11px] leading-relaxed text-fg opacity-0 transition-opacity duration-150";

// ponytail: each of the 8 item-nodes owns a round-robin shard (pos = index % 8),
// so every `items` entry has exactly one home; activating a node pins its
// current shard entry and advances to the next. Cheapest fix that keeps the
// fixed 9-chip layout and makes all Tier S slugs reachable + focusable.
const ITEM_NODES: NodeDef[] = NODES.filter((n) => n.id !== CHIP_ID);
const POS: Record<string, number> = Object.fromEntries(
  ITEM_NODES.map((n, i) => [n.id, i]),
);

export function AliveDiagram({ items, selected, onSelect }: AliveDiagramProps) {
  const reduceMotion = useReducedMotion() ?? false;
  const [offsets, setOffsets] = useState<number[]>(() =>
    ITEM_NODES.map(() => 0),
  );

  const shard = (pos: number): DiagramItem[] =>
    ITEM_NODES.length === 0
      ? []
      : items.filter((_, i) => i % ITEM_NODES.length === pos);
  const current = (pos: number): DiagramItem | undefined => {
    const s = shard(pos);
    if (s.length === 0) return undefined;
    return s[(offsets[pos] ?? 0) % s.length];
  };
  const isChip = (n: NodeDef): boolean => n.id === CHIP_ID;
  const thesisFor = (n: NodeDef): string =>
    isChip(n) ? CHIP_CAPTION : (current(POS[n.id])?.thesis ?? "");

  const activate = (n: NodeDef): void => {
    if (isChip(n)) {
      onSelect(null);
      return;
    }
    const pos = POS[n.id];
    const s = shard(pos);
    const item = current(pos);
    if (!item) {
      onSelect(null);
      return;
    }
    onSelect(item.slug);
    if (s.length > 1) {
      setOffsets((prev) =>
        prev.map((o, i) => (i === pos ? (o + 1) % s.length : o)),
      );
    }
  };

  const selectedFor = (n: NodeDef): boolean =>
    isChip(n)
      ? selected === null
      : shard(POS[n.id]).some((s) => s.slug === selected);

  const labelFor = (n: NodeDef): string => {
    if (isChip(n)) return `${n.label} — clear pinned dossier`;
    const s = shard(POS[n.id]);
    const item = current(POS[n.id]);
    if (!item) return `${n.label} — no dossier yet`;
    return s.length > 1
      ? `${n.label} — ${item.title} (${((offsets[POS[n.id]] ?? 0) % s.length) + 1} of ${s.length}; activate for next)`
      : `${n.label} — ${item.title}`;
  };

  return (
    <div
      className="alive-root hairline bg-elevated p-4 sm:p-6"
      onKeyDown={(e) => {
        if (e.key === "Escape") onSelect(null);
      }}
    >
      <style>{tipCss}</style>
      <div className="relative">
        <svg
          viewBox="0 0 960 420"
          role="group"
          aria-label="Pipeline: strange idea to reality. Tab to a node, press Enter to pin its dossier, press Escape to clear."
          className="block h-auto w-full"
        >
          <defs>
            <marker
              id="alive-arrow"
              viewBox="0 0 8 8"
              refX={7}
              refY={4}
              markerWidth={7}
              markerHeight={7}
              orient="auto-start-reverse"
            >
              <path
                d="M0 0 L8 4 L0 8"
                fill="none"
                stroke="#2a2a27"
                strokeWidth={1.5}
              />
            </marker>
          </defs>
          <g className="hidden sm:block">
            {DESKTOP_EDGES.map(([x1, y1, x2, y2], i) => (
              <line
                key={i}
                x1={x1}
                y1={y1}
                x2={x2}
                y2={y2}
                className="stroke-border"
                strokeWidth={1}
                markerEnd="url(#alive-arrow)"
              />
            ))}
            <line
              x1={863}
              y1={94}
              x2={863}
              y2={155}
              className="stroke-border"
              strokeWidth={1}
              strokeDasharray="4 4"
            />
            {NODES.map((n) => (
              <NodeButton
                key={n.id}
                node={n}
                x={n.x}
                y={n.y}
                w={n.w}
                h={n.h}
                group="d"
                linked={isChip(n) ? undefined : current(POS[n.id])}
                isSelected={selectedFor(n)}
                pulse={n.id === "strange" && !reduceMotion}
                reduceMotion={reduceMotion}
                ariaLabel={labelFor(n)}
                onActivate={() => activate(n)}
              />
            ))}
          </g>
          <g className="sm:hidden">
            {MOBILE_EDGES.map(([x1, y1, x2, y2], i) => (
              <line
                key={i}
                x1={x1}
                y1={y1}
                x2={x2}
                y2={y2}
                className="stroke-border"
                strokeWidth={1}
                markerEnd="url(#alive-arrow)"
              />
            ))}
            {NODES.map((n) => (
              <NodeButton
                key={n.id}
                node={n}
                x={n.mx}
                y={n.my}
                w={n.mw}
                h={n.mh}
                group="m"
                linked={isChip(n) ? undefined : current(POS[n.id])}
                isSelected={selectedFor(n)}
                pulse={n.id === "strange" && !reduceMotion}
                reduceMotion={reduceMotion}
                ariaLabel={labelFor(n)}
                onActivate={() => activate(n)}
              />
            ))}
          </g>
        </svg>
        <div className="pointer-events-none absolute inset-0 hidden sm:block">
          {NODES.map((n) => (
            <div
              key={n.id}
              id={`alive-tip-d-${n.id}`}
              role="tooltip"
              className={TIP_BASE}
              style={{
                left: `${((n.x + n.w / 2) / 960) * 100}%`,
                top: `${((n.y + n.h + 8) / 420) * 100}%`,
              }}
            >
              {thesisFor(n)}
            </div>
          ))}
        </div>
        <div className="pointer-events-none absolute inset-0 sm:hidden">
          {NODES.map((n) => (
            <div
              key={n.id}
              id={`alive-tip-m-${n.id}`}
              role="tooltip"
              className={
                n.tipAboveMobile ? `${TIP_BASE} -translate-y-full` : TIP_BASE
              }
              style={{
                left: `${((n.mx + n.mw / 2) / 960) * 100}%`,
                top: n.tipAboveMobile
                  ? `${((n.my - 8) / 420) * 100}%`
                  : `${((n.my + n.mh + 8) / 420) * 100}%`,
              }}
            >
              {thesisFor(n)}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

interface NodeButtonProps {
  node: NodeDef;
  x: number;
  y: number;
  w: number;
  h: number;
  group: "d" | "m";
  linked?: DiagramItem;
  isSelected: boolean;
  pulse: boolean;
  reduceMotion: boolean;
  ariaLabel: string;
  onActivate: () => void;
}

function NodeButton({
  node,
  x,
  y,
  w,
  h,
  group,
  linked,
  isSelected,
  pulse,
  reduceMotion,
  ariaLabel,
  onActivate,
}: NodeButtonProps) {
  return (
    <motion.g
      layout
      transition={
        reduceMotion
          ? { duration: 0 }
          : { duration: 0.18, ease: "easeOut" }
      }
    >
      <foreignObject x={x} y={y} width={w} height={h}>
        <button
          id={`alive-node-${group}-${node.id}`}
          type="button"
          onClick={onActivate}
          aria-describedby={`alive-tip-${group}-${node.id}`}
          aria-pressed={linked ? isSelected : undefined}
          aria-label={ariaLabel}
          className="group block h-full w-full bg-transparent p-0"
        >
          <span
            className={[
              "flex h-full w-full items-center justify-center border px-2 text-center font-mono text-[11px] uppercase tracking-kicker transition-colors duration-150",
              isSelected
                ? "border-signal bg-elevated text-fg"
                : "border-border bg-elevated text-muted group-hover:border-fg group-hover:text-fg group-focus-visible:border-fg group-focus-visible:text-fg",
              pulse ? "signal-pulse" : "",
            ].join(" ")}
          >
            {node.label}
          </span>
        </button>
      </foreignObject>
    </motion.g>
  );
}
