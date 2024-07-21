import React, { useState } from "react";
import { useHistory } from "react-router-dom"; // Sử dụng useHistory thay vì useNavigate
import { Button, TextField } from "@mui/material";
import ProductService from "../services/productService";

const CreateProduct = () => {
  const [product, setProduct] = useState({ title: "", price: "" });
  const history = useHistory(); // Sử dụng useHistory

  const handleCreate = () => {
    ProductService.create(product).then(() => {
      history.push("/admin/products/list");
    });
  };

  return (
    <div>
      {/* <TextField
        label="Title"
        value={product.title}
        onChange={(e) => setProduct({ ...product, title: e.target.value })}
      />
      <TextField
        label="Price"
        value={product.price}
        onChange={(e) => setProduct({ ...product, price: e.target.value })}
      /> */}
      <Button onClick={handleCreate}>Create</Button>
    </div>
  );
};

export default CreateProduct;
