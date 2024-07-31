import React, { useEffect, useState } from "react";
import { useParams, useHistory } from "react-router-dom";
import ProductService from "../services/productService";
import CategoryService from "../services/CategoryService";
import {
  Typography,
  TextField,
  Button,
  Snackbar,
  Alert,
  Box,
  CircularProgress,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
} from "@mui/material";
import InputLabel from "@mui/material/InputLabel";
import MenuItem from "@mui/material/MenuItem";
import FormControl from "@mui/material/FormControl";
import Select, { SelectChangeEvent } from "@mui/material/Select";

const EditProduct = () => {
  const { productId } = useParams();
  const numericProductId = Number(productId);
  const [categories, setCategories] = useState([]);
  const [title, setTitle] = useState("");
  const [price, setPrice] = useState("");
  const [description, setDescription] = useState("");
  const [image, setImage] = useState("");
  const [rating, setRating] = useState("");
  const [count, setCount] = useState("");
  const [selectedCategory, setSelectedCategory] = useState(""); // Khởi tạo chuỗi rỗng
  const [openSnackbar, setOpenSnackbar] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState("");
  const [snackbarSeverity, setSnackbarSeverity] = useState("success");
  const [open, setOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const history = useHistory();

  const [errors, setErrors] = useState({
    title: false,
    price: false,
    description: false,
    image: false,
    rating: false,
    count: false,
    category: false,
  });

  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  const handleBlur = (field) => (e) => {
    setErrors({ ...errors, [field]: e.target.value === "" });
  };

  const handleCloseSnackbar = () => {
    setOpenSnackbar(false);
  };

  // Fetch categories
  useEffect(() => {
    const fetchCategories = async () => {
      try {
        console.log("Fetching categories...");
        const response = await CategoryService.getAll();
        setCategories(response);
      } catch (error) {
        console.error("Error fetching categories:", error);
        setSnackbarMessage(`Failed to fetch categories: ${error.message}`);
        setSnackbarSeverity("error");
        setOpenSnackbar(true);
      }
    };
    fetchCategories();
  }, []);

  // Fetch product and update category when categories are ready
  useEffect(() => {
    if (!numericProductId || categories.length === 0) {
      return;
    }

    const fetchProduct = async () => {
      setIsLoading(true);
      try {
        const fetchedProduct = await ProductService.getById(numericProductId);
        console.log("Fetched Product:", fetchedProduct); // Debugging
        console.log("Available Categories:", categories); // Debugging

        if (fetchedProduct) {
          setTitle(fetchedProduct.title || "");
          setPrice(fetchedProduct.price || "");
          setDescription(fetchedProduct.description || "");
          setImage(fetchedProduct.image || "");
          setRating(fetchedProduct.rating?.rate || "");
          setCount(fetchedProduct.rating?.count || "");

          // Check if category exists in fetched categories
          const category = categories.find(
            (cat) => cat.id === fetchedProduct.category
          );
          if (category) {
            setSelectedCategory(category.id);
          } else {
            console.error(
              "Category ID not found in fetched categories:",
              fetchedProduct.category
            );
            setSnackbarMessage("Category not found.");
            setSnackbarSeverity("error");
            setOpenSnackbar(true);
          }
        } else {
          setSnackbarMessage("Product not found.");
          setSnackbarSeverity("error");
          setOpenSnackbar(true);
        }
      } catch (error) {
        setSnackbarMessage("Failed to fetch product.");
        setSnackbarSeverity("error");
        setOpenSnackbar(true);
      } finally {
        setIsLoading(false);
      }
    };

    fetchProduct();
  }, [numericProductId, categories]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    const newErrors = {
      title: title.trim() === "",
      price: price.trim() === "",
      description: description.trim() === "",
      image: image.trim() === "",
      rating: rating.trim() === "",
      count: count.trim() === "",
      category: selectedCategory.trim() === "",
    };

    if (Object.values(newErrors).some((error) => error)) {
      setErrors(newErrors);
      setSnackbarMessage("Please fill out all fields.");
      setSnackbarSeverity("error");
      setOpenSnackbar(true);
      return;
    }

    if (!numericProductId) {
      setSnackbarMessage("Product ID is missing.");
      setSnackbarSeverity("error");
      setOpenSnackbar(true);
      return;
    }

    const updatedProduct = {
      id: numericProductId,
      title,
      price,
      description,
      image,
      rating: {
        rate: rating,
        count: count,
      },
      categoryId: selectedCategory, // Use selectedCategory for the API
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
      } else {
        setSnackbarMessage("Product update failed.");
        setSnackbarSeverity("error");
        setOpenSnackbar(true);
      }
    } catch (error) {
      setSnackbarMessage("Failed to edit product.");
      setSnackbarSeverity("error");
      setOpenSnackbar(true);
    }
  };

  const handleBackAdminProduct = () => {
    history.push("/admin/product");
  };

  const handleChangeCategory = (event: SelectChangeEvent<string>) => {
    setSelectedCategory(event.target.value);
    // setErrors({ ...errors, category: false }); // Clear category error on change
  };

  return (
    <>
      <Button
        style={{
          marginLeft: "76%",
          marginTop: "2%",
          background: "gray",
          maxWidth: "20px",
          backgroundColor: "cornflowerblue",
        }}
        variant="contained"
        onClick={handleClickOpen}
      >
        Back
      </Button>
      <Dialog
        open={Boolean(open)}
        onClose={handleClose}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
      >
        <DialogTitle id="alert-dialog-title">{"Delete Product?"}</DialogTitle>
        <DialogContent>
          <DialogContentText id="alert-dialog-description">
            You haven't saved your edits, are you sure you want to go back?
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose}>Cancel</Button>
          <Button onClick={handleBackAdminProduct}>Yes</Button>
        </DialogActions>
      </Dialog>
      <Box sx={{ maxWidth: 400, mx: "auto", mb: 9 }}>
        <Typography variant="h4" gutterBottom>
          Edit Product
        </Typography>
        {isLoading ? (
          <CircularProgress />
        ) : (
          <form onSubmit={handleSubmit}>
            <FormControl fullWidth margin="normal">
              <InputLabel id="category-select-label">Category</InputLabel>
              <Select
                labelId="category-select-label"
                id="category-select"
                value={selectedCategory}
                label="Category"
                onChange={handleChangeCategory}
              >
                {categories.map((cat) => (
                  <MenuItem key={cat.id} value={cat.id}>
                    {cat.category}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
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
            <Button type="submit" variant="contained" color="primary">
              Save Changes
            </Button>
          </form>
        )}
      </Box>

      {/* Snackbar for Error and Success Messages */}
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
    </>
  );
};

export default EditProduct;
