// app/lib/db/productDb.ts
import { Low } from 'lowdb';
import { JSONFile } from 'lowdb/node';
import path from 'path';

// Definindo o tipo da estrutura do banco de dados
export type ProductData = {
  products: { 
    id: number;
    codIdentification: string;
    name: string; 
    description: string;
    stock: number;
    price: number;
    category?: string;
    imageUrl?: string;
    createdAt: string;
    updatedAt: string;
  }[];
};

// Caminho para o arquivo JSON
const productsFile = path.join(process.cwd(), 'app/lib/product.json');

// Dados padrão
const defaultProductData: ProductData = { products: [] };

// Adaptador para manipular o arquivo JSON
const productAdapter = new JSONFile<ProductData>(productsFile);

// Instância do LowDB para produtos
const productDb = new Low<ProductData>(productAdapter, defaultProductData);

// Inicialização do banco de dados
export async function initializeProductsDB() {
  console.log("chamou")
  await productDb.read();
  productDb.data ||= defaultProductData;
  await productDb.write();
  return productDb;
}

export { productDb };