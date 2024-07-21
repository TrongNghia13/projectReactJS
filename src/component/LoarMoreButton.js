// LoadMoreButton.js
import React from "react";
import Button from "@mui/material/Button";

function LoadMoreButton({ onLoadMore, isLoadMore }) {
  return (
    <>
      {isLoadMore ? (
        <div>Loading more...</div>
      ) : (
        <Button
          variant="contained"
          color="primary"
          onClick={onLoadMore}
          style={{ marginTop: "16px" }}
        >
          LOAD MORE
        </Button>
      )}
    </>
  );
}

export default LoadMoreButton;
