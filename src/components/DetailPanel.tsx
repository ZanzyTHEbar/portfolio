import { Link } from "@tanstack/react-router";
import { AnimatePresence, motion, useReducedMotion } from "motion/react";

export interface DetailPanelItem {
  slug: string;
  title: string;
  thesis: string;
}

export function DetailPanel({ item }: { item: DetailPanelItem | null }) {
  const reduceMotion = useReducedMotion();

  if (reduceMotion) {
    if (!item) return null;
    return (
      <aside aria-live="polite" className="hairline bg-elevated p-5">
        <PanelBody item={item} />
      </aside>
    );
  }

  return (
    <AnimatePresence mode="wait" initial={false}>
      {item ? (
        <motion.aside
          key={item.slug}
          aria-live="polite"
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 8 }}
          transition={{ duration: 0.18, ease: "easeOut" }}
          className="hairline bg-elevated p-5"
        >
          <PanelBody item={item} />
        </motion.aside>
      ) : null}
    </AnimatePresence>
  );
}

function PanelBody({ item }: { item: DetailPanelItem }) {
  return (
    <>
      <p className="font-mono text-xs uppercase tracking-kicker text-subtle">
        Pinned dossier // {item.slug}
      </p>
      <h3 className="mt-2 font-sans text-xl font-medium tracking-tight">
        {item.title}
      </h3>
      <p className="mt-2 text-sm text-muted">{item.thesis}</p>
      <Link
        to="/builds/$slug"
        params={{ slug: item.slug }}
        className="mt-4 inline-flex items-center gap-1 font-mono text-xs uppercase tracking-kicker text-fg underline underline-offset-4 hover:no-underline"
      >
        View case study →
      </Link>
    </>
  );
}
