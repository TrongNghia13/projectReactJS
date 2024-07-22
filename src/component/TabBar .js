// import React from "react";
// import { Link, useLocation } from "react-router-dom";
// import { Tabs, Tab, Box } from "@mui/material";
// import ShoppingCartIcon from "@mui/icons-material/ShoppingCart";
// import App from "../App";
// import Cart from "./Cart";

// function TabBar({ cartItems, getTotalQuantity, badgeVisibilityThreshold }) {
//   const location = useLocation();

//   return (
//     <Box sx={{ borderBottom: 1, borderColor: "divider" }}>
//       <Tabs value={location.pathname}>
//         <Tab label="Home" value="/" to="/" component={Link} />
//         <Tab
//           value="/cart"
//           to="/cart"
//           component={Link}
//           icon={<ShoppingCartIcon />}
//           iconPosition="start"
//           LinkComponent={<getTotalQuantity />}
//         />
//       </Tabs>
//     </Box>
//   );
// }

// export default TabBar;
