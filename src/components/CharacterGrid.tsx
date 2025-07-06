import { useSelector } from "react-redux";
import type { RootState } from "../store/index";
import type { OompaLoompa } from "../store/slices/oompaLoompaSlice";
import CharacterCard from "./CharacterCard";

const CharacterGrid = () => {
  const { data } = useSelector((state: RootState) => state.oompaLoompas);

  const handleCardClick = (id: number) => {
    console.log(`Card with ID ${id} clicked`);
  };

  return (
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
  );
};

export default CharacterGrid;
