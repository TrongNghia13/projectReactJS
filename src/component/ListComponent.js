import React, { useEffect, useState } from "react";
import { Stack, Snackbar, Alert, Typography } from "@mui/material";
import Button from "@mui/material/Button";
// import AddShoppingCartIcon from "@mui/icons-material/AddShoppingCart";
import "../styles/productList.css";

function ListComponent({ product, onAddToCart }) {
  const MaxAvailable = 10;
  const MinAvailable = 1;

  const [count, setCount] = useState(1);
  const [openSnackbar, setOpenSnackbar] = useState(false);

  function handleIncrease() {
    if (count < MaxAvailable) setCount(count + 1);
  }

  function handleDecrease() {
    if (count > MinAvailable) setCount(count - 1);
  }

  function handleAddToCart(quantity) {
    onAddToCart(quantity);
    setOpenSnackbar(true); // Show the snackbar when an item is added to the cart
  }

  const handleAddToCartClick = () => {
    onAddToCart(product, 1); // Hardcoded quantity 1 for simplicity
  };

  const handleCloseSnackbar = () => {
    setOpenSnackbar(false); // Hide the snackbar
  };

  useEffect(() => {
    console.log("Child: Inside useEffect");

    return () => {
      console.log("Child: Inside useEffect: out");
    };
  }, [count]);

  console.log("Child: After useEffect");

  return (
    <div className="product-item">
      <div className="product-image-container">
        <img
          src={product.image}
          alt={product.title}
          className="products-image"
        />
      </div>

      <h3 className="product-image-home">{product.title}</h3>
      <p className="StylePrice">{product.price}$</p>
      <div className="product-controls">
        <Stack direction="row" spacing={1}>
          {/* <Button
            variant="contained"
            onClick={handleDecrease}
            style={{ minWidth: "10px", maxHeight: "10px" }}
          >
            -
          </Button>
          <input
            type="text"
            value={count}
            onChange={(e) => setCount(Number(e.target.value))}
            style={{ width: "20px", textAlign: "center" }}
          />
          <Button
            variant="contained"
            onClick={handleIncrease}
            style={{ minWidth: "10px", maxHeight: "10px" }}
          >
            +
          </Button> */}

          {/* <div className="btnAddToCart">
            <Button
              variant="contained"
              onClick={() => handleAddToCart(count)}
              startIcon={<AddShoppingCartIcon />}
            >
              Add to Cart
            </Button>
          </div> */}
        </Stack>
        <Snackbar
          open={openSnackbar}
          autoHideDuration={3000}
          onClose={handleCloseSnackbar}
        >
          <Alert onClose={handleCloseSnackbar} severity="success">
            Added to cart successfully!
          </Alert>
        </Snackbar>
      </div>
    </div>
  );
}

export default ListComponent;
