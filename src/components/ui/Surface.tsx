import Image from "next/image";
import { SURFACE_SRC, type SurfaceName } from "./surfaces.generated";

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
 * That decision is made at build time by scripts/resolve-surfaces.mjs rather
 * than here, because this component also runs on Cloudflare Workers, where
 * there is no filesystem to check.
 *
 * Images render with `fill`, so a replacement photo of any dimensions crops
 * correctly without anyone editing code. Every call site provides a positioned,
 * sized parent.
 */

export type { SurfaceName };

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
      src={SURFACE_SRC[name]}
      alt={alt}
      fill
      sizes={sizes}
      priority={priority}
      className={`object-cover ${className}`}
    />
  );
}
