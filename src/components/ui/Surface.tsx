import { existsSync } from "node:fs";
import { join } from "node:path";
import Image from "next/image";

/**
 * The site's imagery layer.
 *
 * Every image on the site resolves through here, so swapping art direction is
 * a change to this file and nothing else.
 *
 * Each surface names a real photograph in /public/photos. If that file is
 * present it is used; if it is not, the generated asphalt texture in
 * /public/textures stands in. That means the site always builds — a missing
 * photo degrades to the placeholder instead of breaking the page — and photos
 * can be added one at a time.
 *
 * Images render with `fill`, so a replacement photo of any dimensions crops
 * correctly without anyone editing code. Every call site provides a positioned,
 * sized parent.
 */

export type SurfaceName =
  | "hero"
  | "oxidized"
  | "crack"
  | "pothole"
  | "lot"
  | "driveway";

/** photo: preferred real photograph. texture: generated stand-in. */
const SOURCES: Record<SurfaceName, { photo: string; texture: string }> = {
  hero: { photo: "/photos/hero.jpg", texture: "/textures/asphalt-hero.jpg" },
  oxidized: { photo: "/photos/dried-asphalt.jpg", texture: "/textures/asphalt-oxidized.jpg" },
  crack: { photo: "/photos/crack-sealing.jpg", texture: "/textures/asphalt-crack.jpg" },
  pothole: { photo: "/photos/pothole.jpg", texture: "/textures/asphalt-pothole.jpg" },
  lot: { photo: "/photos/line-striping.jpg", texture: "/textures/asphalt-lot.jpg" },
  driveway: { photo: "/photos/sealcoating.jpg", texture: "/textures/asphalt-driveway.jpg" },
};

/**
 * Resolved once at module load rather than per render. This runs on the server
 * during build, so it costs nothing at request time.
 */
const RESOLVED: Record<SurfaceName, string> = Object.fromEntries(
  (Object.keys(SOURCES) as SurfaceName[]).map((name) => {
    const { photo, texture } = SOURCES[name];
    const onDisk = join(process.cwd(), "public", photo);
    return [name, existsSync(onDisk) ? photo : texture];
  }),
) as Record<SurfaceName, string>;

export function Surface({
  name,
  alt,
  className = "",
  sizes = "100vw",
  priority = false,
}: {
  name: SurfaceName;
  /**
   * Describe the pavement condition when the image carries meaning. Pass an
   * empty string when it is purely a backdrop behind text.
   */
  alt: string;
  className?: string;
  sizes?: string;
  priority?: boolean;
}) {
  return (
    <Image
      src={RESOLVED[name]}
      alt={alt}
      fill
      sizes={sizes}
      priority={priority}
      className={`object-cover ${className}`}
    />
  );
}
