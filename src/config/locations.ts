/**
 * The communities TARMAX works in routinely.
 *
 * Every entry here is somewhere the crew actually goes on ordinary jobs. That
 * constraint is the whole design: a page per town is only worth having when
 * the coverage is real and the page says something true about that town. A
 * batch of near-identical pages spun out to catch searches is a doorway page,
 * which Google penalises — and the penalty lands on the whole site, not just
 * the thin pages.
 *
 * So each entry carries its own conditions and its own property mix, written
 * from what is actually different about working there. If a new town cannot be
 * given a genuine paragraph, it does not belong in this list; it belongs in
 * the province-wide note on the index page instead.
 */

export type Location = {
  slug: string;
  name: string;
  /** Bearing and rough drive from Calgary. Used in copy, not as a promise. */
  proximity: string;
  /** One line under the page title. */
  lede: string;
  /** What is genuinely different about pavement here. */
  conditions: string;
  /** The property mix the crew actually meets. */
  properties: string;
  /** Three specifics worth reading before booking. */
  notes: [string, string, string];
};

export const LOCATIONS: readonly Location[] = [
  {
    slug: "airdrie",
    name: "Airdrie",
    proximity: "About 30 minutes north of Calgary on the QEII",
    lede: "A young city with a lot of asphalt reaching the age where sealing decides what happens next.",
    conditions:
      "Airdrie grew fast, and it grew in phases. Whole subdivisions went in within a year or two of each other, which means their driveways are all reaching the same point at the same time — the stage where the surface has greyed, the binder has dried out and the first hairline cracks have opened, but nothing has broken up yet. That is the window where sealing is worth doing. Left another few winters, the same driveway needs repair before it can be sealed at all.",
    properties:
      "Mostly residential: double driveways on subdivision lots, many of them built in the 2000s and 2010s. On the commercial side, the retail plazas and light-industrial yards along the highway corridor, where the parking surface takes daily traffic and a pothole becomes a liability question rather than an appearance one.",
    notes: [
      "If your street was built out at the same time as your neighbours', their driveways are on the same clock as yours — worth looking at together.",
      "Highway-corridor lots collect more gravel and road salt than a residential street, which accelerates surface wear.",
      "We quote residential and commercial in Airdrie on the same terms as Calgary. The drive does not change the price.",
    ],
  },
  {
    slug: "cochrane",
    name: "Cochrane",
    proximity: "About 35 minutes west of Calgary, toward the foothills",
    lede: "Higher, more exposed, and hit harder by the thaw side of freeze-thaw.",
    conditions:
      "Cochrane sits closer to the foothills and higher than Calgary, and it gets chinooks hard. That matters more than the average winter temperature does. A surface that stays frozen all season takes less damage than one that thaws and refreezes repeatedly, because it is the cycle that does the work — water enters, freezes, expands, and levers the crack wider from the inside. More cycles means more of that, on the same crack, in the same winter.",
    properties:
      "A mix of established properties and newer hillside developments. Sloped driveways are common here, and slope decides where meltwater goes — a crack at the bottom of a grade takes the runoff from everything above it, which is why the damage often shows there first.",
    notes: [
      "On a sloped driveway, tell us where water pools in spring. That spot usually explains the cracking.",
      "Chinook country means more freeze-thaw cycles per winter than the temperature range alone suggests.",
      "Sealing is scheduled around cure conditions. We will not apply onto a surface that will not cure properly.",
    ],
  },
  {
    slug: "okotoks",
    name: "Okotoks",
    proximity: "About 30 minutes south of Calgary on Highway 2A",
    lede: "Older established asphalt, newer developments, and acreages where replacement is genuinely expensive.",
    conditions:
      "Okotoks has a wider spread of pavement ages than most towns its size — established neighbourhoods where the asphalt has been down long enough to have greyed right through, alongside developments where the surface is still new enough to be worth protecting properly. The two need different conversations, and it is worth knowing which one you have before anyone quotes you.",
    properties:
      "Town lots plus a significant number of acreage properties in the surrounding area, where driveways run long. On a long driveway the arithmetic changes sharply: replacement is priced by area, so the cost of letting a surface go is far higher than it is on a standard double driveway.",
    notes: [
      "On an acreage driveway, ask us about doing it in sections rather than all at once if the budget calls for it.",
      "Older asphalt may need crack sealing before it is worth sealcoating. We will tell you which order it needs.",
      "If the surface has already broken up, sealing is not the answer for that area and we will say so.",
    ],
  },
  {
    slug: "chestermere",
    name: "Chestermere",
    proximity: "About 20 minutes east of Calgary on Highway 1",
    lede: "Newer housing stock, wide driveways, and a lot of surface worth protecting before it ages.",
    conditions:
      "Much of Chestermere's residential asphalt is relatively young. That is the best possible position to be in and the easiest one to waste — a surface that is still sound is cheap to keep sound, and the cost of maintenance only ever goes up from there. The point of sealing a newer driveway is not appearance; it is keeping water out of a surface that has not yet let any in.",
    properties:
      "Predominantly residential, with wide double and triple driveways on newer lots. Sealing a larger driveway costs more than a small one, but the same is far more true of replacing it.",
    notes: [
      "A newer driveway is not too new to seal. Protecting sound asphalt is the entire point of the product.",
      "Wide driveways take more material. We measure from the map or on site before quoting, never by guess.",
      "The short drive from Calgary means we can usually fit Chestermere work into a normal schedule.",
    ],
  },
  {
    slug: "strathmore",
    name: "Strathmore",
    proximity: "About 45 minutes east of Calgary on Highway 1",
    lede: "Working surfaces — yards, lots and driveways that carry weight rather than just cars.",
    conditions:
      "Pavement east of the city tends to see heavier use. Farm vehicles, trucks and trailers load a surface differently from a family car: the damage is concentrated, it happens at turning points and entrances, and it works on the base underneath rather than only the surface layer. That distinction decides the repair — a failure in the surface can be reheated and reworked, while a failure in the base has to be dealt with underneath.",
    properties:
      "Residential driveways in town, plus commercial and agricultural yards, approaches and light-industrial parking. Gravel tracked onto a sealed surface from an unpaved area is a common wear pattern here and worth mentioning when you call.",
    notes: [
      "Where heavy vehicles turn, damage concentrates. Those areas often need repair before sealing.",
      "If part of your yard is gravel and part is paved, tell us — the transition is usually where the wear starts.",
      "Commercial and agricultural work is quoted on the same basis as residential: we look first, then price it.",
    ],
  },
];

export const locationBySlug = (slug: string) => LOCATIONS.find((l) => l.slug === slug);
