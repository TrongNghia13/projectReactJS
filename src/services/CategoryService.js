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
const CategoryService = {
  getAll: async () => {
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        resolve(categories);
      }, 200);
    });
  },
};
export default CategoryService;
