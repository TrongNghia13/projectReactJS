import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import {
  Typography,
  Button,
  TextField,
  Skeleton,
  Box,
  Grid,
} from "@mui/material";
import "../styles/productDetails.css";
import Cart from "./Cart";
import helper from "../helper";

import ProductService from "../services/productService";

function ProductDetails({ onAddToCart, generateSlug }) {
  const { title } = useParams();
  const [product, setProduct] = useState(null);
  const [quantity, setQuantity] = useState(1);
  const [isLoading, setIsLoading] = useState(true);

  const fetchProduct = async (title) => {
    try {
      // const response = await fetch("https://fakestoreapi.com/products");
      // const products = await response.json();
      // const product = products.find(
      //   (product) =>
      //     product.title.toLowerCase().replace(/ /g, "-") === title.toLowerCase()
      // );
      const response = await ProductService.getByTitle(title);
      const product = response.ProductService;

      setProduct(response);
      setIsLoading(false);
    } catch (error) {
      console.error("Error fetching product:", error);
      setIsLoading(false);
    }
  };

  // const fetchProduct = async (title) => {
  //   try {
  //     const response = await fetch("https://fakestoreapi.com/products");
  //     const products = await response.json();
  //     const product = products.find(
  //       (product) =>
  //         product.title.toLowerCase().replace(/ /g, "-") === title.toLowerCase()
  //     );
  //     setProduct(product);
  // setProduct(product);
  // setIsLoading(false);
  //   } catch (error) {
  //     console.error("Error fetching product:", error);
  //     setIsLoading(false);
  //   }
  // };

  useEffect(() => {
    if (title) {
      fetchProduct(title);
    }
  }, [title]);

  const handleAddToCart = () => {
    if (product) {
      onAddToCart(product, quantity);
      alert(`${quantity} ${product.title}(s) added to cart`);
    }
  };

  return (
    <div className="product-details-container">
      {isLoading ? (
        <Box sx={{ width: "100%" }}>
          <Skeleton variant="text" width="60%" height={40} />
          <Skeleton variant="rectangular" width="100%" height={300} />
          <Box sx={{ mt: 2 }}>
            <Skeleton variant="text" width="40%" height={30} />
            <Skeleton variant="text" width="20%" height={30} />
            <Skeleton variant="text" width="80%" height={20} />
            <Skeleton variant="text" width="80%" height={20} />
            <Skeleton variant="text" width="80%" height={20} />
            <Skeleton
              variant="rectangular"
              width="80px"
              height={40}
              sx={{ mt: 2 }}
            />
          </Box>
        </Box>
      ) : product ? (
        <>
          <Typography variant="h4" gutterBottom className="Product-Name">
            {product.title}
          </Typography>
          <img
            src={product.image}
            alt={product.title}
            className="product-image-home-details"
          />
          <div className="styleDetails">
            <Typography
              className="product-details"
              variant="body1"
              gutterBottom
            >
              Price: ${product.price}
            </Typography>
            <Typography variant="body1" gutterBottom>
              Rating: {product.rating.rate} ({product.rating.count} reviews)
            </Typography>
            <Typography variant="body2" gutterBottom>
              Description: {product.description}
            </Typography>
            <TextField
              label="Quantity"
              type="number"
              value={quantity}
              onChange={(e) => setQuantity(e.target.value)}
              inputProps={{ min: 1 }}
              style={{ marginRight: "16px", width: "80px" }}
            />
            <Button
              variant="contained"
              color="primary"
              onClick={handleAddToCart}
            >
              Add to Cart
            </Button>
          </div>
        </>
      ) : (
        <p>Product not found</p>
      )}
    </div>
  );
}

export default ProductDetails;
