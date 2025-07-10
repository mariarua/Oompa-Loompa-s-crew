import { useParams, useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import { useAppDispatch, useAppSelector } from "../store/hooks";
import { loadOompaLoompaDetail } from "../store/slices/oompaLoompaSlice";
import type { OompaLoompa } from "../types/oompaLoompa";
import CharacterDetail from "../components/CharacterDetail";
import {
  LoadingState,
  ErrorState,
  NotFoundState,
} from "../components/StateDisplay";

const DetailPage = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const dispatch = useAppDispatch();

  const { detailsCache, loadingDetailId, error } = useAppSelector(
    (state) => state.oompaLoompas
  );

  const [character, setCharacter] = useState<OompaLoompa | null>(null);
  const characterId = parseInt(id!);
  const isLoading = loadingDetailId === characterId;

  const handleBack = () => navigate("/");

  useEffect(() => {
    if (!id || isNaN(characterId)) {
      navigate("/");
      return;
    }

    const cachedCharacter = detailsCache[characterId];
    if (cachedCharacter) {
      setCharacter(cachedCharacter);
      return;
    }

    dispatch(loadOompaLoompaDetail(characterId));
  }, [id, characterId, dispatch, detailsCache, navigate]);

  useEffect(() => {
    const cachedCharacter = detailsCache[characterId];
    if (cachedCharacter) {
      setCharacter(cachedCharacter);
    }
  }, [detailsCache, characterId]);

  if (isLoading) return <LoadingState onBack={handleBack} />;
  if (error) return <ErrorState error={error} onBack={handleBack} />;
  if (!character && !isLoading) return <NotFoundState onBack={handleBack} />;
  if (!character) return null;

  return (
    <main className="max-w-7xl mx-auto p-6">
      <CharacterDetail character={character} />
    </main>
  );
};

export default DetailPage;
