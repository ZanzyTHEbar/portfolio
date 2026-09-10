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
}

interface StatusContent {
  title: string;
  thesis: string;
}

const CHIP_ID = "you-are-here";
const STATUS_ID = "alive-status";

// ponytail: fixed geometry, no graph lib; revisit with @xyflow/react past ~100 nodes.
const NODES: NodeDef[] = [
  { id: "strange", label: "STRANGE IDEA", x: 48, y: 157, w: 124, h: 46 },
  { id: "hypothesis", label: "HYPOTHESIS", x: 196, y: 157, w: 124, h: 46 },
  { id: "constraint", label: "CONSTRAINT", x: 344, y: 157, w: 124, h: 46 },
  { id: "system", label: "SYSTEM", x: 492, y: 157, w: 110, h: 46 },
  { id: "software", label: "SOFTWARE", x: 638, y: 70, w: 140, h: 42 },
  { id: "hardware", label: "HARDWARE", x: 638, y: 159, w: 140, h: 42 },
  { id: "research", label: "RESEARCH", x: 638, y: 248, w: 140, h: 42 },
  { id: "reality", label: "REALITY", x: 803, y: 159, w: 120, h: 42 },
  { id: "you-are-here", label: "YOU ARE HERE", x: 788, y: 48, w: 150, h: 46 },
];

const CHIP_CAPTION = "No project selected.";
const IDLE_STATUS: StatusContent = {
  title: "YOU ARE HERE",
  thesis: CHIP_CAPTION,
};

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

const ITEM_NODES = NODES.filter((n) => n.id !== CHIP_ID);
const POS: Record<string, number> = Object.fromEntries(ITEM_NODES.map((n, i) => [n.id, i]));
const MOBILE_WIDTH = 320;
const MOBILE_NODE_X = 16;
const MOBILE_NODE_Y = 7;
const MOBILE_NODE_WIDTH = 288;
const MOBILE_NODE_HEIGHT = 50;
const MOBILE_NODE_GAP = 10;
const MOBILE_HEIGHT = 544;

export function AliveDiagram({ items, selected, onSelect }: AliveDiagramProps) {
  const reduceMotion = useReducedMotion() ?? false;
  const [preview, setPreview] = useState<StatusContent | null>(null);
  const selectedItem = items.find((item) => item.slug === selected);

  const isChip = (node: NodeDef): boolean => node.id === CHIP_ID;
  const linkedItem = (node: NodeDef): DiagramItem | undefined =>
    isChip(node) ? undefined : items[POS[node.id]];
  const statusFor = (node: NodeDef): StatusContent => {
    const item = linkedItem(node);
    if (item) return item;
    if (isChip(node)) return { title: node.label, thesis: CHIP_CAPTION };
    return { title: node.label, thesis: "No project linked." };
  };
  const status = preview ?? selectedItem ?? IDLE_STATUS;

  const activate = (node: NodeDef): void => {
    const item = linkedItem(node);
    setPreview(statusFor(node));
    onSelect(isChip(node) ? null : (item?.slug ?? null));
  };

  const selectItem = (item: DiagramItem): void => {
    setPreview(item);
    onSelect(item.slug);
  };

  const selectedFor = (node: NodeDef): boolean => {
    const item = linkedItem(node);
    return isChip(node) ? selected === null : item?.slug === selected;
  };

  const labelFor = (node: NodeDef): string => {
    if (isChip(node)) return `${node.label} — clear selection`;
    const item = linkedItem(node);
    return item ? `${node.label} — ${item.title}` : `${node.label} — no dossier yet`;
  };

  return (
    <div
      className="alive-root hairline bg-elevated p-4 sm:p-6"
      onKeyDown={(event) => {
        if (event.key === "Escape") {
          setPreview(null);
          onSelect(null);
        }
      }}
    >
      <p className="mb-4 font-mono text-xs uppercase tracking-kicker text-subtle">
        Pipeline stages link eight projects. Select any Tier S project below.
      </p>
      <svg
        viewBox="0 0 960 420"
        role="group"
        aria-label="Pipeline: strange idea to reality. Tab to a node, press Enter to pin its dossier, press Escape to clear."
        className="hidden h-auto w-full sm:block"
      >
        <ArrowMarker id="alive-arrow-desktop" />
        {DESKTOP_EDGES.map(([x1, y1, x2, y2], index) => (
          <line
            key={index}
            x1={x1}
            y1={y1}
            x2={x2}
            y2={y2}
            className="stroke-border"
            strokeWidth={1}
            markerEnd="url(#alive-arrow-desktop)"
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
        {NODES.map((node) => (
          <NodeButton
            key={node.id}
            node={node}
            x={node.x}
            y={node.y}
            w={node.w}
            h={node.h}
            group="d"
            linked={linkedItem(node)}
            isSelected={selectedFor(node)}
            pulse={node.id === "strange" && !reduceMotion}
            reduceMotion={reduceMotion}
            ariaLabel={labelFor(node)}
            onActivate={() => activate(node)}
            onPreview={() => setPreview(statusFor(node))}
            onPreviewEnd={() => setPreview(null)}
          />
        ))}
      </svg>
      <svg
        viewBox={`0 0 ${MOBILE_WIDTH} ${MOBILE_HEIGHT}`}
        role="group"
        aria-label="Pipeline: strange idea to reality. Tab to a node, press Enter to pin its dossier, press Escape to clear."
        className="block h-auto w-full sm:hidden"
      >
        <ArrowMarker id="alive-arrow-mobile" />
        {NODES.slice(0, -1).map((node, index) => {
          const y = MOBILE_NODE_Y + index * (MOBILE_NODE_HEIGHT + MOBILE_NODE_GAP);
          return (
            <line
              key={node.id}
              x1={MOBILE_WIDTH / 2}
              y1={y + MOBILE_NODE_HEIGHT}
              x2={MOBILE_WIDTH / 2}
              y2={y + MOBILE_NODE_HEIGHT + MOBILE_NODE_GAP}
              className="stroke-border"
              strokeWidth={1}
              markerEnd="url(#alive-arrow-mobile)"
            />
          );
        })}
        {NODES.map((node, index) => (
          <NodeButton
            key={node.id}
            node={node}
            x={MOBILE_NODE_X}
            y={MOBILE_NODE_Y + index * (MOBILE_NODE_HEIGHT + MOBILE_NODE_GAP)}
            w={MOBILE_NODE_WIDTH}
            h={MOBILE_NODE_HEIGHT}
            group="m"
            linked={linkedItem(node)}
            isSelected={selectedFor(node)}
            pulse={node.id === "strange" && !reduceMotion}
            reduceMotion={reduceMotion}
            ariaLabel={labelFor(node)}
            onActivate={() => activate(node)}
            onPreview={() => setPreview(statusFor(node))}
            onPreviewEnd={() => setPreview(null)}
          />
        ))}
      </svg>
      <div id={STATUS_ID} className="mt-4 min-h-20 border-t border-border pt-3">
        {status ? (
          <>
            <p className="font-mono text-xs uppercase tracking-kicker text-subtle">
              {status.title}
            </p>
            <p className="mt-1 text-sm text-muted">{status.thesis}</p>
          </>
        ) : (
          <p className="text-sm text-muted">No projects available.</p>
        )}
      </div>
      <div className="mt-4 border-t border-border pt-3">
        <p className="font-mono text-xs uppercase tracking-kicker text-subtle">
          All Tier S projects
        </p>
        {items.length > 0 ? (
          <div className="mt-2 flex flex-wrap gap-2">
            {items.map((item) => (
              <button
                key={item.slug}
                type="button"
                aria-describedby={STATUS_ID}
                aria-pressed={selected === item.slug}
                onClick={() => selectItem(item)}
                onFocus={() => setPreview(item)}
                onBlur={() => setPreview(null)}
                onMouseEnter={() => setPreview(item)}
                onMouseLeave={() => setPreview(null)}
                className={[
                  "min-h-11 max-w-full border px-3 py-2 text-left font-mono text-xs text-muted transition-colors duration-150 hover:border-fg hover:text-fg focus-visible:border-fg focus-visible:text-fg",
                  selected === item.slug
                    ? "border-signal bg-elevated text-fg"
                    : "border-border bg-elevated",
                ].join(" ")}
              >
                {item.title}
              </button>
            ))}
          </div>
        ) : (
          <p className="mt-2 text-sm text-muted">No projects available.</p>
        )}
      </div>
    </div>
  );
}

function ArrowMarker({ id }: { id: string }) {
  return (
    <defs>
      <marker
        id={id}
        viewBox="0 0 8 8"
        refX={7}
        refY={4}
        markerWidth={7}
        markerHeight={7}
        orient="auto-start-reverse"
      >
        <path d="M0 0 L8 4 L0 8" fill="none" stroke="#2a2a27" strokeWidth={1.5} />
      </marker>
    </defs>
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
  onPreview: () => void;
  onPreviewEnd: () => void;
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
  onPreview,
  onPreviewEnd,
}: NodeButtonProps) {
  return (
    <motion.g
      layout
      transition={reduceMotion ? { duration: 0 } : { duration: 0.18, ease: "easeOut" }}
    >
      <foreignObject x={x} y={y} width={w} height={h}>
        <button
          id={`alive-node-${group}-${node.id}`}
          type="button"
          disabled={!linked && node.id !== CHIP_ID}
          onClick={onActivate}
          onFocus={onPreview}
          onBlur={onPreviewEnd}
          onMouseEnter={onPreview}
          onMouseLeave={onPreviewEnd}
          aria-describedby={STATUS_ID}
          aria-pressed={linked || node.id === CHIP_ID ? isSelected : undefined}
          aria-label={ariaLabel}
          className="group block h-full w-full bg-transparent p-0 disabled:cursor-not-allowed disabled:opacity-50"
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
