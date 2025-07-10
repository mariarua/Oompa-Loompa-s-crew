import type { OompaLoompa } from "../types/oompaLoompa";

const CharacterInfo = ({ character }: { character: OompaLoompa }) => {
  const infoItems = [
    { label: "Age", value: character.age },
    { label: "Height", value: `${character.height} cm` },
    { label: "Country", value: character.country },
    { label: "Email", value: character.email, isEmail: true },
  ];

  return (
    <div className="grid grid-cols-2 gap-4 mb-6">
      {infoItems.map(({ label, value, isEmail }) => (
        <div key={label} className="bg-gray-50 p-3 rounded-lg">
          <span className="text-sm text-gray-500 block">{label}</span>
          <span
            className={`font-semibold ${
              isEmail ? "text-sm break-all" : "text-lg"
            }`}
          >
            {value}
          </span>
        </div>
      ))}
    </div>
  );
};

const CharacterSection = ({
  title,
  content,
  className = "text-gray-700 bg-gray-50 p-4 rounded-lg",
}: {
  title: string;
  content: string;
  className?: string;
}) => (
  <div className="mb-6">
    <h3 className="text-lg font-semibold mb-3 text-gray-800">{title}</h3>
    <div className={className} dangerouslySetInnerHTML={{ __html: content }} />
  </div>
);

const FavoriteColor = ({ color }: { color: string }) => (
  <div className="flex items-center">
    <span
      className="w-16 h-4 rounded mr-3"
      style={{ backgroundColor: color }}
    />
    <span className="font-medium">Color:</span>
    <span className="ml-2">{color}</span>
  </div>
);

const CharacterFavorites = ({
  favorite,
}: {
  favorite: OompaLoompa["favorite"];
}) => (
  <div>
    <h3 className="text-lg font-semibold mb-3 text-gray-800">Favorites</h3>
    <div className="space-y-3">
      <FavoriteColor color={favorite.color} />
      <div>
        <span className="font-medium">Food:</span>
        <span className="ml-2">{favorite.food}</span>
      </div>

      {favorite.song && (
        <div className="mt-4">
          <h4 className="font-medium mb-2 text-gray-800">Favorite Song</h4>
          <div
            className="text-sm text-gray-700 whitespace-pre-wrap bg-gradient-to-r from-purple-50 to-pink-50 p-4 rounded-lg border border-purple-200"
            dangerouslySetInnerHTML={{ __html: favorite.song }}
          />
        </div>
      )}
    </div>
  </div>
);

const CharacterDetail = ({ character }: { character: OompaLoompa }) => (
  <div className="bg-white rounded-lg shadow-lg overflow-hidden">
    <div className="md:flex">
      <div className="md:w-1/2">
        <img
          src={character.image}
          alt={`${character.first_name} ${character.last_name}`}
          className="w-full h-96 md:h-full md:max-h-96 object-cover"
        />
      </div>

      <div className="md:w-1/2 p-6">
        <h1 className="text-3xl font-bold text-[#19B6C8] mb-2">
          {character.first_name} {character.last_name}
        </h1>
        <p className="text-gray-600 mb-2 text-lg">
          {character.gender === "F" ? "Woman" : "Man"}
        </p>
        <p className="text-gray-800 mb-6 text-lg font-medium">
          {character.profession}
        </p>

        <CharacterInfo character={character} />

        {character.description && (
          <CharacterSection
            title="Description"
            content={character.description}
          />
        )}

        {character.quota && (
          <CharacterSection
            title="Quote"
            content={character.quota}
            className="text-gray-700 italic bg-blue-50 p-4 rounded-lg border-l-4 border-[#19B6C8]"
          />
        )}

        {character.favorite && (
          <CharacterFavorites favorite={character.favorite} />
        )}
      </div>
    </div>
  </div>
);

export default CharacterDetail;
