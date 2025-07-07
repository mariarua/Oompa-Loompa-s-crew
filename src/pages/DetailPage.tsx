import { useParams, useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import type { RootState } from "../store/index";

const DetailPage = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();

  const character = useSelector((state: RootState) =>
    state.oompaLoompas.data.find((char) => char.id === parseInt(id!))
  );

  if (!character) {
    return <div>Character not found 🍫</div>;
  }

  const handleBackClick = () => {
    navigate("/");
  };

  return (
    <main className="max-w-4xl mx-auto p-6">
      <button
        onClick={handleBackClick}
        className="mb-4 text-blue-500 hover:text-blue-700"
      >
        ← Back to list
      </button>

      <div className="bg-white rounded-lg shadow-lg overflow-hidden">
        <div className="md:flex">
          <div className="md:w-1/2">
            <img
              src={character.image}
              alt={`${character.first_name} ${character.last_name}`}
              className="w-full h-64 md:h-full object-cover"
            />
          </div>
          <div className="md:w-1/2 p-6">
            <h1 className="text-2xl font-bold text-[#19B6C8] mb-2">
              {character.first_name} {character.last_name}
            </h1>
            <p className="text-gray-600 mb-2">
              {character.gender === "F" ? "Woman" : "Man"}
            </p>
            <p className="text-gray-800 mb-4">{character.profession}</p>

            <div className="space-y-2">
              <p>
                <span className="font-semibold">Age:</span> {character.age}
              </p>
              <p>
                <span className="font-semibold">Height:</span>{" "}
                {character.height} cm
              </p>
              <p>
                <span className="font-semibold">Country:</span>{" "}
                {character.country}
              </p>
              <p>
                <span className="font-semibold">Email:</span> {character.email}
              </p>
            </div>

            {character.favorite && (
              <div className="mt-4">
                <h3 className="font-semibold mb-2">Favorites:</h3>
                <p>
                  <span className="font-medium">Color:</span>{" "}
                  {character.favorite.color}
                </p>
                <p>
                  <span className="font-medium">Food:</span>{" "}
                  {character.favorite.food}
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    </main>
  );
};

export default DetailPage;
