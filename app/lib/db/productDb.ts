import { Low } from 'lowdb';
import { JSONFile } from 'lowdb/node';
import { Product } from '@/app/types/Product';
import path from 'path';
import fs from 'fs/promises';

export type ProductData = {
  products: Product[];
};

// Caminho absoluto para o arquivo JSON
const productsFile = path.join(__dirname, '../../../product.json');

// Verifica e cria o arquivo JSON se ele não existir
async function ensureFileExists(filePath: string, defaultData: ProductData) {
  try {
    await fs.access(filePath); // Verifica se o arquivo existe
  } catch {
    console.log('Arquivo JSON não encontrado. Criando novo arquivo...');
    await fs.writeFile(filePath, JSON.stringify(defaultData, null, 2), 'utf-8'); // Cria o arquivo
  }
}

// Adaptador para manipular o arquivo JSON
const productAdapter = new JSONFile<ProductData>(productsFile);

// Dados padrão para inicialização
const defaultData: ProductData = { products: [] };

// Instância do LowDB para produtos
const productDb = new Low<ProductData>(productAdapter, defaultData);

// Função para inicializar o banco de dados com estrutura padrão
export async function initializeProductsDB() {
  console.log('Inicializando o banco de dados...');
  console.log(`Caminho do arquivo JSON: ${productsFile}`);

  // Garante que o arquivo JSON exista
  await ensureFileExists(productsFile, defaultData);

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
