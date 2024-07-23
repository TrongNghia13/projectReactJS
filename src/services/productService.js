import data from "../MOCK_DATA.json";

const PRODUCT_LOCAL_STORAGE_KEY = "products";
const storage = localStorage;

// Helper functions
const getStorageData = (key, defaultValue) => {
  const jsonStringData = storage.getItem(key);
  const parseStringData = jsonStringData
    ? JSON.parse(jsonStringData)
    : defaultValue;

  return parseStringData;
};

const setStorageData = (key, value) => {
  const jsonStringValue = JSON.stringify(value);
  storage.setItem(key, jsonStringValue);
};

const ProductService = {
  initProductIntoBrowserStorage: () => {
    const products = getStorageData(PRODUCT_LOCAL_STORAGE_KEY, []);
    if (products === null || products.length === 0) {
      setStorageData(PRODUCT_LOCAL_STORAGE_KEY, data);
    }
    return;
  },

  getPaged: async ({ limit, offset }) => {
    const products = getStorageData(PRODUCT_LOCAL_STORAGE_KEY, []);
    if (
      limit === undefined ||
      offset === undefined ||
      limit === 0 ||
      offset === 0
    ) {
      return new Promise((resolve) => {
        setTimeout(() => {
          resolve(products);
        }, 500);
      });
    }
    const pagedProducts = products.slice(offset, offset + limit);
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve(pagedProducts);
      }, 500);
    });
  },

  getProducts: async () => {
    const products = getStorageData(PRODUCT_LOCAL_STORAGE_KEY, []);
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve(products);
      }, 500);
    });
  },

  getById: async (id) => {
    const products = getStorageData(PRODUCT_LOCAL_STORAGE_KEY, []);
    console.log("Products in storage:", products); // Kiểm tra tất cả sản phẩm trong localStorage

    // Đảm bảo id là số để so sánh chính xác
    const numericId = Number(id);
    const product = products.find((product) => product.id === numericId);

    console.log("Found Product:", product); // Kiểm tra sản phẩm tìm thấy
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve(product);
      }, 500);
    });
  },

  getByTitle: async (title) => {
    const products = getStorageData(PRODUCT_LOCAL_STORAGE_KEY, []);
    const product = products.find(
      (product) =>
        typeof product.title === "string" &&
        product.title
          .toLowerCase()
          .replace(/ /g, "-")
          .replace(/[^\w-]+/g, "'") === title.toLowerCase()
    );

    return new Promise((resolve) => {
      setTimeout(() => {
        resolve(product);
      }, 500);
    });
  },

  create: async (newProduct) => {
    const newProductData = {
      ...newProduct,
      id: Date.now(), // Tạo ID mới cho sản phẩm
    };

    const products = getStorageData(PRODUCT_LOCAL_STORAGE_KEY, []);
    const newProducts = [newProductData, ...products]; // Thêm sản phẩm mới vào đầu danh sách

    setStorageData(PRODUCT_LOCAL_STORAGE_KEY, newProducts);

    return new Promise((resolve) => {
      setTimeout(() => {
        resolve(newProductData);
      }, 500);
    });
  },

  deleteProduct: async (productId) => {
    const products = getStorageData(PRODUCT_LOCAL_STORAGE_KEY, []);
    const updatedProducts = products.filter(
      (product) => product.id !== productId
    );
    setStorageData(PRODUCT_LOCAL_STORAGE_KEY, updatedProducts);
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve();
      }, 500);
    });
  },

  updateProduct: async (updatedProduct) => {
    const products = getStorageData(PRODUCT_LOCAL_STORAGE_KEY, []);
    console.log("Before update:", products);

    // Đảm bảo rằng bạn so sánh ID đúng kiểu (số hoặc chuỗi)
    const updatedProducts = products.map((product) =>
      product.id === parseInt(updatedProduct.id, 10) ? updatedProduct : product
    );

    setStorageData(PRODUCT_LOCAL_STORAGE_KEY, updatedProducts);
    console.log("After update:", updatedProducts);

    return new Promise((resolve) => {
      setTimeout(() => {
        resolve(updatedProduct);
      }, 500);
    });
  },
};

ProductService.initProductIntoBrowserStorage();

export default ProductService;
