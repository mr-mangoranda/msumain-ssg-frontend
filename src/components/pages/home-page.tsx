import AdvocasixSection from "../sections/advocasix-section";
import HomeHeroSection from "../sections/home-hero-section";
import MonthlyReportsSection from "../sections/monthly-reports-section";
import SDGSection from "../sections/sdg-section";

export default function HomePage() {
  return (
    <main className="flex flex-col items-center">
      <HomeHeroSection />
      <MonthlyReportsSection />
      {/* <AdvocasixSection />
      <SDGSection /> */}
    </main>
  );
}
