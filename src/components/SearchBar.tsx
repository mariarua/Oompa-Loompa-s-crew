import { useState, type ChangeEvent } from "react";
import { useDispatch } from "react-redux";
import { setFilter } from "../store/slices/oompaLoompaSlice";
import type { AppDispatch } from "../store/index";

const SearchBar = () => {
  const [searchValue, setSearchValue] = useState("");
  const dispatch = useDispatch<AppDispatch>();

  const handleInputChange = (e: ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setSearchValue(value);

    dispatch(setFilter(value));
  };

  const handleClear = () => {
    setSearchValue("");
    dispatch(setFilter(""));
  };

  return (
    <div className="flex items-center bg-white border border-gray-300 rounded-md overflow-hidden max-w-sm shadow-sm">
      <input
        type="text"
        value={searchValue}
        onChange={handleInputChange}
        className="flex-1 px-3 py-2 text-sm placeholder-gray-500 border-none outline-none bg-transparent"
        placeholder="Search"
      />
      <button
        onClick={handleClear}
        className="px-3 py-2 bg-gray-50 border-l border-gray-300 hover:bg-gray-100 transition-colors"
      >
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
