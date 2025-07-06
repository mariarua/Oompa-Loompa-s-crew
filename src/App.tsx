import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchOompaLoompas } from "./store/slices/oompaLoompaSlice";
import type { RootState, AppDispatch } from "./store/index";

import Header from "./components/Header";
import HeroSection from "./components/HeroSection";
import SearchBar from "./components/SearchBar";
import CharacterGrid from "./components/CharacterGrid";

function App() {
  const dispatch = useDispatch<AppDispatch>();
  const { data, loading } = useSelector(
    (state: RootState) => state.oompaLoompas
  );

  useEffect(() => {
    if (data.length === 0) {
      dispatch(fetchOompaLoompas(1));
    }
  }, [dispatch, data.length]);

  if (loading && data.length === 0) {
    return <div className="bg-red-900">Loading...</div>;
  }

  console.log("Oompa Loompas Data:", data);

  return (
    <div>
      <div>
        <Header />
      </div>
      <main>
        <div className="flex flex-col items-center justify-center p-4 w-full max-w-7xl mx-auto">
          <div className="w-full flex justify-end">
            <SearchBar />
          </div>
          <HeroSection />
        </div>
        <CharacterGrid />
      </main>
    </div>
  );
}

export default App;
