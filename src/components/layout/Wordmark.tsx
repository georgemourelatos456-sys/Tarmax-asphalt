import Image from "next/image";

/**
 * The TARMAX wordmark — the supplied artwork, not a reconstruction.
 *
 * Transparent PNG, so it sits correctly on the dark nav, the footer and any
 * photograph behind it. Rendered at roughly a seventh of its native width, so
 * it stays crisp on high-density screens.
 */
export function Wordmark({
  className = "",
  priority = false,
}: {
  className?: string;
  priority?: boolean;
}) {
  return (
    <Image
      src="/brand/tarmax-logo.png"
      alt="TARMAX Asphalt"
      width={1090}
      height={300}
      priority={priority}
      className={`h-auto w-[8.5rem] md:w-[10rem] ${className}`}
    />
  );
}
