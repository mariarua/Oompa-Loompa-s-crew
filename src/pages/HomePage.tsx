import { useHomePageData } from "../hooks/useHomePageData";
import HomeHeader from "../components/HomeHeader";
import CharacterGrid from "../components/CharacterGrid";
import LoadingScreen from "../components/LoadingScreen";

const HomePage = () => {
  const { isInitialLoading } = useHomePageData();

  if (isInitialLoading) {
    return <LoadingScreen />;
  }

  return (
    <main>
      <HomeHeader />
      <CharacterGrid />
    </main>
  );
};

export default HomePage;
