// export const getProducts = async (searchText, minPrice, maxPrice, page) => {
//   const apiUrl = `https://fakestoreapi.com/products?limit=6&page=${page}`;
//   try {
//     const response = await fetch(apiUrl);
//     const data = await response.json();
//     let filteredData = data;

//     if (searchText) {
//       filteredData = filteredData.filter((product) =>
//         product.title.toLowerCase().includes(searchText.toLowerCase())
//       );
//     }

//     if (minPrice && maxPrice) {
//       filteredData = filteredData.filter(
//         (product) => product.price >= minPrice && product.price <= maxPrice
//       );
//     }

//     const total = filteredData.length;
//     const startIndex = (page - 1) * 6;
//     const slicedData = filteredData.slice(startIndex, startIndex + 6);

//     return { products: slicedData, total };
//   } catch (error) {
//     console.error("Error fetching products:", error);
//     return { products: [], total: 0 };
//   }
// };
