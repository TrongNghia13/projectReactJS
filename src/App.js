import AddShoppingCartIcon from "@mui/icons-material/AddShoppingCart";
import React, { useEffect, useState, useRef } from "react";
import {
  Link,
  Route,
  BrowserRouter as Router,
  Switch,
  useHistory,
} from "react-router-dom";
import AddProductItem from "./component/AddProductItem";
import Cart from "./component/Cart";
import ProductDetails from "./component/ProductDetails";
import AdminProductList from "./component/AdminProductList";
import ProductList from "./component/ProductList";
import SearchIcon from "@mui/icons-material/Search";
import { Button } from "@mui/material";
import HomePage from "./page/HomePage";
import ProductService from "./services/productService";
import EditProduct from "./component/EditProduct";

function App() {
  // const [products, setProducts] = useState([]);

  const [cartItems, setCartItems] = useState([]);
  const [badgeVisibilityThreshold] = useState(10);
  const [products, setProducts] = useState();

  useEffect(() => {
    localStorage.setItem("cartItems", JSON.stringify(cartItems));
    console.log("Saving to localStorage:", cartItems);
  }, [cartItems]);

  // useEffect(() => {
  //   const filteredProducts = products.filter((product) => product !== null);
  //   localStorage.setItem("products", JSON.stringify(filteredProducts));
  //   console.log("Saving to localStorage:", filteredProducts);
  // }, [products]);

  const handleAddToCart = (product, quantity) => {
    const existingItem = cartItems.find((item) => item.id === product.id);
    if (existingItem) {
      const updatedCartItems = cartItems.map((item) =>
        item.id === product.id
          ? { ...item, quantity: item.quantity + quantity }
          : item
      );
      setCartItems(updatedCartItems);
      console.log("Updated cartItems:", updatedCartItems);
    } else {
      const newCartItems = [...cartItems, { ...product, quantity: quantity }];
      setCartItems(newCartItems);
      console.log("New cartItems:", newCartItems);
    }
  };

  const handleRemoveFromCart = (productId) => {
    const updatedCartItems = cartItems.filter((item) => item.id !== productId);
    setCartItems(updatedCartItems);
    console.log("Updated cartItems after removal:", updatedCartItems);
  };

  const handleQuantityChange = (productId, quantity) => {
    if (quantity === 0) {
      handleRemoveFromCart(productId);
    } else {
      const updatedCartItems = cartItems.map((item) =>
        item.id === productId ? { ...item, quantity: quantity } : item
      );
      setCartItems(updatedCartItems);
      console.log("Updated cartItems after quantity change:", updatedCartItems);
    }
  };

  const getTotalQuantity = () => {
    return cartItems.reduce((sum, item) => sum + item.quantity, 0);
  };

  return (
    <Router>
      <nav
        style={{
          display: "flex",
          justifyContent: "space-between",
          padding: "1rem",
        }}
      >
        <Link to="/">Home</Link>
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

        <Link to="/cart">
          <div>
            <AddShoppingCartIcon />
          </div>
          <div>
            {cartItems.length === 0 ? null : (
              <div
                className="addIconsCart"
                style={{
                  color: "black",
                  position: "absolute",
                  background: "lightsteelblue",
                  padding: "5px",
                  right: "6px",
                  top: "2px",
                  fontSize: "10px",
                  borderRadius: "50%",
                  minHeight: "10px",
                  minWidth: "10px",
                  textAlign: "center",
                }}
              >
                {getTotalQuantity()}
              </div>
            )}
            {getTotalQuantity() > 0 &&
            getTotalQuantity() >= badgeVisibilityThreshold ? (
              <div
                className="addIconsCart"
                style={{
                  color: "black",
                  position: "absolute",
                  background: "lightsteelblue",
                  padding: "5px",
                  right: "6px",
                  top: "2px",
                  fontSize: "10px",
                  borderRadius: "50%",
                  minHeight: "10px",
                  minWidth: "10px",
                  textAlign: "center",
                }}
              >
                10
                <text>+</text>
              </div>
            ) : null}
          </div>
        </Link>
      </nav>

      <Switch>
        <Route exact path="/">
          <ProductList onAddToCart={handleAddToCart} />
        </Route>
        <Route path="/product/:title">
          <ProductDetails onAddToCart={handleAddToCart} />
        </Route>
        <Route path="/cart">
          <Cart
            cartItems={cartItems}
            onRemoveFromCart={handleRemoveFromCart}
            onQuantityChange={handleQuantityChange}
          />
        </Route>

        <Route path="/admin/product/edit/">
          <EditProduct />
        </Route>
        <Route path="/admin/product/create">
          <AddProductItem />
        </Route>
        <Route path="/admin/product/">
          <AdminProductList />
        </Route>
      </Switch>
    </Router>
  );
}

export default App;
