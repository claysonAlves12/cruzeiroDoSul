import { initializeProductsDB } from '../lib/db/productDb';
import { ProductData } from '../lib/db/productDb'; // Tipo de dados de produto

// Função para adicionar um novo produto
export async function addProduct(
  product: Omit<ProductData['products'][0], 'id' | 'createdAt' | 'updatedAt'>
) {
  const db = await initializeProductsDB();

  const existingProductByCodIdentification = db.data?.products.find(
    (p) => p.codIdentification === product.codIdentification
  );
  if (existingProductByCodIdentification) {
    throw new Error('Produto com código de identificação já existe.');
  }

  const existingProductByName = db.data?.products.find((p) => p.name === product.name);
  if (existingProductByName) {
    throw new Error('Produto com este nome já existe.');
  }

  const newProduct = {
    ...product,
    id: String(db.data?.products.length ? db.data.products[db.data.products.length - 1].id + 1 : 1),
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  };

  db.data?.products.push(newProduct);
  await db.write();

  return newProduct;
}

// Função para atualizar um produto
export async function updateProduct(
  id: number | string,
  updatedData: Partial<Omit<ProductData['products'][0], 'id' | 'createdAt'>>
) {
  const db = await initializeProductsDB();

  const productIndex = db.data?.products.findIndex((p) => String(p.id) === String(id));
  if (productIndex === undefined || productIndex < 0) {
    throw new Error('Produto não encontrado.');
  }

  const updatedProduct = {
    ...db.data!.products[productIndex],
    ...updatedData,
    updatedAt: new Date().toISOString(),
  };

  db.data!.products[productIndex] = updatedProduct;
  await db.write();

  return updatedProduct;
}

// Função para excluir um produto
export async function deleteProduct(id: number | string) {
  const db = await initializeProductsDB();

  const index = db.data?.products.findIndex((p) => String(p.id) === String(id));
  if (index === undefined || index < 0) {
    throw new Error('Produto não encontrado.');
  }

  const deletedProduct = db.data?.products.splice(index, 1);
  await db.write();

  return deletedProduct;
}

// Função para obter todos os produtos
export async function getAllProducts() {
  const db = await initializeProductsDB();
  return db.data?.products || [];
}

// Função para obter um produto pelo ID
export async function getProductById(id: number | string) {
  const db = await initializeProductsDB();
  const product = db.data?.products.find((p) => String(p.id) === String(id));
  if (!product) {
    throw new Error('Produto não encontrado.');
  }
  return product;
}
