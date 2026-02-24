"use client";

import { useId, useState, type ReactNode } from "react";

interface CollapsiblePanelProps {
  title: string;
  description?: string;
  defaultOpen?: boolean;
  className?: string;
  children: ReactNode;
}

export function CollapsiblePanel({
  title,
  description,
  defaultOpen = true,
  className,
  children,
}: CollapsiblePanelProps) {
  const [isOpen, setIsOpen] = useState(defaultOpen);
  const contentId = useId();

  return (
    <section className={`panel collapsible-panel ${className ?? ""}`.trim()}>
      <div className="collapsible-header">
        <h2>{title}</h2>
        <button
          type="button"
          className="collapse-toggle"
          aria-expanded={isOpen}
          aria-controls={contentId}
          onClick={() => setIsOpen((prev) => !prev)}
        >
          {isOpen ? "접기" : "펼치기"}
          <span className={`collapse-icon ${isOpen ? "open" : ""}`} aria-hidden>
            v
          </span>
        </button>
      </div>
      {description ? <p className="muted">{description}</p> : null}
      {isOpen ? (
        <div id={contentId} className="collapsible-content">
          {children}
        </div>
      ) : (
        <div id={contentId} hidden />
      )}
    </section>
  );
}
