import { Hero } from "@/components/sections/Hero";
import { Problems } from "@/components/sections/Problems";
import { FreezeThaw } from "@/components/sections/FreezeThaw";
import { Services } from "@/components/sections/Services";
import { Mission } from "@/components/sections/Mission";
import { Method } from "@/components/sections/Method";
import { PropertySplit } from "@/components/sections/PropertySplit";
import { Contact } from "@/components/sections/Contact";
import { QuoteCta } from "@/components/sections/QuoteCta";

/**
 * The homepage follows the customer's own sequence, and every section earns
 * its place by doing one of four jobs: name a problem, show the solution,
 * build trust, or take the quote.
 *
 *   Hero            what TARMAX does, in five seconds
 *   Problems        the three conditions people actually recognise
 *   FreezeThaw      why an Alberta surface gets worse on its own
 *   Services        what we do about it
 *   Mission         maintenance before replacement
 *   Method          why the sealer and the equipment matter
 *   PropertySplit   route residential vs commercial
 *   Contact         talk to a director directly
 *   QuoteCta        submit the address without leaving the page
 */
export default function HomePage() {
  return (
    <>
      <Hero />
      <Problems />
      <FreezeThaw />
      <Services />
      <Mission />
      <Method />
      <PropertySplit />
      <Contact />
      <QuoteCta />
    </>
  );
}
