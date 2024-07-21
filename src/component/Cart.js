import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import Button from "@mui/material/Button";
import DeleteIcon from "@mui/icons-material/Delete";
import "../styles/cart.css";

function Cart({ cartItems, onRemoveFromCart, onQuantityChange }) {
  return (
    <div>
      <h2>Shopping Cart</h2>
      {cartItems.length > 0 ? (
        cartItems.map((item) => (
          <div
            key={item.id}
            style={{
              display: "flex",
              flexDirection: "row",
              gap: 32,
              alignItems: "center",
              border: "1px solid gray",
              padding: 16,
            }}
          >
            <h3>{item.name}</h3>
            <p>Price: {item.price * item.quantity} vnd</p>
            <div>
              <button
                onClick={() =>
                  item.quantity > 1
                    ? onQuantityChange(item.id, item.quantity - 1)
                    : onRemoveFromCart(item.id)
                }
              >
                -
              </button>
              <span>{item.quantity}</span>
              <button
                onClick={() => onQuantityChange(item.id, item.quantity + 1)}
              >
                +
              </button>
            </div>

            <Button
              className="btn-delete"
              variant="outlined"
              startIcon={<DeleteIcon />}
              onClick={() => onRemoveFromCart(item.id)}
              color="error"
            >
              xóa sản phẩm
            </Button>
          </div>
        ))
      ) : (
        <p>Your cart is empty</p>
      )}
      <div style={{ padding: "6px" }}>
        <Button variant="outlined">
          <Link to="/">Back</Link>
        </Button>
      </div>
    </div>
  );
}

export default Cart;
