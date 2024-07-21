import data from "../MOCK_DATA.json";

const PRODUCT_LOCAL_STORAGE_KEY = "products";
const storage = localStorage;
const getStorageData = (key, defaultValue) => {
  const jsonStringData = storage.getItem(key);
  console.log("check log getStorageData:", jsonStringData);
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

  getById: async (id) => {
    const products = getStorageData(PRODUCT_LOCAL_STORAGE_KEY, []);
    const product = products.find((product) => product.id === id);
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
      id: Date.now(),
    };

    const products = getStorageData(PRODUCT_LOCAL_STORAGE_KEY, []);
    const newProducts = [newProductData].concat(...products);

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
    const updatedProducts = products.map((product) =>
      product.id === updatedProduct.id ? updatedProduct : product
    );
    setStorageData(PRODUCT_LOCAL_STORAGE_KEY, updatedProducts);
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve(updatedProduct);
      }, 500);
    });
  },
};

ProductService.initProductIntoBrowserStorage();

export default ProductService;
