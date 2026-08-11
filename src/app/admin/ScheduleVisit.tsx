"use client";

import { useState, useTransition } from "react";
import { setLeadSchedule } from "@/app/admin/actions";
import { buildIcs, googleCalendarUrl, icsFilename, VISIT_MINUTES } from "@/lib/calendar";
import type { Lead } from "@/types/lead";

const WHEN = new Intl.DateTimeFormat("en-CA", {
  weekday: "short",
  month: "short",
  day: "numeric",
  hour: "numeric",
  minute: "2-digit",
});

/**
 * Converts a stored UTC timestamp into the value a datetime-local input wants,
 * in the browser's own timezone. Directors work in Calgary, so what they type
 * is what they mean.
 */
function toLocalInput(iso: string | null) {
  if (!iso) return "";
  const d = new Date(iso);
  const pad = (n: number) => String(n).padStart(2, "0");
  return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}T${pad(d.getHours())}:${pad(d.getMinutes())}`;
}

/** Books a site visit against a lead and hands it to the director's calendar. */
export function ScheduleVisit({
  lead,
  onError,
}: {
  lead: Lead;
  onError: (message: string | null) => void;
}) {
  const [open, setOpen] = useState(false);
  const [value, setValue] = useState(() => toLocalInput(lead.scheduled_at));
  const [pending, startTransition] = useTransition();

  const scheduled = lead.scheduled_at ? new Date(lead.scheduled_at) : null;

  function save(next: string | null) {
    onError(null);
    startTransition(async () => {
      const result = await setLeadSchedule(lead.id, next);
      if (!result.ok) onError(result.error);
      else setOpen(false);
    });
  }

  function downloadIcs() {
    if (!scheduled) return;
    const blob = new Blob([buildIcs(lead, scheduled)], { type: "text/calendar;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = icsFilename(lead);
    a.click();
    URL.revokeObjectURL(url);
  }

  return (
    <>
      {scheduled && (
        <p className="mt-3 flex flex-wrap items-center gap-x-3 gap-y-1 border-l-2 border-white/30 pl-3 text-sm">
          <span className="label text-[0.5625rem] text-muted">Site visit</span>
          <time dateTime={lead.scheduled_at ?? undefined} className="font-semibold text-bone">
            {WHEN.format(scheduled)}
          </time>
          <span className="text-xs text-muted">{VISIT_MINUTES} min</span>
        </p>
      )}

      <div className="mt-3 flex flex-wrap gap-2">
        <button type="button" onClick={() => setOpen((v) => !v)} className="admin-action">
          {scheduled ? "Reschedule" : "Schedule visit"}
        </button>

        {scheduled && (
          <>
            <a
              href={googleCalendarUrl(lead, scheduled)}
              target="_blank"
              rel="noreferrer"
              className="admin-action"
            >
              Add to Google Calendar
            </a>
            <button type="button" onClick={downloadIcs} className="admin-action">
              Download .ics
            </button>
          </>
        )}
      </div>

      {open && (
        <div className="mt-3 flex flex-wrap items-end gap-3 border border-white/14 p-4">
          <div className="flex flex-col gap-2">
            <label
              htmlFor={`visit-${lead.id}`}
              className="label text-[0.5625rem] text-muted"
            >
              Visit date and time
            </label>
            <input
              id={`visit-${lead.id}`}
              type="datetime-local"
              className="field-input"
              value={value}
              onChange={(e) => setValue(e.target.value)}
            />
          </div>

          <button
            type="button"
            className="admin-action"
            disabled={pending || !value}
            onClick={() => save(value ? new Date(value).toISOString() : null)}
          >
            {pending ? "Saving…" : "Save visit"}
          </button>

          {scheduled && (
            <button
              type="button"
              className="admin-action"
              disabled={pending}
              onClick={() => {
                setValue("");
                save(null);
              }}
            >
              Clear
            </button>
          )}
        </div>
      )}
    </>
  );
}
