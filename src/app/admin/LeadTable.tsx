"use client";

import { useState, useTransition } from "react";
import { mailtoHref, mapsSearchUrl } from "@/config/business";
import { LEAD_STATUSES, STATUS_LABELS, type Lead, type LeadStatus } from "@/types/lead";
import { setLeadStatus } from "@/app/admin/actions";

const DATE_FORMAT = new Intl.DateTimeFormat("en-CA", {
  year: "numeric",
  month: "short",
  day: "numeric",
  hour: "2-digit",
  minute: "2-digit",
});

export function LeadTable({ leads }: { leads: Lead[] }) {
  const [filter, setFilter] = useState<LeadStatus | "all">("all");
  const [error, setError] = useState<string | null>(null);

  const counts = LEAD_STATUSES.reduce(
    (acc, s) => ({ ...acc, [s]: leads.filter((l) => l.status === s).length }),
    {} as Record<LeadStatus, number>,
  );

  const visible = filter === "all" ? leads : leads.filter((l) => l.status === filter);

  return (
    <div>
      <div className="flex flex-wrap items-center gap-2" role="group" aria-label="Filter by status">
        <FilterChip active={filter === "all"} onClick={() => setFilter("all")}>
          All <Count n={leads.length} />
        </FilterChip>
        {LEAD_STATUSES.map((s) => (
          <FilterChip key={s} active={filter === s} onClick={() => setFilter(s)}>
            {STATUS_LABELS[s]} <Count n={counts[s]} />
          </FilterChip>
        ))}
      </div>

      {error && (
        <p role="alert" className="mt-4 text-sm text-alert">
          {error}
        </p>
      )}

      {visible.length === 0 ? (
        <p className="mt-10 border border-white/12 p-8 text-muted">
          {leads.length === 0
            ? "No quote requests yet. They'll appear here as soon as the form is used."
            : `No leads with status "${filter === "all" ? "" : STATUS_LABELS[filter]}".`}
        </p>
      ) : (
        <ul className="mt-8 flex flex-col gap-px bg-white/10">
          {visible.map((lead) => (
            <LeadRow key={lead.id} lead={lead} onError={setError} />
          ))}
        </ul>
      )}
    </div>
  );
}

function Count({ n }: { n: number }) {
  return <span className="ml-1.5 opacity-55">{n}</span>;
}

function FilterChip({
  active,
  onClick,
  children,
}: {
  active: boolean;
  onClick: () => void;
  children: React.ReactNode;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-pressed={active}
      className={`label min-h-11 border px-4 text-[0.625rem] transition-colors ${
        active ? "border-red bg-red text-white" : "border-white/18 text-muted hover:text-bone"
      }`}
    >
      {children}
    </button>
  );
}

function LeadRow({ lead, onError }: { lead: Lead; onError: (m: string | null) => void }) {
  const [pending, startTransition] = useTransition();

  function move(status: LeadStatus) {
    onError(null);
    startTransition(async () => {
      const result = await setLeadStatus(lead.id, status);
      if (!result.ok) onError(result.error);
    });
  }

  return (
    <li className={`bg-ink p-5 md:p-6 ${pending ? "opacity-60" : ""}`}>
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div className="min-w-0">
          <p className="display-sm">{lead.full_name}</p>
          <p className="mt-1 text-sm text-bone/80">{lead.property_address}</p>
          <p className="mt-2 flex flex-wrap items-center gap-x-4 gap-y-1 text-sm text-muted">
            {lead.phone && <span>{lead.phone}</span>}
            {lead.email && <span className="break-all">{lead.email}</span>}
            {lead.service && <span>{lead.service}</span>}
            {lead.property_type && <span>{lead.property_type}</span>}
          </p>
          {lead.message && <p className="mt-3 max-w-[60ch] text-sm text-bone/70">{lead.message}</p>}
        </div>

        <div className="flex shrink-0 flex-col items-end gap-2">
          <StatusBadge status={lead.status} />
          <time dateTime={lead.created_at} className="text-xs text-muted">
            {DATE_FORMAT.format(new Date(lead.created_at))}
          </time>
        </div>
      </div>

      <div className="mt-5 flex flex-wrap gap-2 border-t border-white/10 pt-4">
        {lead.phone && (
          <a href={`tel:${lead.phone.replace(/[^\d+]/g, "")}`} className="admin-action">
            Call
          </a>
        )}
        {lead.email && (
          <a href={mailtoHref(lead.email, `TARMAX quote — ${lead.property_address}`)} className="admin-action">
            Email
          </a>
        )}
        <a
          href={mapsSearchUrl(lead.property_address)}
          target="_blank"
          rel="noreferrer"
          className="admin-action"
        >
          Open in Google Maps
        </a>

        <span className="ml-auto flex flex-wrap gap-2">
          {LEAD_STATUSES.filter((s) => s !== lead.status && s !== "new").map((s) => (
            <button
              key={s}
              type="button"
              onClick={() => move(s)}
              disabled={pending}
              className="admin-action"
            >
              Mark {STATUS_LABELS[s].toLowerCase()}
            </button>
          ))}
        </span>
      </div>
    </li>
  );
}

/** Status is shown as a word, never colour alone. */
function StatusBadge({ status }: { status: LeadStatus }) {
  const tone: Record<LeadStatus, string> = {
    new: "border-alert text-alert",
    contacted: "border-white/35 text-bone",
    quoted: "border-white/35 text-bone",
    won: "border-[#5FA463] text-[#8FD093]",
    lost: "border-white/20 text-muted",
  };
  return (
    <span className={`label border px-2.5 py-1 text-[0.5625rem] ${tone[status]}`}>
      {STATUS_LABELS[status]}
    </span>
  );
}
