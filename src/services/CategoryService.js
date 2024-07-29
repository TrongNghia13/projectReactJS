const categories = [
  {
    id: "j4pij1wtxh",
    category: "electronics",
  },
  {
    id: "txwoexullja",
    category: "jewelery",
  },
  {
    id: "umw517rnl9d",
    category: "men's clothing",
  },
  {
    id: "bmzkbkml3h",
    category: "women's clothing",
  },
];
const getErrorResponse = (rejectRate) => {
  if (rejectRate < 0.2) {
      return {
          message: "Server Error",
          responseException: null,
          result: null,
          statusCode: 500,
          version: "1.0.0",
      };
  }

  if (rejectRate >= 0.2 && rejectRate < 0.4) {
      return {
          message: "Wrong request",
          responseException: null,
          result: null,
          statusCode: 400,
          version: "1.0.0",
      };
  }

  return null; // No error
}

const CategoryService = {
  getAll: async () => {
      return new Promise((resolve, reject) => {
          const rate = Math.random(); // 0 - 1
          const errorMessage = getErrorResponse(rate);

          setTimeout(() => {
              if (errorMessage) {
                  reject(errorMessage); // Simulate API failure
              } else {
                  resolve(categories); // Simulate API success
              }
          }, 200);
      });
  }
}

export default CategoryService;


