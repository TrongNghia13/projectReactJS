// PaginationComponent.js
import React from "react";
import Typography from "@mui/material/Typography";
import Pagination from "@mui/material/Pagination";
import Stack from "@mui/material/Stack";

function PaginationComponent({ page, totalPages, onPageChange, isLoading }) {
  const handleChange = (event, value) => {
    onPageChange(value);
  };

  return (
    <Stack spacing={2}>
      {isLoading ? (
        <Typography variant="body2" color="blue">
          loading page ...
        </Typography>
      ) : (
        <Pagination count={totalPages} page={page} onChange={handleChange} />
      )}
    </Stack>
  );
}

export default PaginationComponent;
