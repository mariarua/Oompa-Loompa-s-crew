interface CharacterCardProps {
  id: number;
  firstName: string;
  lastName: string;
  gender: string;
  profession: string;
  image: string;
  onClick: (id: number) => void;
}

const CharacterCard = ({
  id,
  firstName,
  lastName,
  gender,
  profession,
  image,
  onClick,
}: CharacterCardProps) => {
  return (
    <div
      className="bg-white rounded-lg shadow-none hover:shadow-lg overflow-hidden cursor-pointer transition-shadow group"
      onClick={() => onClick(id)}
    >
      <img
        src={image}
        alt={`${firstName} ${lastName}`}
        className="w-full h-48 object-cover"
      />
      <div className="p-4">
        <h4 className="text-start text-gray-700 font-semibold group-hover:text-[#19B6C8] transition-colors">
          {firstName} {lastName}
        </h4>
        <p className="text-sm text-gray-500">
          {gender === "F" ? "Woman" : "Man"}
        </p>
        <p className="text-sm text-gray-500 italic">{profession}</p>
      </div>
    </div>
  );
};

export default CharacterCard;
