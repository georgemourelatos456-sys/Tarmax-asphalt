import Image from "next/image";

/**
 * The TARMAX wordmark.
 *
 * Vector asset built by scripts/generate-logo.mjs — a reconstruction of the
 * supplied logo, so it stays sharp at any size and costs a few KB. If the
 * original vector file is available it can replace public/brand/tarmax-logo.svg
 * with no other change.
 *
 * `mono` swaps to the warm-white lockup for places where the red mark would
 * compete with a red call to action.
 */
export function Wordmark({
  mono = false,
  className = "",
  priority = false,
}: {
  mono?: boolean;
  className?: string;
  priority?: boolean;
}) {
  return (
    <Image
      src={mono ? "/brand/tarmax-logo-mono.svg" : "/brand/tarmax-logo.svg"}
      alt="TARMAX Asphalt"
      width={605}
      height={176}
      priority={priority}
      className={`h-auto w-[8.25rem] md:w-[9.5rem] ${className}`}
    />
  );
}
