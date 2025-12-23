import { HeroSection } from "./_components/home-hero-section";
import { ProblemSection } from "./_components/home-problem-section";
import { StorySection } from "./_components/home-story-section";
import { SolutionSection } from "./_components/home-solution-cards";
import { SkillsSection } from "./_components/home-skills-section";
import { HowItWorksSection } from "./_components/home-how-it-works";
import { IndustrySection } from "./_components/home-industry-section";
import { BenefitsSection } from "./_components/home-benefits-section";
import { MobileSection } from "./_components/home-mobile-section";
import { CTASection } from "./_components/home-cta-section";
import { AnnouncementBanner } from "./_components/home-announcement-banner";

export default function HomePage() {
  return (
    <main>
      <AnnouncementBanner />
      <HeroSection />
      <ProblemSection />
      {/* <SolutionSection /> */}
      <StorySection />
      <HowItWorksSection />
      <SkillsSection />
      <IndustrySection />
      <BenefitsSection />
      <MobileSection />
      <CTASection />
    </main>
  );
}
