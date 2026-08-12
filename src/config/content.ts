import type { SurfaceName } from "@/components/ui/Surface";

/**
 * Service and condition copy, shared by the homepage, /services and
 * /commercial so the same claim is never written twice.
 *
 * Language is deliberately bounded: sealcoating "helps protect", crack sealing
 * "helps reduce" water entry, infrared suits "selected" areas. Nothing here
 * promises a lifespan, permanence, or that maintenance stops freeze-thaw.
 */

export type Problem = {
  id: string;
  /** Assessment field name, as it would appear on a condition report. */
  field: string;
  /** Observed value for that field. */
  reading: string;
  title: string;
  body: string;
  signs: string[];
  solution: string;
  solutionHref: string;
  cta: string;
  surface: SurfaceName;
  imageAlt: string;
};

export const PROBLEMS: Problem[] = [
  {
    id: "aged",
    field: "Surface condition",
    reading: "Oxidized",
    title: "Dried + aged asphalt",
    body: "Sunlight, weather, traffic and oxidation dry the surface over time. The binder that held it dark and tight gives way, and the pavement fades toward grey.",
    signs: ["Faded grey appearance", "Dry, porous surface", "Visible oxidation", "General surface wear"],
    solution: "Sealcoating",
    solutionHref: "/driveway-sealcoating",
    cta: "Learn about sealcoating",
    surface: "oxidized",
    imageAlt: "Sun-faded asphalt with an oxidized, grey, porous surface",
  },
  {
    id: "cracks",
    field: "Defect type",
    reading: "Linear cracking",
    title: "Large cracks",
    body: "Cracks are how water gets in. Once moisture reaches the layers underneath, seasonal temperature swings and continued traffic can drive further deterioration.",
    signs: ["Open cracks", "Widening crack edges", "Water pooling along the crack", "Vegetation growth"],
    solution: "Hot rubber crack sealing",
    solutionHref: "/crack-sealing",
    cta: "Learn about crack sealing",
    surface: "crack",
    imageAlt: "A wide open crack running across dark asphalt pavement",
  },
  {
    id: "potholes",
    field: "Defect type",
    reading: "Localized failure",
    title: "Potholes + depressions",
    body: "Potholes and depressions generally keep deteriorating under traffic, moisture and weather. A small damaged area left alone tends to become a larger one.",
    signs: ["Open potholes", "Surface depressions", "Broken, spalling edges", "Standing water"],
    solution: "Infrared asphalt repair",
    solutionHref: "/infrared-repair",
    cta: "Learn about infrared repair",
    surface: "pothole",
    imageAlt: "A pothole with a broken rim in an otherwise dark asphalt surface",
  },
];

export type Service = {
  id: string;
  name: string;
  summary: string;
  detail: string;
  bestFor: string[];
  surface: SurfaceName;
  imageAlt: string;
};

export const SERVICES: Service[] = [
  {
    id: "sealcoating",
    name: "Sealcoating",
    summary:
      "Professional sealcoating to help protect and refresh suitable asphalt surfaces.",
    // Product is Blackmac Emulsion Sealer (McAsphalt Industries) — asphalt
    // carried in water, not in a petroleum solvent. Two rules before editing
    // this copy. Keep environmental claims comparative and factual (no coal
    // tar, no solvent carrier) rather than absolute — "eco-friendly" and
    // "green" are exactly the unsubstantiated claims the Competition Act's
    // greenwashing provisions target. And do not describe it as penetrating or
    // as reconditioning binder: that is how a solvent cutback behaves, and it
    // is a different product.
    detail:
      "We apply Blackmac Emulsion Sealer, made in Canada by McAsphalt Industries and sourced locally. It is asphalt carried in water rather than in a petroleum solvent, so there is no coal tar and no solvent odour — the water evaporates and asphalt is what stays on the surface. It helps protect aging asphalt, helps reduce surface deterioration and restores a darker, maintained appearance. Sealcoating is preventative maintenance — it does not structurally restore damaged asphalt.",
    bestFor: [
      "Faded or oxidized asphalt",
      "Aging surfaces still in sound condition",
      "Residential driveways",
      "Commercial parking lots",
    ],
    surface: "oxidized",
    imageAlt: "Oxidized asphalt of the kind suited to sealcoating",
  },
  {
    id: "crack-sealing",
    name: "Hot rubber crack sealing",
    summary:
      "Industrial hot-applied rubberized crack sealing to help reduce water penetration into suitable pavement cracks.",
    detail:
      "We use industrial hot-applied rubberized crack-sealing equipment to fill suitable cracks. The material stays flexible as the pavement moves through Alberta's temperature swings, and helps restrict water from entering. It is most useful before further deterioration develops around the crack.",
    bestFor: [
      "Open and widening cracks",
      "Water entry points",
      "Pavement still sound either side of the crack",
      "Preventative maintenance programs",
    ],
    surface: "crack",
    imageAlt: "An open pavement crack suited to hot rubber crack sealing",
  },
  {
    id: "infrared",
    name: "Infrared asphalt repair",
    summary:
      "Infrared equipment heats suitable existing asphalt so localized damaged areas can be reworked and repaired.",
    detail:
      "Infrared heats the existing asphalt in place until it can be raked and reworked, then new material is added and compacted into the repair. It suits potholes, depressions and selected localized failures. It is not appropriate for every pavement failure — we assess the area first and say so when it is not the right method.",
    bestFor: ["Potholes", "Depressions", "Localized deterioration", "Selected pavement failures"],
    surface: "pothole",
    imageAlt: "A localized pavement failure suited to infrared repair",
  },
  {
    id: "commercial",
    name: "Commercial parking lot maintenance",
    summary:
      "Sealcoating, crack sealing and repair coordinated across a managed parking area, with a condition assessment first.",
    detail:
      "For property managers, condo boards, retail and office properties, churches and other managed parking areas. We assess pavement condition, identify what needs attention now versus what can wait, and carry out sealcoating, crack sealing, pothole repair and infrared repair as required.",
    bestFor: [
      "Property managers and condo boards",
      "Retail and office properties",
      "Churches and community buildings",
      "Any managed parking area",
    ],
    surface: "lot",
    imageAlt: "Line-striping equipment on a freshly sealed and marked commercial parking lot",
  },
  {
    id: "residential",
    name: "Residential driveway maintenance",
    summary: "Sealcoating, crack sealing and infrared repair for Calgary driveways.",
    detail:
      "The same equipment and the same assessment-first approach used on commercial work, scaled to a driveway. We look at the surface, tell you what it needs, and quote only that.",
    bestFor: ["Driveways", "Parking pads", "Shared residential lanes", "Preventative maintenance"],
    surface: "driveway",
    imageAlt: "A freshly sealed residential asphalt driveway",
  },
];

/**
 * The freeze-thaw sequence. Order is load-bearing here — each stage is caused
 * by the one before it — which is why these are the only numbered items on the
 * site.
 */
export const FREEZE_THAW = [
  {
    step: "01",
    title: "Water enters",
    body: "Moisture enters cracks and vulnerable pavement areas.",
  },
  {
    step: "02",
    title: "Temperature drops",
    body: "Water freezes during cold Alberta weather.",
  },
  {
    step: "03",
    title: "Movement occurs",
    body: "Repeated freezing and thawing can place additional stress around existing pavement defects.",
  },
  {
    step: "04",
    title: "Damage can grow",
    body: "Repeated cycles can contribute to larger cracks, surface deterioration and potholes.",
  },
] as const;
