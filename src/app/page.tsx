import { Hero } from "@/components/sections/Hero";
import { Problems } from "@/components/sections/Problems";
import { FreezeThaw } from "@/components/sections/FreezeThaw";
import { Services } from "@/components/sections/Services";
import { Mission } from "@/components/sections/Mission";
import { WhyTarmax } from "@/components/sections/WhyTarmax";
import { PropertySplit } from "@/components/sections/PropertySplit";
import { Contact } from "@/components/sections/Contact";
import { FinalCta } from "@/components/sections/FinalCta";

/**
 * The homepage follows the customer's own sequence: see the problem,
 * understand why it worsens, see the solution, understand freeze-thaw, decide
 * TARMAX is competent, then call or send an address.
 */
export default function HomePage() {
  return (
    <>
      <Hero />
      <Problems />
      <FreezeThaw />
      <Services />
      <Mission />
      <WhyTarmax />
      <PropertySplit />
      <Contact />
      <FinalCta />
    </>
  );
}
