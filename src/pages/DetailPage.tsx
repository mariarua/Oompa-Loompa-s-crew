import { useParams, useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";

interface DetailOompaLoompa {
  id: number;
  first_name: string;
  last_name: string;
  gender: string;
  profession: string;
  image: string;
  email: string;
  age: number;
  country: string;
  height: number;
  description: string;
  quota: string;
  favorite: {
    color: string;
    food: string;
    random_string: string;
    song: string;
  };
}

const DetailPage = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [character, setCharacter] = useState<DetailOompaLoompa | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchCharacterDetail = async () => {
      try {
        setLoading(true);
        const baseUrl = import.meta.env.VITE_API_BASE_URL;
        const response = await fetch(`${baseUrl}/oompa-loompas/${id}`);

        if (!response.ok) {
          throw new Error("Failed to fetch character details");
        }

        const data = await response.json();
        setCharacter(data);
      } catch (err) {
        setError(err instanceof Error ? err.message : "Unknown error");
      } finally {
        setLoading(false);
      }
    };

    if (id) {
      fetchCharacterDetail();
    }
  }, [id]);

  const handleBackClick = () => {
    navigate("/");
  };

  if (loading) {
    return (
      <div className="text-center py-8">
        <p>Loading character details... 🍫</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center py-8">
        <p>Error: {error}</p>
        <button onClick={handleBackClick} className="mt-4 text-blue-500">
          ← Back to list
        </button>
      </div>
    );
  }

  if (!character) {
    return (
      <div className="text-center py-8">
        <p>Character not found 🍫</p>
        <button onClick={handleBackClick} className="mt-4 text-blue-500">
          ← Back to list
        </button>
      </div>
    );
  }

  return (
    <main className="max-w-7xl mx-auto p-6 ">
      <div className="md:flex">
        <div className="md:w-1/2">
          <img
            src={character.image}
            alt={`${character.first_name} ${character.last_name}`}
            className="w-full h-96 md:h-full md:max-h-96 object-cover"
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
              <span className="font-semibold">Height:</span> {character.height}{" "}
              cm
            </p>
            <p>
              <span className="font-semibold">Country:</span>{" "}
              {character.country}
            </p>
            <p>
              <span className="font-semibold">Email:</span> {character.email}
            </p>
          </div>

          {character.description && (
            <div className="mt-4">
              <h3 className="font-semibold mb-2">Description:</h3>
              <div
                className="text-sm text-gray-700"
                dangerouslySetInnerHTML={{ __html: character.description }}
              />
            </div>
          )}

          {character.quota && (
            <div className="mt-4">
              <h3 className="font-semibold mb-2">Quote:</h3>
              <div
                className="text-sm text-gray-700 italic"
                dangerouslySetInnerHTML={{ __html: character.quota }}
              />
            </div>
          )}

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

              {character.favorite.song && (
                <div className="mt-4">
                  <h4 className="font-medium mb-2">Song:</h4>
                  <div
                    className="text-sm text-gray-700 whitespace-pre-wrap bg-gray-50 p-3 rounded"
                    dangerouslySetInnerHTML={{
                      __html: character.favorite.song,
                    }}
                  />
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </main>
  );
};

export default DetailPage;
