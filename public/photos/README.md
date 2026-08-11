# Photographs

Drop real photos in this folder using the exact filenames below. Each one
replaces the generated asphalt texture that currently stands in for it.

Nothing else needs changing. `src/components/ui/Surface.tsx` checks for these
files at build time: present, the photo is used; absent, the generated texture
is used. So you can add them one at a time and the site keeps building either
way.

| Filename | Where it appears |
|---|---|
| `dried-asphalt.jpg` | "Dried + aged asphalt" band on the homepage, and the sealcoating entry on /services |
| `crack-sealing.jpg` | "Large cracks" band, and the hot rubber crack sealing entry |
| `pothole.jpg` | "Potholes + depressions" band, and the infrared repair entry |
| `line-striping.jpg` | Commercial parking lot panel and the /commercial header |
| `sealcoating.jpg` | Residential driveway panel, /about header, /driveway-sealcoating header and its curb-appeal image |
| `hero.jpg` | Homepage hero, the closing quote section and the final CTA. Optional — the generated dark asphalt is a deliberate choice here and works well behind the headline. |

## What makes a good file

- **Landscape**, at least 1600px wide. They are cropped with `object-cover`, so
  exact dimensions do not matter, but anything smaller will look soft on a
  laptop.
- **JPEG**, quality ~80, ideally under 400KB each. Next.js re-encodes and
  resizes them per device, so start with a good original.
- **Keep the subject away from the edges.** These crop differently on a phone
  than on a desktop; a crack running through the middle survives that, a crack
  in the corner may not.
- Several of these sit under text with a dark gradient over them. Busy,
  high-contrast photos fight the headline; simpler ones read better.

## Before you use a photo

Make sure you own it or are licensed to use it. Photographs taken from other
contractors' websites or from image search are usually someone else's
copyright, and a marketing site is a public, commercial use. Your own job
photos are both safer and more convincing — a real Calgary driveway you sealed
beats stock every time.

## After adding files

Commit them and push. Vercel rebuilds automatically and the photos appear.
