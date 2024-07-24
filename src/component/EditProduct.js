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
  const [selectedCategory, setSelectedCategory] = useState("undefined");
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
      const response = await CategoryService.getAll();
      setCategories(response);
    };
    fetchCategories();
  }, []);

  // Fetch product and update category when categories are ready
  useEffect(() => {
    if (!numericProductId) {
      console.error("Product ID is missing.");
      return;
    }

    const fetchProduct = async () => {
      setIsLoading(true);
      try {
        const fetchedProduct = await ProductService.getById(numericProductId);
        if (fetchedProduct) {
          setTitle(fetchedProduct.title || "");
          setPrice(fetchedProduct.price || "");
          setDescription(fetchedProduct.description || "");
          setImage(fetchedProduct.image || "");
          setRating(fetchedProduct.rating?.rate || "");
          setCount(fetchedProduct.rating?.count || "");

          if (categories.length > 0) {
            const category = categories.find(
              (cat) => cat.id === fetchedProduct.categoryId
            );
            if (category) {
              setSelectedCategory(category.id);
            }
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

    if (categories.length > 0) {
      fetchProduct();
    }
  }, [numericProductId, categories]);

  const handleSubmit = async (e) => {
    e.preventDefault();

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

  const handleChangeCategory = (event: SelectChangeEvent) => {
    setSelectedCategory(event.target.value);
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
            <FormControl fullWidth>
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
    </>
  );
};

export default EditProduct;
