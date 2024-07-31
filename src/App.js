import AddShoppingCartIcon from "@mui/icons-material/AddShoppingCart";
import React, { useEffect, useState } from "react";
import { Link, Route, BrowserRouter as Router, Switch } from "react-router-dom";
import AddProductItem from "./component/AddProductItem";
import Cart from "./component/Cart";
import ProductDetails from "./component/ProductDetails";
import AdminProductList from "./component/AdminProductList";
import ProductList from "./component/ProductList";
import EditProduct from "./component/EditProduct";
import SearchBar from "./component/SearchBar";
import { Tab } from "@mui/material";
import "../src/styles/cart.css";
import "./styles/tabBar.css";

function App() {
  const [cartItems, setCartItems] = useState(() => {
    const storedCartItems = localStorage.getItem("cartItems");
    return storedCartItems ? JSON.parse(storedCartItems) : [];
  });

  const badgeVisibilityThreshold = 10;

  useEffect(() => {
    localStorage.setItem("cartItems", JSON.stringify(cartItems));
    console.log("Saving to localStorage:", cartItems);
  }, [cartItems]);

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
      const newCartItems = [...cartItems, { ...product, quantity }];
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
        item.id === productId ? { ...item, quantity } : item
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
        className="tarBar"
        style={{
          display: "flex",
          justifyContent: "space-between",
          padding: "1rem",
          borderBottom: "1px solid",
        }}
      >
        <Tab
          style={{ color: "white", fontSize: "20px" }}
          label="Home"
          value="/"
          to="/"
          component={Link}
        />
        <div style={{ paddingTop: "1%", paddingRight: "2%" }}>
          <SearchBar />
        </div>
        <div className="cart" style={{ paddingTop: "2%", fontSize: "20px" }}>
          <Link to="/cart">
            <div
              style={{
                color: "whitesmoke",
                paddingRight: "5px",
                marginBottom: "15px",
              }}
            >
              <AddShoppingCartIcon style={{ marginBottom: "8px" }} />
            </div>
            <div>
              {getTotalQuantity() > 0 && (
                <div
                  className="iconsCart"
                  style={{
                    position: "absolute",
                    background: "lightsteelblue",
                    padding: "5px",
                    right: "8px",
                    top: "30px",
                    fontSize: "10px",
                    borderRadius: "50%",
                    minHeight: "10px",
                    minWidth: "10px",
                    textAlign: "center",
                  }}
                >
                  {getTotalQuantity() >= badgeVisibilityThreshold ? (
                    <>
                      10<sup>+</sup>
                    </>
                  ) : (
                    getTotalQuantity()
                  )}
                </div>
              )}
            </div>
          </Link>
        </div>
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
        <Route path="/edit-product/:productId" component={EditProduct} />
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
