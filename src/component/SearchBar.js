import React, { useState, useRef, useEffect } from "react";
import SearchIcon from "@mui/icons-material/Search";
import { Button } from "@mui/material";
import { useHistory } from "react-router-dom";
import "../styles/searchBar.css";
import ProductService from "../services/productService"; // Điều chỉnh import theo đường dẫn thực tế

const SearchBar = ({ onSearch }) => {
  const [searchTerm, setSearchTerm] = useState("");
  const [suggestions, setSuggestions] = useState([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [selectedSuggestionIndex, setSelectedSuggestionIndex] = useState(-1);
  const [initialProducts, setInitialProducts] = useState([]);
  const inputRef = useRef(null);
  const history = useHistory();

  useEffect(() => {
    const fetchInitialProducts = async () => {
      try {
        const products = await ProductService.getPaged({ limit: 0, offset: 0 });
        setInitialProducts(products);
      } catch (error) {
        console.error("Failed to fetch products:", error);
      }
    };

    fetchInitialProducts();
  }, []);

  const handleFilterData = (searchTerm) => (product) =>
    product.title.toLowerCase().includes(searchTerm.toLowerCase());

  const handleSearchTermChange = (event) => {
    const value = event.target.value;
    setSearchTerm(value);
    setSelectedSuggestionIndex(-1);
    const suggestions = initialProducts
      .filter(handleFilterData(value))
      .slice(0, 5)
      .map((product) => product.title);
    setSuggestions(suggestions);
    setShowSuggestions(value.trim() !== "" && suggestions.length > 0);
  };

  const handleKeyDown = (event) => {
    if (event.key === "Enter") {
      if (selectedSuggestionIndex !== -1) {
        handleSuggestionClick(suggestions[selectedSuggestionIndex]);
      } else {
        handleSearch();
      }
    } else if (event.key === "ArrowDown") {
      event.preventDefault();
      const newIndex =
        selectedSuggestionIndex === suggestions.length - 1
          ? 0
          : selectedSuggestionIndex + 1;
      setSelectedSuggestionIndex(newIndex);
    } else if (event.key === "ArrowUp") {
      event.preventDefault();
      const newIndex =
        selectedSuggestionIndex <= 0
          ? suggestions.length - 1
          : selectedSuggestionIndex - 1;
      setSelectedSuggestionIndex(newIndex);
    }
  };

  const handleSearch = () => {
    const searchParams = new URLSearchParams(window.location.search);
    searchParams.set("searchTerm", searchTerm);
    history.push({
      search: searchParams.toString(),
    });
    if (typeof onSearch === "function") {
      onSearch(searchTerm);
    } else {
      console.error("onSearch is not a function");
    }
  };

  const handleSuggestionClick = (suggestion) => {
    setSearchTerm(suggestion);
    setShowSuggestions(false);
    if (typeof onSearch === "function") {
      onSearch(suggestion);
    } else {
      console.error("onSearch is not a function");
    }
  };

  return (
    <div
      style={{
        position: "relative",
        display: "flex",
        justifyContent: "center",
        marginBottom: "16px",
      }}
    >
      <div className="searchBar">
        <input
          type="text"
          placeholder="Search products..."
          value={searchTerm}
          onChange={handleSearchTermChange}
          onKeyDown={handleKeyDown}
          ref={inputRef}
          style={{
            padding: "8px",
            marginRight: "8px",
            width: "300px",
            borderRadius: "10px",
          }}
          onBlur={() => setShowSuggestions(false)}
        />
        <Button
          style={{
            minWidth: "20px",
            borderRadius: "5px",
            padding: "5px",
            background: "darkgrey",
          }}
          onClick={handleSearch}
        >
          <SearchIcon />
        </Button>
      </div>
      {showSuggestions && (
        <ul
          style={{
            position: "absolute",
            top: "calc(100% + 1px)",
            right: 0,
            backgroundColor: "white",
            border: "1px solid #ccc",
            zIndex: 1000,
            listStyleType: "none",
            padding: 0,
            margin: 0,
            width: "316px",
            maxHeight: "200px",
            overflowY: "auto",
          }}
        >
          {suggestions.map((suggestion, index) => (
            <li
              key={index}
              onClick={() => handleSuggestionClick(suggestion)}
              onMouseDown={(e) => e.preventDefault()}
              onMouseEnter={() => setSelectedSuggestionIndex(index)}
              onMouseLeave={() => setSelectedSuggestionIndex(-1)}
              style={{
                padding: "8px",
                cursor: "pointer",
                backgroundColor:
                  index === selectedSuggestionIndex ? "#ccc" : "transparent",
              }}
            >
              {suggestion}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default SearchBar;
