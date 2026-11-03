import { Hero } from "@/components/hero/Hero";
import { About } from "@/components/sections/About";
import { SelectedWork } from "@/components/sections/SelectedWork";
import { MobileShowcase } from "@/components/sections/MobileShowcase";
import { DataJourney } from "@/components/sections/DataJourney";
import { Architecture } from "@/components/sections/Architecture";
import { ArchiveSection } from "@/components/sections/ArchiveSection";
import { Process } from "@/components/sections/Process";
import { Contact } from "@/components/contact/Contact";

export default function HomePage() {
  return (
    <>
      <Hero />
      <About />
      <SelectedWork />
      <MobileShowcase />
      <DataJourney />
      <Architecture />
      <ArchiveSection />
      <Process />
      <Contact />
    </>
  );
}
