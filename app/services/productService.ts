// app/services/productService.ts
import { initializeProductsDB } from '../lib/db/productDb';
import { ProductData } from '../lib/db/productDb'; // Tipo de dados de produto

// Função para adicionar um novo produto
export async function addProduct(product: Omit<ProductData['products'][0], 'id' | 'createdAt' | 'updatedAt'>) {
  const db = await initializeProductsDB();

  // Verificar se o código de identificação já está em uso
  const existingProductByCodIdentification = db.data?.products.find(p => p.codIdentification === product.codIdentification);
  if (existingProductByCodIdentification) {
    throw new Error('Produto com código de identificação já existe.');
  }
  
  // Verificar se o nome do produto já existe
  const existingProductByName = db.data?.products.find(p => p.name === product.name);
  if (existingProductByName) {
    throw new Error('Produto nome já existe.');
  }

  // Criando um novo ID e definindo as datas de criação e atualização
  const newProduct = {
    id: db.data?.products.length ? db.data.products[db.data.products.length - 1].id + 1 : 1,
    ...product,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  };

  db.data?.products.push(newProduct);
  await db.write();
  
  return newProduct;
}

export async function updateProduct(id: number, updatedData: Partial<ProductData['products'][0]>) {
  const db = await initializeProductsDB();

  const productIndex = db.data?.products.findIndex((p) => p.id === id);
  if (productIndex === undefined || productIndex < 0) {
    throw new Error('Produto não encontrado.');
  }

  // Atualiza o produto com os novos dados
  const updatedProduct = {
    ...db.data!.products[productIndex],
    ...updatedData,
    updatedAt: new Date().toISOString(), // Atualiza a data de modificação
  };

  db.data!.products[productIndex] = updatedProduct;
  await db.write(); // Salva as alterações no banco de dados

  return updatedProduct;
}

// Função para excluir um produto
export async function deleteProduct(id: number) {
  const db = await initializeProductsDB();
  
  const index = db.data?.products.findIndex(p => p.id === id);
  if (index === -1) {
    throw new Error('Produto não encontrado.');
  }

  const deletedProduct = db.data?.products.splice(index!, 1);
  await db.write();
  
  return deletedProduct;
}

// Função para obter todos os produtos
export async function getAllProducts() {
  const db = await initializeProductsDB();
  console.log('iniciando')
  return db.data?.products || [];
}

// Função para obter um produto pelo ID
export async function getProductById(id: number) {
  const db = await initializeProductsDB();
  const product = db.data?.products.find(p => p.id === id);
  if (!product) {
    throw new Error('Produto não encontrado.');
  }
  return product;
}
