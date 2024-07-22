import React, { useEffect, useState } from "react";
import { useHistory, useLocation } from "react-router-dom";
import ProductService from "../services/productService";
import DeleteIcon from "@mui/icons-material/Delete";
import EditCalendarIcon from "@mui/icons-material/EditCalendar";
import AddIcon from "@mui/icons-material/Add";
import {
  Typography,
  Button,
  Box,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
} from "@mui/material";

import "../styles/adminProductList.css";

const AdminProductList = () => {
  const [products, setProducts] = useState([]);
  const history = useHistory();
  const location = useLocation();
  const [selectedProductId, setSelectedProductId] = useState(undefined);

  const handleClickOpen = (pid) => {
    setSelectedProductId(pid);
  };

  const handleClose = () => {
    setSelectedProductId(undefined);
  };

  const fetchProducts = async () => {
    const fetchedProducts = await ProductService.getPaged({
      limit: 100,
      offset: 0,
    });
    setProducts(fetchedProducts);
  };

  useEffect(() => {
    fetchProducts();
    const unlisten = history.listen(() => {
      fetchProducts(); // Call fetchProducts on location change
    });
    return () => {
      unlisten();
    };
  }, [history]); // Dependency array includes history

  const handleDelete = async (productId) => {
    await ProductService.deleteProduct(productId);
    fetchProducts(); // Refresh products after deletion
    setSelectedProductId(undefined);
  };

  const handleGoToClientProduct = () => {
    history.push("/");
  };

  const handleAddNewProduct = () => {
    history.push("/admin/product/create");
  };

  const handleEditProduct = async (productId) => {
    history.push(`/edit-product/${productId}`);
  };

  return (
    <div>
      <Button
        style={{ marginLeft: "76%", marginTop: "2%" }}
        onClick={handleGoToClientProduct}
        variant="contained"
      >
        Go to Client
      </Button>
      <div className="formAdminProduct">
        <Typography variant="h4" gutterBottom>
          Admin Product List
        </Typography>
        <Box sx={{ width: "100%" }}>
          {products.map((product) => (
            <div key={product.id}>
              <div className="btnProduct">
                <Button
                  className="btnAdd"
                  onClick={handleAddNewProduct}
                  variant="contained"
                  color="success"
                  startIcon={<AddIcon />}
                >
                  Add
                </Button>

                <Button
                  className="btnEdit"
                  onClick={() => handleEditProduct(product.id)}
                  variant="contained"
                  startIcon={<EditCalendarIcon />}
                >
                  Edit
                </Button>

                <Button
                  onClick={() => handleClickOpen(product.id)}
                  variant="contained"
                  startIcon={<DeleteIcon />}
                  color="error"
                >
                  Delete
                </Button>
              </div>
              <div className="btnAdminProduct">
                {product.title} - ${product.price}
              </div>
            </div>
          ))}
          <Dialog
            open={Boolean(selectedProductId)}
            onClose={handleClose}
            aria-labelledby="alert-dialog-title"
            aria-describedby="alert-dialog-description"
          >
            <DialogTitle id="alert-dialog-title">
              {"Delete Product?"}
            </DialogTitle>
            <DialogContent>
              <DialogContentText id="alert-dialog-description">
                Are you sure you want to delete this product?
              </DialogContentText>
            </DialogContent>
            <DialogActions>
              <Button onClick={handleClose}>Cancel</Button>
              <Button onClick={() => handleDelete(selectedProductId)}>
                Confirm
              </Button>
            </DialogActions>
          </Dialog>
        </Box>
      </div>
    </div>
  );
};

export default AdminProductList;
