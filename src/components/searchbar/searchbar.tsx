import React, { useState } from "react";
import "./searchbar.scss";

const Searchbar: React.FC<{
  onSearch: (query: string) => void;
}> = ({ onSearch }) => {
  const [searchValue, setSearchValue] = useState("");

  // Search for the given query when user hits Enter...
  const handleEnterPress = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter" && searchValue !== "") onSearch(searchValue);
  };
  // ...or clicks on the search icon
  const handleSearchIconClick = () => {
    if (searchValue !== "") onSearch(searchValue);
  };

  return (
    <div className="searchbar">
      <ul>
        <li>
          <input
            className="searchbar__input"
            placeholder="Search..."
            type="text"
            value={searchValue}
            onChange={(e) => {
              setSearchValue(e.target.value);
            }}
            onKeyDown={(e) => {
              handleEnterPress(e);
            }}
          />
        </li>
        <li>
          <i
            className="fas fa-search searchbar__icon"
            onClick={() => {
              handleSearchIconClick();
            }}
          ></i>
        </li>
      </ul>
    </div>
  );
};

export default Searchbar;
