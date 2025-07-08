import { useNavigate, useLocation } from "react-router-dom";

const Header = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const handleLogoClick = () => {
    if (location.pathname !== "/") {
      navigate("/");
    }
  };

  return (
    <header className="bg-gray-200 p-4">
      <button
        onClick={handleLogoClick}
        className="flex items-center hover:opacity-80 transition-opacity cursor-pointer"
      >
        <img
          src="https://s3.eu-central-1.amazonaws.com/napptilus/level-test/imgs/logo-umpa-loompa.png"
          alt="Oompa Loompa Logo"
          className="h-8 w-8 mr-2"
        />
        <span className="text-lg font-semibold">Oompa Loompa's Crew</span>
      </button>
    </header>
  );
};

export default Header;
