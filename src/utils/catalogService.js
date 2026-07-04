// Mocked Catalog Service

export const DEFAULT_CATEGORIES = [];
export const DEFAULT_BRANDS = [];

export function listenToCategories(callback) {
  callback([
    { id: '1', name: 'Smartphones', icon: 'Smartphone' },
    { id: '2', name: 'Laptops', icon: 'Laptop' },
    { id: '3', name: 'Home Appliances', icon: 'Tv' },
    { id: '4', name: 'Generators', icon: 'Zap' },
  ]);
  return () => {}; 
}

export async function addCategory(data) { return Promise.resolve(); }
export async function updateCategory(id, data) { return Promise.resolve(); }
export async function deleteCategory(id) { return Promise.resolve(); }

export function listenToBrands(callback) {
  callback([
    { id: '1', name: 'Apple' },
    { id: '2', name: 'Samsung' },
    { id: '3', name: 'HP' },
    { id: '4', name: 'LG' },
  ]);
  return () => {}; 
}

export async function addBrand(data) { return Promise.resolve(); }
export async function updateBrand(id, data) { return Promise.resolve(); }
export async function deleteBrand(id) { return Promise.resolve(); }

export async function seedTaxonomy() {
  return Promise.resolve();
}
