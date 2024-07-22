import React, { useEffect, useState } from "react";
import { useParams, useHistory } from "react-router-dom";
import ProductService from "../services/productService";
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
  const { productId } = useParams(); // Lấy productId từ URL
  const [title, setTitle] = useState("");
  const [price, setPrice] = useState("");
  const [description, setDescription] = useState("");
  const [image, setImage] = useState("");
  const [rating, setRating] = useState("");
  const [count, setCount] = useState("");
  const [openSnackbar, setOpenSnackbar] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState("");
  const [snackbarSeverity, setSnackbarSeverity] = useState("success");
  const [isLoading, setIsLoading] = useState(true);
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
    setErrors({ ...errors, [field]: e.target.value === "" });
  };

  const handleCloseSnackbar = () => {
    setOpenSnackbar(false);
  };

  useEffect(() => {
    console.log("Product ID:", productId); // Kiểm tra giá trị productId
    if (!productId) {
      console.error("Product ID is missing.");
      return;
    }

    const fetchProduct = async () => {
      setIsLoading(true);
      const fetchedProduct = await ProductService.getById(productId);
      if (fetchedProduct) {
        setTitle(fetchedProduct.title || "");
        setPrice(fetchedProduct.price || "");
        setDescription(fetchedProduct.description || "");
        setImage(fetchedProduct.image || "");
        setRating(fetchedProduct.rating?.rate || "");
        setCount(fetchedProduct.rating?.count || "");
      }
      setIsLoading(false);
    };

    fetchProduct();
  }, [productId]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!productId) {
      setSnackbarMessage("Product ID is missing.");
      setSnackbarSeverity("error");
      setOpenSnackbar(true);
      return;
    }

    const updatedProduct = {
      id: productId,
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
      const response = await ProductService.updateProduct(updatedProduct);
      if (response) {
        setSnackbarMessage("Product edited successfully!");
        setSnackbarSeverity("success");
        setOpenSnackbar(true);
        setTimeout(() => {
          history.push("/admin/product");
        }, 1500);
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
            onChange={(e) => setTitle(e.target.value)}
            onBlur={handleBlur("title")}
            error={errors.title}
            helperText={errors.title && "Title is required"}
            fullWidth
            margin="normal"
          />
          <TextField
            label="Price"
            value={price}
            onChange={(e) => setPrice(e.target.value)}
            onBlur={handleBlur("price")}
            error={errors.price}
            helperText={errors.price && "Price is required"}
            fullWidth
            margin="normal"
          />
          <TextField
            label="Description"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            onBlur={handleBlur("description")}
            error={errors.description}
            helperText={errors.description && "Description is required"}
            fullWidth
            margin="normal"
          />
          <TextField
            label="Image URL"
            value={image}
            onChange={(e) => setImage(e.target.value)}
            onBlur={handleBlur("image")}
            error={errors.image}
            helperText={errors.image && "Image URL is required"}
            fullWidth
            margin="normal"
          />
          <TextField
            label="Rating"
            value={rating}
            onChange={(e) => setRating(e.target.value)}
            onBlur={handleBlur("rating")}
            error={errors.rating}
            helperText={errors.rating && "Rating is required"}
            fullWidth
            margin="normal"
          />
          <TextField
            label="Count"
            value={count}
            onChange={(e) => setCount(e.target.value)}
            onBlur={handleBlur("count")}
            error={errors.count}
            helperText={errors.count && "Count is required"}
            fullWidth
            margin="normal"
          />
          <Button
            variant="contained"
            color="primary"
            type="submit"
            fullWidth
            sx={{ mt: 2 }}
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
