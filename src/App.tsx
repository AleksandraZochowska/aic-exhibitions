import "./App.scss";
import Topbar from "./components/topbar/topbar";
import Table from "./components/table/table";
import { useEffect, useState } from "react";
import axios from "axios";
import Searchbar from "./components/searchbar/searchbar";
import Pagination from "./components/pagination/pagination";

const apiUrl = "https://api.artic.edu/api/v1/exhibitions";

interface Exhibition {
  title: string | null;
  is_featured: boolean;
  description: string | null;
  gallery_title: string | null;
  type: string | null;
  status: string;
}

export type ExhibitionList = Exhibition[];

function App() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(false);
  const [shownExhibitionsList, setShownExhibitionsList] = useState<ExhibitionList>([]);
  const [currentPageNumber, setCurrentPageNumber] = useState(1);
  const [lastPageNumber, setLastPageNumber] = useState(1);
  const [currentSearchQuery, setCurrentSearchQuery] = useState("");
  const [orderAsc, setOrderAsc] = useState(true);
  const [currentSort, setCurrentSort] = useState("");

  useEffect(() => {
    setLoading(true);
  }, []);

  // Hook fetching data on every currentPageNumber change
  useEffect(() => {
    fetchData({ pageNumber: currentPageNumber, searchQuery: currentSearchQuery, sort: currentSort });
  }, [currentPageNumber]);

  // Function sending GET request to AIC API
  const fetchData = async (requestParams: { pageNumber?: number; searchQuery?: string; sort?: string }) => {
    let { pageNumber, searchQuery, sort } = requestParams;
    // Set page number to passed number - or to correct one if number outside of range was passed
    pageNumber = pageNumber === undefined || pageNumber < 1 ? 1 : pageNumber > lastPageNumber ? lastPageNumber : pageNumber;
    // Set URL parts to be added to main API URL
    searchQuery = searchQuery === undefined ? "" : searchQuery;
    sort = sort === undefined ? "" : sort;

    // Set flags
    setError(false);
    setLoading(true);

    try {
      // Send request
      const response = await axios.get(`${apiUrl}/search?${searchQuery}${sort}`, {
        params: {
          limit: 30,
          page: pageNumber,
          fields: ["title", "is_featured", "description", "gallery_title", "type", "status"],
        },
      });

      // Turn off loading; Keep response data & number of pages in an array for furhter use
      setLoading(false);
      setShownExhibitionsList(response.data.data);
      setLastPageNumber(response.data.pagination.total_pages);
    } catch (err) {
      // Turn off loading, turn on error
      setLoading(false);
      setError(true);
    }
  };

  // Function handling searching for exhibitions, passed as callback to Searchbar component
  const handleSearch: (query: string) => void = async (query) => {
    // Disallow searching for new query while the request is still pending
    if (loading) return;
    await setCurrentSearchQuery(`&q=${query}`);
    if (currentPageNumber === 1) fetchData({ searchQuery: `&q=${query}` });
    else setCurrentPageNumber(1);
  };

  // Function handling sorting of columns, passed as callback to Table component
  // ~ TODO: add sorting for columns other than Title ~
  const handleSort: (e: React.MouseEvent<HTMLTableHeaderCellElement, MouseEvent>) => void = (e) => {
    // Disallow sorting if an error occured or the request is still pending
    if (error || loading) return;

    if (orderAsc) {
      setOrderAsc(false);
      setCurrentSort(`&sort[title.keyword][order]=desc`);
      // ~ setCurrentSort(`&sort[${e.currentTarget.id}.keyword][order]=desc`); ~
      if (currentPageNumber === 1) fetchData({ searchQuery: currentSearchQuery, sort: `&sort[title.keyword][order]=desc` });
      else setCurrentPageNumber(1);
    }
    if (!orderAsc) {
      setOrderAsc(true);
      setCurrentSort(`&sort[title.keyword][order]=asc`);
      // ~ setCurrentSort(`&sort[${e.currentTarget.id}.keyword][order]=asc`); ~
      if (currentPageNumber === 1) fetchData({ searchQuery: currentSearchQuery, sort: `&sort[title.keyword][order]=asc` });
      else setCurrentPageNumber(1);
    }
  };

  // Function handling the page change, passed as callback to Pagination component
  const handlePageChange: (e: React.MouseEvent, val: string | number) => void = (e, val) => {
    // Disallow changing page while the request is pending
    if (loading) return;

    // If user clicks on a number, go to chosen page
    if (typeof val === "number") {
      setCurrentPageNumber(val);
    }

    // If user clicks on an arrow...
    if (typeof val === "string") {
      let x = 1;

      // For smaller screens arrow will push 1 page forward/back
      if (window.matchMedia("(max-width: 791px)").matches) {
        x = 1;
      }
      // For bigger screens arrow will push adequately more pages forward/back (to keep number of items equal to 9)
      if (!window.matchMedia("(max-width: 791px)").matches) {
        switch (currentPageNumber) {
          case 1:
          case lastPageNumber:
            x = 6;
            break;
          case 2:
          case lastPageNumber - 1:
            x = 5;
            break;
          case 3:
          case lastPageNumber - 2:
            x = 4;
            break;
          case 4:
          case lastPageNumber - 3:
            x = 3;
            break;
          default:
            x = 2;
        }
      }
      // Backward arrow pushes backwards
      if (val === "🠔") {
        setCurrentPageNumber(currentPageNumber - x);
      }
      // Forward arrow pushes forwards
      if (val === "🠖") {
        setCurrentPageNumber(currentPageNumber + x);
      }
    }
  };

  // Return main (and for now only) view of the app:
  return (
    <div className="App">
      <header className="App-header">
        <Topbar />
      </header>
      <main>
        <Searchbar onSearch={handleSearch} />
        {error ? null : <Pagination currentPage={currentPageNumber} lastPage={lastPageNumber} onPageChange={handlePageChange} />}
        {error ? (
          <div className="error-message">"We're sorry, we cannot show you any exhibitions - try again!"</div>
        ) : loading ? (
          <div className="loading-message">LOADING...</div>
        ) : (
          <Table
            tableData={shownExhibitionsList}
            tableHeadings={["Title", "Description", "Gallery", "Featured", "Type of Exhibition"]}
            onHeadingClick={handleSort}
          />
        )}
        {loading || error ? null : <Pagination currentPage={currentPageNumber} lastPage={lastPageNumber} onPageChange={handlePageChange} />}
      </main>
    </div>
  );
}

export default App;
