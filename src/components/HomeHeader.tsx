import HeroSection from "./HeroSection";
import SearchBar from "./SearchBar";

const HomeHeader = () => (
  <div className="flex flex-col items-center justify-center p-4 w-full max-w-7xl mx-auto">
    <div className="w-full flex justify-end mb-4">
      <SearchBar />
    </div>
    <HeroSection />
  </div>
);

export default HomeHeader;
