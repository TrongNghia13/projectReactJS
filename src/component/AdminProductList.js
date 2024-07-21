import React, { useEffect, useState } from "react";
import { Link, useHistory } from "react-router-dom";
import ProductService from "../services/productService"; // Điều chỉnh đường dẫn nếu cần
import DeleteIcon from "@mui/icons-material/Delete";
import EditCalendarIcon from "@mui/icons-material/EditCalendar";
import AddIcon from "@mui/icons-material/Add";
import {
  Typography,
  TextField,
  Button,
  Snackbar,
  Alert,
  Box,
} from "@mui/material";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogContentText from "@mui/material/DialogContentText";
import DialogTitle from "@mui/material/DialogTitle";

import "../styles/adminProductList.css";

const AdminProductList = ({ handleSearch }) => {
  const [products, setProducts] = useState([]);
  const [openSnackbar, setOpenSnackbar] = useState();
  const history = useHistory();
  const [selectedProductId, setSelectedProductId] = useState(undefined);

  const handleClickOpen = (pid) => {
    setSelectedProductId(pid);
  };
  const handleClose = () => {
    setSelectedProductId(undefined);
  };

  useEffect(() => {
    const fetchProducts = async () => {
      const fetchedProducts = await ProductService.getPaged({
        limit: 100,
        offset: 0,
      }); // Điều chỉnh limit và offset nếu cần
      setProducts(fetchedProducts);
      console.log("check:", fetchedProducts);
    };
    fetchProducts();
  }, []);

  const handleDelete = async (productId) => {
    await ProductService.deleteProduct(productId);
    setProducts(products.filter((product) => product.id !== productId));
    setSelectedProductId(false);
  };
  const handleGoToClientProduct = () => {
    history.push("/");
  };
  const handleAddNewProduct = () => {
    history.push("/admin/product/create");
  };

  const handleEditProduct = (product) => {
    history.push(`/admin/product/edit/`);
  };

  return (
    <div>
      <Button
        style={{ marginLeft: "80%" }}
        onClick={handleGoToClientProduct}
        variant="contained"
      >
        go to client
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
                  onClick={handleEditProduct}
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
            open={selectedProductId}
            onClose={handleClose}
            aria-labelledby="alert-dialog-title"
            aria-describedby="alert-dialog-description"
          >
            <DialogTitle id="alert-dialog-title">{"xoa san pham?"}</DialogTitle>
            <DialogContent>
              <DialogContentText id="alert-dialog-description">
                ban co chac chan thay doi nay?
              </DialogContentText>
            </DialogContent>
            <DialogActions>
              <Button onClick={handleClose}>khong </Button>
              <Button onClick={() => handleDelete(selectedProductId)}>
                dong y
              </Button>
            </DialogActions>
          </Dialog>
        </Box>
      </div>
    </div>
  );
};

export default AdminProductList;
