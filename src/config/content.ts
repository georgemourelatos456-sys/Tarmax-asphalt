import type { SurfaceName } from "@/components/ui/Surface";

/**
 * Service and condition copy, shared by the homepage, /services and
 * /commercial so the same claim is never written twice.
 *
 * Describe what the work does, not what it might do. Hedging every noun —
 * "suitable" cracks, sealing that "helps reduce" water entry — reads as evasion
 * and tells a customer nothing, since they cannot know whether their crack is
 * a "suitable" one. The hard limits are still stated outright where they
 * matter: sealcoating will not rebuild damaged asphalt, and nothing here
 * promises a lifespan or claims maintenance stops freeze-thaw.
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
    body: "Sun, weather and traffic dry the surface out. The binder that held it black and tight gives way, and the pavement fades to grey.",
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
    body: "Cracks are how water gets in. Once it reaches the base underneath, freezing and traffic do the rest.",
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
    body: "Traffic and water keep working on a pothole once it opens. Left alone, a small one becomes a big one.",
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
      "Sealcoating that protects the surface and brings the colour back.",
    // Product is Blackmac Emulsion Sealer (McAsphalt Industries) — asphalt
    // carried in water, not in a petroleum solvent. Two rules before editing
    // this copy. Keep environmental claims comparative and factual (no coal
    // tar, no solvent carrier) rather than absolute — "eco-friendly" and
    // "green" are exactly the unsubstantiated claims the Competition Act's
    // greenwashing provisions target. And do not describe it as penetrating or
    // as reconditioning binder: that is how a solvent cutback behaves, and it
    // is a different product.
    detail:
      "We apply Blackmac Emulsion Sealer, made in Canada by McAsphalt Industries and sourced locally. It is asphalt carried in water rather than a petroleum solvent, so there is no coal tar and no solvent odour — the water evaporates and the asphalt stays on the surface. It protects aging pavement, slows further wear, and brings back a deep black finish. Sealcoating is maintenance, not repair: it will not rebuild damaged asphalt.",
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
    name: "Hot Rubber Crack Sealing",
    summary:
      "Hot-applied rubberized sealing that keeps water out of open cracks.",
    detail:
      "Rubberized sealant is melted and poured in hot, so it reaches the bottom of the crack and bonds to both walls instead of sitting on top. It stays flexible as the pavement moves through Alberta's temperature swings. The sooner a crack is sealed, the less there is to repair around it.",
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
    name: "Infrared Asphalt Repair",
    summary:
      "Heats the asphalt already in place so a damaged area can be reworked and repaired on the spot.",
    detail:
      "Infrared heats the existing asphalt in place until it can be raked and reworked, then new material is added and compacted into the repair. It suits potholes, depressions and deterioration. Because the surrounding asphalt is heated along with the repair, the area cools as one continuous piece — there is no cold joint around the edge for water to get into.",
    bestFor: ["Potholes", "Depressions", "Localized deterioration"],
    surface: "pothole",
    imageAlt: "A localized pavement failure suited to infrared repair",
  },
  {
    id: "commercial",
    name: "Commercial Parking Lot Maintenance",
    summary:
      "Sealcoating, crack sealing and repair across a managed lot, assessed before anything is quoted.",
    detail:
      "For property managers, condo boards, retail and office properties, churches and other managed parking areas. A parking lot is the part of a property most likely to generate a complaint or a claim: potholes and broken edges are trip hazards, worn markings blur accessible stalls and traffic routes, and water that sits where drainage has failed turns to ice the moment the temperature drops. In Alberta an occupier owes a duty of care to everyone who uses the property, and a maintenance record is how that gets demonstrated. We assess the surface, quote the work it needs, and carry out sealcoating, crack sealing, pothole repair and infrared repair across the lot.",
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
    name: "Residential Driveway Maintenance",
    summary: "Sealcoating, crack sealing and infrared repair for Calgary driveways.",
    detail:
      "The same equipment and the same materials that go onto a commercial lot, scaled to a driveway. Sealcoating, crack sealing and infrared repair on the surface you cross every morning — and the first thing anyone sees when they pull up to the house.",
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
    title: "Water gets in",
    body: "Rain and melt run into open cracks and pores.",
  },
  {
    step: "02",
    title: "It freezes",
    body: "Overnight the temperature drops and the water turns to ice.",
  },
  {
    step: "03",
    title: "Ice expands",
    body: "Freezing water swells and levers the crack wider from the inside.",
  },
  {
    step: "04",
    title: "The damage spreads",
    body: "Each cycle takes another bite. Cracks widen, the surface breaks up, potholes open.",
  },
] as const;
