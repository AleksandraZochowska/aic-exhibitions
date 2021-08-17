import React, { MouseEvent, useEffect, useState } from "react";
import "./pagination.scss";

const Pagination: React.FC<{
  currentPage: number;
  lastPage: number;
  onPageChange: (e: MouseEvent, val: string | number) => void;
}> = ({ currentPage, lastPage, onPageChange }) => {
  const [screenWidth, setScreenWidth] = useState(0);

  // On Pagination mount: get the current window width, set event listener;
  // On unmount: remove event listener
  useEffect(() => {
    const handleWindowResize = () => {
      setScreenWidth(window.innerWidth);
    };
    handleWindowResize();
    window.addEventListener("resize", handleWindowResize);
    return () => window.removeEventListener("resize", handleWindowResize);
  }, []);

  // Helper function pushing numbers & arrows into the array:
  const populateArr: (start: number, stop: number) => (string | number)[] = (start, stop) => {
    const arr = [];
    for (let i = start; i <= stop; i++) {
      arr.push(i);
    }
    return arr as (string | number)[];
  };

  // Function deciding, what building blocks the pagination will consist of:
  const getValues: () => (string | number)[] = () => {
    let x = 2;

    // For bigger screens - show extended pagination controls:
    if (screenWidth > 791) {
      // If there are 9 or less pages - show no arrows:
      if (lastPage <= 9) {
        return populateArr(1, lastPage) as (string | number)[];
      }

      // Else, if there are more than 9 pages...
      switch (currentPage) {
        case 1:
        case lastPage:
          x = 6;
          break;
        case 2:
        case lastPage - 1:
          x = 5;
          break;
        case 3:
        case lastPage - 2:
          x = 4;
          break;
        case 4:
        case lastPage - 3:
          x = 3;
          break;
        default:
          x = 2;
      }

      // ... show only right arrow if the left one is not needed
      if (currentPage <= 4) {
        return populateArr(1, currentPage + x).concat(["🠖", lastPage]) as (string | number)[];
      }

      // ... show only left arrow if the right one is not needed
      if (currentPage >= lastPage - 3) {
        return [1, "🠔"].concat(populateArr(currentPage - x, lastPage)) as (string | number)[];
      }

      // ... show both arrows if current page is between 5 & (last page - 4)
      return [1, "🠔"].concat(populateArr(currentPage - 2, currentPage + 2)).concat(["🠖", lastPage]) as (string | number)[];
    }

    // For smaller screens - show reduced pagination controls:
    x = 1;
    if (currentPage === 1) {
      return [currentPage, "🠖", lastPage] as (string | number)[];
    }
    if (currentPage === lastPage) {
      return [1, "🠔", lastPage] as (string | number)[];
    }
    return [1, "🠔", currentPage, "🠖", lastPage] as (string | number)[];
  };

  // if there is only 1 page of results, do NOT show pagination controls
  if (lastPage <= 1) return null;

  // Return the pagination component:
  return (
    <nav>
      <div className="pagination-container">
        <ul className="pagination-list">
          {getValues().map((val, index) => (
            <li
              key={index}
              className={
                val === "🠔"
                  ? "pagination-list__item pagination-list__arrow--back"
                  : val === "🠖"
                  ? "pagination-list__item pagination-list__arrow--forward"
                  : val === currentPage
                  ? "pagination-list__item--active pagination-list__number"
                  : "pagination-list__item pagination-list__number"
              }
              onClick={(e) => {
                onPageChange(e, val);
              }}
            >
              {val}
            </li>
          ))}
        </ul>
      </div>
    </nav>
  );
};

export default Pagination;
