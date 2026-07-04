import { allProducts } from '../data/productData';

// Fetch all products (Mock)
export const getProducts = async () => {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve(allProducts);
    }, 500); // simulate network latency
  });
};

// Fetch single product by ID (Mock)
export const getProduct = async (id) => {
  return new Promise((resolve) => {
    setTimeout(() => {
      const product = allProducts.find(p => p.id === id);
      resolve(product || null);
    }, 300);
  });
};

// Add a new product (Mock Admin only)
export const addProduct = async (productData) => {
  console.log("Mock addProduct:", productData);
  return "mock-id-" + Date.now();
};

// Update an existing product (Mock Admin only)
export const updateProduct = async (id, productData) => {
  console.log("Mock updateProduct:", id, productData);
  return true;
};

// Delete a product (Mock Admin only)
export const deleteProduct = async (id) => {
  console.log("Mock deleteProduct:", id);
  return true;
};
