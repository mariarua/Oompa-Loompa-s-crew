const SearchBar = () => {
  return (
    <div className="flex items-center bg-white border border-gray-300 rounded-md overflow-hidden max-w-sm shadow-sm">
      <input
        type="text"
        className="flex-1 px-3 py-2 text-sm placeholder-gray-500 border-none outline-none bg-transparent"
        placeholder="Search"
      />
      <button className="px-3 py-2 bg-gray-50 border-l border-gray-300 hover:bg-gray-100 transition-colors">
        <img
          src="https://s3.eu-central-1.amazonaws.com/napptilus/level-test/imgs/ic_search.png"
          alt="Search Icon"
          className="w-4 h-4"
        />
      </button>
    </div>
  );
};

export default SearchBar;
