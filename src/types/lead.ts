export const LEAD_STATUSES = ["new", "contacted", "quoted", "won", "lost"] as const;

export type LeadStatus = (typeof LEAD_STATUSES)[number];

/** A row of the `leads` table. Column names are snake_case to match Postgres. */
export type Lead = {
  id: string;
  created_at: string;
  full_name: string;
  phone: string | null;
  email: string | null;
  property_address: string;
  property_type: string | null;
  service: string | null;
  message: string | null;
  status: LeadStatus;
  /**
   * When TARMAX plans to attend the property, as an ISO timestamp. Internal
   * only — customers never see or choose this, and nothing is committed to
   * them until a director has made contact.
   */
  scheduled_at: string | null;
};

/** Human labels for the pipeline columns. */
export const STATUS_LABELS: Record<LeadStatus, string> = {
  new: "New",
  contacted: "Contacted",
  quoted: "Quoted",
  won: "Won",
  lost: "Lost",
};
