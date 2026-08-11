import Image from "next/image";

/**
 * The site's imagery layer.
 *
 * Every photograph on the site is a generated asphalt surface (see
 * scripts/generate-textures.mjs). Routing them through one component means
 * swapping in real photography later is a change to this file and nothing
 * else.
 */
export const SURFACES = {
  hero: { src: "/textures/asphalt-hero.jpg", width: 1600, height: 1022 },
  oxidized: { src: "/textures/asphalt-oxidized.jpg", width: 1400, height: 1000 },
  crack: { src: "/textures/asphalt-crack.jpg", width: 1400, height: 1000 },
  pothole: { src: "/textures/asphalt-pothole.jpg", width: 1400, height: 1000 },
  lot: { src: "/textures/asphalt-lot.jpg", width: 1600, height: 889 },
  driveway: { src: "/textures/asphalt-driveway.jpg", width: 1400, height: 1000 },
} as const;

export type SurfaceName = keyof typeof SURFACES;

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
  const surface = SURFACES[name];
  return (
    <Image
      src={surface.src}
      alt={alt}
      width={surface.width}
      height={surface.height}
      sizes={sizes}
      priority={priority}
      className={`h-full w-full object-cover ${className}`}
    />
  );
}
