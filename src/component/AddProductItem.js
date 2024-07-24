import React, { useState } from "react";
import { useHistory, useLocation } from "react-router-dom";
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
import ProductService from "../services/productService";
import CategoryService from "../services/CategoryService";

function AddProductItem() {
  const [title, setTitle] = useState("");
  const [price, setPrice] = useState("");
  const [description, setDescription] = useState("");
  const [image, setImage] = useState("");
  const [rating, setRating] = useState("");
  const [count, setCount] = useState("");
  const [openSnackbar, setOpenSnackbar] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState("");
  const [snackbarSeverity, setSnackbarSeverity] = useState("success");
  const [open, setOpen] = useState(false);
  const history = useHistory();

  const [errors, setErrors] = useState({
    title: false,
    price: false,
    description: false,
    image: false,
    rating: false,
    count: false,
  });
  const handleClickOpen = () => {
    setOpen(true);
  };
  const handleClose = () => {
    setOpen(false);
  };

  const handleBlur = (field) => (e) => {
    setErrors({ ...errors, [field]: true });
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
      setSnackbarMessage("Please fill out all fields.");
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
      // const response = await fetch("https://fakestoreapi.com/products", {
      //   method: "POST",
      //   headers: {
      //     "Content-Type": "application/json",
      //   },
      //   body: JSON.stringify(newProduct),
      // });
      const response = await ProductService.create(newProduct);

      if (response) {
        setSnackbarMessage("Product added successfully!");
        setSnackbarSeverity("success");
        setTimeout(() => {
          history.push("/admin/product");
        }, 1500);
      }
    } catch (error) {
      setSnackbarMessage("Failed to add product.");
      setSnackbarSeverity("error");
    }
    setOpenSnackbar(true);
  };
  const handleCloseSnackbar = () => {
    setOpenSnackbar(false);
  };
  const handleBackAdminProduct = () => {
    history.push("/admin/product");
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
          <Button onClick={() => handleBackAdminProduct(open)}>yes</Button>
        </DialogActions>
      </Dialog>
      <Box sx={{ maxWidth: 400, maxHeight: 350, mx: "auto", mb: 9 }}>
        <Typography variant="h4" gutterBottom>
          Add New Product
        </Typography>
        <form onSubmit={handleSubmit}>
          <TextField
            label="Title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            onBlur={handleBlur("title")}
            fullWidth
            margin="normal"
            autoComplete="off"
            error={errors.title && title === ""}
            helperText={errors.title && title === "" ? "Title is required" : ""}
          />
          <TextField
            label="Price"
            value={price}
            onChange={(e) => setPrice(e.target.value)}
            onBlur={handleBlur("price")}
            type="number"
            fullWidth
            margin="normal"
            autoComplete="off"
            error={errors.price && price === ""}
            helperText={errors.price && price === "" ? "Price is required" : ""}
          />
          <TextField
            label="Description"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            onBlur={handleBlur("description")}
            fullWidth
            margin="normal"
            autoComplete="off"
            error={errors.description && description === ""}
            helperText={
              errors.description && description === ""
                ? "Description is required"
                : ""
            }
          />
          <TextField
            label="Image URL"
            value={image}
            onChange={(e) => setImage(e.target.value)}
            onBlur={handleBlur("image")}
            fullWidth
            margin="normal"
            autoComplete="off"
            error={errors.image && image === ""}
            helperText={
              errors.image && image === "" ? "Image URL is required" : ""
            }
          />
          <TextField
            label="Rating"
            value={rating}
            onChange={(e) => setRating(e.target.value)}
            onBlur={handleBlur("rating")}
            type="number"
            fullWidth
            margin="normal"
            autoComplete="off"
            error={errors.rating && rating === ""}
            helperText={
              errors.rating && rating === "" ? "Rating is required" : ""
            }
          />
          <TextField
            label="Review Count"
            value={count}
            onChange={(e) => setCount(e.target.value)}
            onBlur={handleBlur("count")}
            type="number"
            fullWidth
            margin="normal"
            autoComplete="off"
            error={errors.count && count === ""}
            helperText={
              errors.count && count === "" ? "Review Count is required" : ""
            }
          />
          <Button variant="contained" color="primary" type="submit" fullWidth>
            Add Product
          </Button>
        </form>
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
}

export default AddProductItem;
