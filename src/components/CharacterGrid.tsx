import { useEffect, useRef } from "react";
import { useSelector, useDispatch } from "react-redux";
import type { RootState, AppDispatch } from "../store/index";
import type { OompaLoompa } from "../store/slices/oompaLoompaSlice";
import { fetchOompaLoompas } from "../store/slices/oompaLoompaSlice";
import CharacterCard from "./CharacterCard";

const CharacterGrid = () => {
  const dispatch = useDispatch<AppDispatch>();
  const { data, loading, currentPage } = useSelector(
    (state: RootState) => state.oompaLoompas
  );
  const loadMoreRef = useRef<HTMLDivElement>(null);

  const handleCardClick = (id: number) => {
    console.log(`Card with ID ${id} clicked`);
  };

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting && !loading && data.length > 0) {
          console.log(`Loading page ${currentPage}...`);
          dispatch(fetchOompaLoompas(currentPage));
        }
      },
      {
        threshold: 0.1,
        rootMargin: "100px",
      }
    );

    if (loadMoreRef.current) {
      observer.observe(loadMoreRef.current);
    }

    return () => {
      if (loadMoreRef.current) {
        observer.unobserve(loadMoreRef.current);
      }
    };
  }, [dispatch, currentPage, loading, data.length]);

  return (
    <div>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 p-6 max-w-7xl mx-auto">
        {data.map((character: OompaLoompa) => (
          <CharacterCard
            key={character.id}
            id={character.id}
            firstName={character.first_name}
            lastName={character.last_name}
            gender={character.gender}
            profession={character.profession}
            image={character.image}
            onClick={handleCardClick}
          />
        ))}
      </div>

      <div ref={loadMoreRef} className="h-20 flex items-center justify-center">
        {loading && (
          <div className="text-gray-500">Loading more Oompa Loompas... 🍫</div>
        )}
      </div>
    </div>
  );
};

export default CharacterGrid;
