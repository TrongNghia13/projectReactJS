import React, { useEffect, useRef, useState } from "react";
import ListComponent from "./ListComponent";
import SearchBar from "./SearchBar";
// import data from "../MOCK_DATA.json";
import SearchIcon from "@mui/icons-material/Search";
import {
  Box,
  Button,
  FormControl,
  Grid,
  InputLabel,
  MenuItem,
  Select,
  Skeleton,
  Typography,
} from "@mui/material";
import {
  BrowserRouter as Router,
  useHistory,
  useLocation,
} from "react-router-dom";
import ProductService from "../services/productService";
import "../styles/productList.css";
import PaginationComponent from "./Pagination";

const generateSlug = (title) => {
  return title
    .toLowerCase()
    .replace(/ /g, "-")
    .replace(/[^\w-]+/g, "'");
};

const handleFilterData =
  (searchTerm, minPrice, maxPrice, minRating) => (product) =>
    product.title.toLowerCase().includes(searchTerm.toLowerCase()) &&
    (minPrice === "" || product.price >= minPrice) &&
    (maxPrice === "" || product.price <= maxPrice) &&
    (minRating === "" || product.rating.rate >= minRating);

const sortProducts = (products, sortBy) => {
  switch (sortBy) {
    case "latest":
      return products.sort((a, b) => new Date(b.date) - new Date(a.date));
    case "popular":
      return products.sort((a, b) => b.rating.count - a.rating.count);
    case "priceAsc":
      return products.sort((a, b) => a.price - b.price);
    case "priceDesc":
      return products.sort((a, b) => b.price - a.price);
    default:
      return products;
  }
};

const fetchProductsFromApi = async (
  searchText,
  minPrice,
  maxPrice,
  minRating,
  sortBy,
  offset = 0,
  limit = 6
) => {
  let filteredData = [];
  try {
    filteredData = await ProductService.getPaged({ limit: 0, offset: 0 });
  } catch (error) {}
  console.log("filteredData", filteredData);

  filteredData = filteredData.filter(
    handleFilterData(searchText, minPrice, maxPrice, minRating)
  );

  filteredData = sortProducts(filteredData, sortBy);
  const total = filteredData.length;
  const pagedData = filteredData.slice(offset, offset + limit);
  return { products: pagedData, total };
};
// }

function ProductList({ onAddToCart }) {
  const [searchTerm, setSearchTerm] = useState("");
  const [minPrice, setMinPrice] = useState("");
  const [maxPrice, setMaxPrice] = useState("");
  const [minRating, setMinRating] = useState("");
  const [sortBy, setSortBy] = useState("");
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [offset, setOffset] = useState(0);
  // const [isLoadMore, setIsLoadMore] = useState(false);
  // const [hasMore, setHasMore] = useState(false);
  const [suggestions, setSuggestions] = useState([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [initialProducts, setInitialProducts] = useState([]);
  const [selectedSuggestionIndex, setSelectedSuggestionIndex] = useState(-1);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(0);
  const [isLoadingPage, setIsLoadingPage] = useState(false);
  const inputRef = useRef(null);
  const history = useHistory();
  const location = useLocation();

  const handleSearchTermChange = (event) => {
    const value = event.target.value;

    setSearchTerm(value);
    setSelectedSuggestionIndex(-1);
    const suggestions = initialProducts
      .filter(handleFilterData(value, minPrice, maxPrice, minRating))
      .slice(0, 5)
      .map((product) => product.title);

    setSuggestions(suggestions);
    setShowSuggestions(value.trim() !== "" && suggestions.length > 0);
  };

  // useEffect(() => {
  //   const fetchProducts = async () => {
  //     const initialProducts = await ProductService.getPaged({
  //       limit: 10,
  //       offset: 0,
  //     });
  //     setProducts(initialProducts);
  //   };
  //   fetchProducts();
  // }, []);

  // const handleSearchTermChange = (event) => {
  //   const value = event.target.value;
  //   setSearchTerm(value);
  //   setSelectedSuggestionIndex(-1);
  //   setSuggestions([]);
  //   setShowSuggestions(false);
  // };

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
    fetchProducts(searchTerm, minPrice, maxPrice, minRating, sortBy, offset);
  };

  useEffect(() => {
    const searchTermParam = new URLSearchParams(window.location.search).get(
      "searchTerm"
    );
    if (searchTermParam) {
      setSearchTerm(searchTermParam);
    }
  }, []);

  const fetchProducts = async (
    searchText = "",
    minPrice = "",
    maxPrice = "",
    minRating = "",
    sortBy = "",
    offset = 0
  ) => {
    setIsLoading(true);
    try {
      const { products, total } = await fetchProductsFromApi(
        searchText,
        minPrice,
        maxPrice,
        minRating,
        sortBy,
        offset
      );

      setFilteredProducts(products);
      setTotalPages(Math.ceil(total / 6));
      setIsLoading(false);
      setShowSuggestions(false);

      if (!searchText.trim()) {
        setInitialProducts(products);
      }
    } catch (e) {
      console.error(e);
      setIsLoading(false);
    }
  };

  const fetchLoadProducts = async (searchText, newOffset = 0) => {
    // setIsLoadMore(true);
    setIsLoadingPage(true); // tải lại trang  chuyển trang
    try {
      const { products, total } = await fetchProductsFromApi(
        searchText,
        minPrice,
        maxPrice,
        minRating,
        sortBy,
        newOffset
      );
      setFilteredProducts(products);
      // setHasMore(hasMoreResponse);
      // setIsLoadMore(false);
      setTotalPages(Math.ceil(total / 6)); // Update total pages
    } catch (e) {
      console.error(e);
      // setIsLoadMore(false);
    } finally {
      setIsLoadingPage(false); //tải lại trang  chuyển trang
    }
  };

  // const handleLoadMore = () => {
  //   const newOffset = offset + 10;
  //   setOffset(newOffset);
  //   fetchLoadProducts(searchTerm, newOffset);
  // };

  const handleSuggestionClick = async (suggestion) => {
    setSearchTerm(suggestion);
    setShowSuggestions(false);
    await fetchProducts(suggestion);
  };

  useEffect(() => {
    fetchProducts("");
  }, []);

  useEffect(() => {
    return history.listen((location) => {
      if (location.pathname === "/" && !searchTerm.trim()) {
        setFilteredProducts(initialProducts);
      }
    });
  }, [history, initialProducts, searchTerm]);

  const handlePageChange = (newPage) => {
    setPage(newPage); // Cập nhật state page
    const newOffset = (newPage - 1) * 6; // Tính toán offset mới dựa trên trang mới
    setOffset(newOffset); // Cập nhật state offset

    const searchParams = new URLSearchParams(window.location.search);
    searchParams.set("page", newPage); // Thêm hoặc cập nhật tham số 'page' trong URL
    history.push({
      search: searchParams.toString(),
    });

    fetchLoadProducts(searchTerm, newOffset); // Gọi hàm fetchLoadProducts để tải dữ liệu cho trang mới
  };

  // function renderProduct() {
  //   return filteredProducts.length > 0 ? (
  //     filteredProducts.map((product) => (
  //       <ListComponent
  //         key={product.id}
  //         product={product}
  //         onAddToCart={(quantity) => onAddToCart(product, quantity)}
  //       />
  //     ))
  //   ) : (
  //     <p>No products found</p>
  //   );
  // }

  // const handleMinRatingChange = (e) => {
  //   const value = parseFloat(e.target.value);
  //   if (!isNaN(value) || e.target.value === "") {
  //     setMinRating(e.target.value);
  //   }
  // };

  // const handleSortByChange = (e) => setSortBy(e.target.value);
  useEffect(() => {
    const searchParams = new URLSearchParams(location.search);
    const searchTermParam = searchParams.get("searchTerm");
    const pageParam = parseInt(searchParams.get("page")) || 1;
    const sortByParam = searchParams.get("sortBy") || "";

    if (searchTermParam) {
      setSearchTerm(searchTermParam);
    }
    if (sortByParam) {
      setSortBy(sortByParam);
    }
    setPage(pageParam);

    const newOffset = (pageParam - 1) * 6;
    fetchProducts(
      searchTermParam || "",
      minPrice,
      maxPrice,
      minRating,
      sortByParam,
      newOffset
    );
  }, [location.search]);

  const handleSortByChange = (value) => {
    setSortBy(value);
    const searchParams = new URLSearchParams(window.location.search);
    searchParams.set("sortBy", value);
    searchParams.set("page", 1);
    history.push({
      search: searchParams.toString(),
    });
    fetchProducts(searchTerm, minPrice, maxPrice, minRating, value, 0);
  };

  const navigateToDetails = (productTitle) => {
    const slug = generateSlug(productTitle);
    history.push(`/product/${slug}`);
    const renderProduct = (product) => (
      <Box key={product.id} className="product-box">
        <Box>
          <Typography variant="h6">{product.title}</Typography>
          <Typography variant="body2" color="textSecondary">
            Price: ${product.price}
          </Typography>
          <Typography variant="body2" color="textSecondary">
            Rating: {product.rating.rate} ({product.rating.count} reviews)
          </Typography>
        </Box>
        <Box className="button-container">
          <Button
            variant="contained"
            color="primary"
            onClick={() => onAddToCart(product)}
          >
            Add to Cart
          </Button>
        </Box>
      </Box>
    );
  };

  const renderSkeletonLoader = (product) => {
    return (
      <Grid container wrap="nowrap">
        {(isLoading ? Array.from(new Array(6)) : product ? [product] : []).map(
          (item, index) => (
            <Box key={index} sx={{ width: 210, marginRight: 5, my: 5 }}>
              {item ? (
                <img
                  style={{ width: 210, height: 10 }}
                  alt={item.title}
                  src={item.image}
                />
              ) : (
                <Skeleton variant="rectangular" width={225} height={330} />
              )}
              {item ? (
                <Box sx={{ pr: 2 }}>
                  <Typography gutterBottom variant="body2">
                    {item.title}
                  </Typography>
                  <Typography
                    display="block"
                    variant="caption"
                    color="text.secondary"
                  >
                    {item.price}$
                  </Typography>
                  <Typography variant="caption" color="text.secondary">
                    {`${item.rating.count} reviews`}
                  </Typography>
                </Box>
              ) : (
                <Box>
                  <Skeleton width="60%" />
                </Box>
              )}
            </Box>
          )
        )}
      </Grid>
    );
  };
  const handleAddNewProductClick = () => {
    history.push("/admin/product/create");
  };

  const handleAdminProductClick = () => {
    history.push("/admin/product");
  };

  return (
    <Router>
      <div style={{ position: "relative" }}>
        <div
          style={{
            display: "flex",
            justifyContent: "center",
            marginBottom: "16px",
            position: "relative",
          }}
        >
          {/* <div>
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
                position: "relative",
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
                textAlign: "center",
              }}
              onClick={handleSearch}
            >
              <SearchIcon />
            </Button>
          </div> */}
          {showSuggestions && (
            <ul
              className="suggestions-style"
              style={{
                position: "absolute",
                top: "calc(100% + 1px)",
                right: 622,
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
                      index === selectedSuggestionIndex
                        ? "#ccc"
                        : "transparent",
                  }}
                >
                  {suggestion}
                </li>
              ))}
            </ul>
          )}
        </div>

        <div className="filters">
          {/* <Button>
            <NavLink to="/Search?name=Search-QR">Search QR</NavLink>
          </Button>

          <Button>
            <span>render search</span>
          </Button> */}

          {/* <Link to="/SortBy?title=moinhat">
            <Button
              variant="outlined"
              onClick={() => handleSortByChange("latest")}
            >
              Latest
            </Button>
          </Link>
          <Link to="/SortBy?title=phobien">
            <Button
              variant="outlined"
              onClick={() => handleSortByChange("popular")}
              style={{ marginLeft: "8px" }}
            >
              Most Popular
            </Button>
          </Link> */}

          <FormControl
            variant="outlined"
            size="small"
            style={{ minWidth: 150 }}
          >
            <InputLabel> Sort By</InputLabel>
            <Select
              value={sortBy}
              onChange={(e) => handleSortByChange(e.target.value)}
              label="Sort By"

              // onClick={() => navigateToClick()}
            >
              <MenuItem value="latest">Latest</MenuItem>
              <MenuItem value="popular"> Product</MenuItem>
              <MenuItem value="priceAsc">Low to High</MenuItem>
              <MenuItem value="priceDesc"> High to Low</MenuItem>
            </Select>
          </FormControl>

          {/* <Button
          variant="contained"
          color="primary"
          onClick={handleSearch}
          style={{ marginLeft: "8px" }}
        >
          Apply Filters
        </Button> */}
        </div>
        <Button
          style={{ marginLeft: "80%" }}
          onClick={handleAdminProductClick}
          variant="contained"
        >
          Admin Product
        </Button>

        {/* <Button
          style={{ marginLeft: "80%" }}
          onClick={handleAddNewProductClick}
          variant="contained"
        >
          Add new Product
        </Button> */}

        {isLoading ? (
          renderSkeletonLoader()
        ) : (
          <div className="product-list-container">
            {filteredProducts.length > 0 ? (
              filteredProducts.map((product) => (
                <div
                  key={product.id}
                  className="product-item"
                  onClick={() => navigateToDetails(product.title)}
                >
                  <ListComponent
                    product={product}
                    onAddToCart={(quantity) => onAddToCart(product, quantity)}
                  />
                </div>
              ))
            ) : (
              <p>No products found</p>
            )}
          </div>
        )}

        <PaginationComponent
          page={page}
          totalPages={totalPages}
          onPageChange={handlePageChange}
          isLoading={isLoadingPage}
        />
      </div>
    </Router>
  );
}

export default ProductList;
