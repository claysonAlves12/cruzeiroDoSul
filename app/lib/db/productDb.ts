// app/lib/db/productDb.ts

import { Low } from 'lowdb';
import { JSONFile } from 'lowdb/node';
import { Product } from '@/app/types/Product'
import path from 'path';

export type ProductData = {
  products: Product[];
};

// Caminho para o arquivo JSON
const productsFile = path.join(process.cwd(), 'app/lib/product.json');

// Adaptador para manipular o arquivo JSON
const productAdapter = new JSONFile<ProductData>(productsFile);

// Dados padrão para inicialização
const defaultData: ProductData = { products: [] };

// Instância do LowDB para produtos
const productDb = new Low<ProductData>(productAdapter, defaultData);

// Função para inicializar o banco de dados com estrutura padrão
export async function initializeProductsDB() {
  console.log('Inicializando o banco de dados...');
  console.log(productsFile, 'caminho');

  // Ler o conteúdo do arquivo
  await productDb.read();

  // Se o banco estiver vazio, inicializa com os dados padrão
  if (!productDb.data || Object.keys(productDb.data).length === 0) {
    console.log('Banco de dados vazio ou não encontrado. Criando estrutura padrão...');
    productDb.data = defaultData; // Inicializa com os dados padrão
    await productDb.write();
  }

  console.log('Banco de dados inicializado:', productDb.data);
  return productDb;
}

// Exporta a instância do banco de dados para uso em outras partes do app
export { productDb };
