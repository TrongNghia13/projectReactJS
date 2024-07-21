import React, { useEffect, useState } from "react";
import { useHistory, useParams } from "react-router-dom";
import ProductService from "../services/productService"; // Adjust path if needed
import {
  Typography,
  TextField,
  Button,
  Snackbar,
  Alert,
  Box,
  CircularProgress,
} from "@mui/material";

const EditProduct = () => {
  const { productId } = useParams();
  const [title, setTitle] = useState("");
  const [price, setPrice] = useState("");
  const [description, setDescription] = useState("");
  const [image, setImage] = useState("");
  const [rating, setRating] = useState("");
  const [count, setCount] = useState("");
  const [openSnackbar, setOpenSnackbar] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState("");
  const [snackbarSeverity, setSnackbarSeverity] = useState("success");
  const [product, setProduct] = useState(null);
  const [isLoading, setIsLoading] = useState(true); // Added for loading state
  const history = useHistory();

  const [errors, setErrors] = useState({
    title: false,
    price: false,
    description: false,
    image: false,
    rating: false,
    count: false,
  });

  const handleBlur = (field) => (e) => {
    setErrors({ ...errors, [field]: true });
  };
  const handleCloseSnackbar = () => {
    setOpenSnackbar(false);
  };

  useEffect(() => {
    const fetchProduct = async () => {
      setIsLoading(true); // Set loading state to true
      const fetchedProduct = await ProductService.getById(productId);
      setProduct(fetchedProduct);
      setIsLoading(false); // Set loading state to false
    };
    fetchProduct();
  }, [productId]);

  const handleUpdateProduct = async () => {
    await ProductService.updateProduct(product);
    history.push("/admin/products/list");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const newErrors = {
      title: title === "",
      price: price === "",
      description: description === "",
      image: image === "",
      rating: rating === "",
      count: count === "",
    };

    if (Object.values(newErrors).some((error) => error)) {
      setErrors(newErrors);
      setSnackbarMessage("Please fill out all required fields.");
      setSnackbarSeverity("error");
      setOpenSnackbar(true);
      return;
    }

    const newProduct = {
      title,
      price,
      description,
      image,
      rating: {
        rate: rating,
        count: count,
      },
    };

    try {
      const response = await ProductService.updateProduct(newProduct);
      console.log("check log updateProduct:", response);

      if (response) {
        setSnackbarMessage("Product edited successfully!");
        setSnackbarSeverity("success");
        setOpenSnackbar(true);
        setTitle("");
        setPrice("");
      }
    } catch (error) {
      setSnackbarMessage("Failed to edit product.");
      setSnackbarSeverity("error");
      setOpenSnackbar(true);
    }
  };
  return (
    <Box sx={{ maxWidth: 500, mx: "auto", mt: 4 }}>
      <Typography variant="h4" gutterBottom>
        Edit Product
      </Typography>
      {isLoading ? (
        <CircularProgress />
      ) : (
        <form onSubmit={handleSubmit}>
          <TextField
            label="Title"
            value={title}
            // value={product?.title || ""}
            onChange={(e) => setTitle(e.ta)}
            onBlur={handleBlur("title")}
          />
          <TextField
            label="price"
            value={price}
            onChange={(e) => setPrice(e.target.value)}
            onBlur={handleBlur("price")}
          />
          {/* ... other fields using optional chaining ... */}
          <Button
            onClick={() => handleUpdateProduct}
            variant="contained"
            color="primary"
            type="submit"
            fullWidth
          >
            Edit Product
          </Button>
        </form>
      )}
      <Snackbar
        open={openSnackbar}
        autoHideDuration={6000}
        onClose={handleCloseSnackbar}
      >
        <Alert
          onClose={handleCloseSnackbar}
          severity={snackbarSeverity}
          sx={{ width: "100%" }}
        >
          {snackbarMessage}
        </Alert>
      </Snackbar>
    </Box>
  );
};

export default EditProduct;
