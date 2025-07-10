import { useCallback, useEffect, useRef } from "react";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import type { RootState } from "../store/index";
import type { MinimalOompaLoompa } from "../types/oompaLoompa";
import {
  loadOompaLoompasPage,
  selectFilteredOompaLoompas,
} from "../store/slices/oompaLoompaSlice";
import { useAppDispatch } from "../store/hooks";
import CharacterCard from "./CharacterCard";

const INTERSECTION_CONFIG = {
  threshold: 0.1,
  rootMargin: "100px",
} as const;

const EmptyState = ({ filter }: { filter: string }) => (
  <div className="text-center py-8 text-gray-500">
    <div className="text-6xl mb-4">🔍</div>
    <div className="text-lg">No Oompa Loompas found for "{filter}"</div>
    <div className="text-sm text-gray-400 mt-2">
      Try searching by name or profession
    </div>
  </div>
);

const StatusInfo = ({
  count,
  hasMore,
}: {
  count: number;
  currentPage: number;
  totalPages: number;
  hasMore: boolean;
}) => (
  <div className="text-center py-4 text-sm text-gray-500">
    <div>
      Showing {count} Oompa Loompas
      {hasMore && ` • Loading more...`}
    </div>
  </div>
);

const LoadingIndicator = () => (
  <div className="flex items-center space-x-2 text-gray-500">
    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-[#19B6C8]" />
    <span>Loading more Oompa Loompas... 🍫</span>
  </div>
);

const CharacterGrid = () => {
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const loadMoreRef = useRef<HTMLDivElement>(null);

  const { loading, currentPage, hasMore, filter, totalPages } = useSelector(
    (state: RootState) => state.oompaLoompas
  );
  const filteredData = useSelector(selectFilteredOompaLoompas);

  const handleCardClick = useCallback(
    (id: number) => {
      navigate(`/${id}`);
    },
    [navigate]
  );

  const hasActiveFilter = Boolean(filter?.trim());
  const shouldShowInfiniteScroll = !hasActiveFilter && hasMore;

  useEffect(() => {
    const observer = new IntersectionObserver(([entry]) => {
      if (
        entry.isIntersecting &&
        !loading &&
        shouldShowInfiniteScroll &&
        hasMore
      ) {
        dispatch(loadOompaLoompasPage(currentPage));
      }
    }, INTERSECTION_CONFIG);

    const currentRef = loadMoreRef.current;
    if (currentRef && shouldShowInfiniteScroll) {
      observer.observe(currentRef);
    }

    return () => {
      if (currentRef) {
        observer.unobserve(currentRef);
      }
    };
  }, [dispatch, currentPage, loading, shouldShowInfiniteScroll, hasMore]);

  if (hasActiveFilter && filteredData.length === 0) {
    return <EmptyState filter={filter!} />;
  }

  return (
    <div>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 p-6 max-w-7xl mx-auto">
        {filteredData.map((character: MinimalOompaLoompa) => (
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

      {!hasActiveFilter && (
        <StatusInfo
          count={filteredData.length}
          currentPage={currentPage}
          totalPages={totalPages}
          hasMore={hasMore}
        />
      )}

      {shouldShowInfiniteScroll && (
        <div
          ref={loadMoreRef}
          className="h-20 flex items-center justify-center"
        >
          {loading && <LoadingIndicator />}
        </div>
      )}
    </div>
  );
};

export default CharacterGrid;
