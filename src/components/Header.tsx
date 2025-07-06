const Header = () => {
  return (
    <div className="bg-gray-300 w-full gap-6">
      <div className="max-w-7xl mx-auto flex items-center justify-start p-1">
        <img
          src="https://s3.eu-central-1.amazonaws.com/napptilus/level-test/imgs/logo-umpa-loompa.png"
          alt="Logo Oompa Loompa"
          className="w-6 h-5 rounded-full m-4"
        />
        <h1 className="font-bold">Oompa Loompa's crew</h1>
      </div>
    </div>
  );
};

export default Header;
