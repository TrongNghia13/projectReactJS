import React, { useEffect, useRef, useState } from "react";
import ListComponent from "./ListComponent";
import data from "../MOCK_DATA.json";
import "../styles/productList.css";

const handleFilterData = (searchTerm) => (product) =>
  product.name.toLowerCase().includes(searchTerm.toLowerCase());

const ApiStimulate = async (searchText, offset = 0, limit = 10) => {
  return new Promise((resolve) => {
    setTimeout(() => {
      const filter = handleFilterData(searchText);
      const filteredData = searchText ? data.filter(filter) : data;
      const pageNateData = filteredData.slice(offset, offset + limit);
      const hasMore = filteredData.length > offset + limit;
      resolve({ products: pageNateData, hasMore });
    }, 1000);
  });
};

function ProductList({ onAddToCart }) {
  const [searchTerm, setSearchTerm] = useState("");
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [isloading, setIsloading] = useState(true);
  const [offset, setOffset] = useState(0);
  const [isloadMore, setIsloadMore] = useState(false);
  const [hasMore, setHasMore] = useState(false);

  const inputRef = useRef(null);

  const handleSearchTermChange = (event) => {
    setSearchTerm(event.target.value);
  };

  const handleSearch = () => {
    fetchProducts(searchTerm);
  };

  const fetchProducts = async (searchText) => {
    setIsloading(true);
    try {
      const { products, hasMore: hasMoreResponse } = await ApiStimulate(
        searchText,
        0
      );
      setFilteredProducts(products);
      setHasMore(hasMoreResponse);
      setIsloading(false);
    } catch (e) {
      console.error(e);
      setIsloading(false);
    }
  };

  const fetchLoadProducts = async (searchText, newOffset = 0) => {
    setIsloadMore(true);
    try {
      const { products, hasMore: hasMoreResponse } = await ApiStimulate(
        searchText,
        newOffset
      );
      setFilteredProducts((prevProducts) =>
        newOffset === 0 ? products : [...prevProducts, ...products]
      );
      setHasMore(hasMoreResponse);
      setIsloadMore(false);
    } catch (e) {
      console.error(e);
      setIsloadMore(false);
    }
  };

  const handleLoadMore = () => {
    const newOffset = offset + 10;
    setOffset(newOffset);
    fetchLoadProducts(searchTerm, newOffset);
  };

  useEffect(() => {
    fetchProducts("");
  }, []);

  return (
    <div>
      <div style={{ display: "flex", marginBottom: "16px" }}>
        <input
          type="text"
          placeholder="Search products..."
          value={searchTerm}
          onChange={handleSearchTermChange}
          ref={inputRef}
          style={{ padding: "8px", marginRight: "8px" }}
        />
        <button onClick={handleSearch}>Search</button>
      </div>
      {isloading && <div className="loading">Loading...</div>}
      <div className="product-grid">
        {filteredProducts.map((product) => (
          <ListComponent
            key={product.id}
            product={product}
            onAddToCart={(quantity) => onAddToCart(product, quantity)}
          />
        ))}
      </div>
      {hasMore && !isloadMore && (
        <button onClick={handleLoadMore}>LOAD MORE</button>
      )}
      {isloadMore && <div>Loading more...</div>}
    </div>
  );
}

export default ProductList;
