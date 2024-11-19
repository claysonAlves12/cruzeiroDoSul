import { collection, addDoc, getDocs, doc, getDoc, updateDoc, deleteDoc, query, where } from 'firebase/firestore';
import { db } from '@/lib/db/firebase'; // Certifique-se de apontar para sua configuração Firebase

// Tipo para os dados do produto
export interface Product {
  id?: string; // O ID será gerado automaticamente pelo Firestore
  name: string;
  codIdentification: string;
  description: string;
  stock: number;
  price: number;
  category: string;
  imageUrl?: string;
  createdAt?: string;
  updatedAt?: string;
}

// Nome da coleção no Firestore
const collectionName = 'products';

// Função para adicionar um novo produto
export async function addProduct(product: Omit<Product, 'id' | 'createdAt' | 'updatedAt'>) {
  const productsRef = collection(db, collectionName);

  // Verificar se já existe produto com o mesmo código de identificação
  const q = query(productsRef, where('codIdentification', '==', product.codIdentification));
  const existingProductSnapshot = await getDocs(q);

  if (!existingProductSnapshot.empty) {
    throw new Error('Produto com código de identificação já existe.');
  }

  const newProduct = {
    ...product,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  };

  const docRef = await addDoc(productsRef, newProduct);
  return { id: docRef.id, ...newProduct };
}

// Função para atualizar um produto
export async function updateProduct(
  id: string,
  updatedData: Partial<Omit<Product, 'id' | 'createdAt'>>
) {
  const productRef = doc(db, collectionName, id);

  const productSnapshot = await getDoc(productRef);
  if (!productSnapshot.exists()) {
    throw new Error('Produto não encontrado.');
  }

  const updatedProduct = {
    ...productSnapshot.data(),
    ...updatedData,
    updatedAt: new Date().toISOString(),
  };

  await updateDoc(productRef, updatedProduct);
  return { id, ...updatedProduct };
}

// Função para excluir um produto
export async function deleteProduct(id: string) {
  const productRef = doc(db, collectionName, id);

  const productSnapshot = await getDoc(productRef);
  if (!productSnapshot.exists()) {
    throw new Error('Produto não encontrado.');
  }

  await deleteDoc(productRef);
  return { id, ...productSnapshot.data() };
}

// Função para obter todos os produtos
export async function getAllProducts() {
  const productsRef = collection(db, collectionName);
  const snapshot = await getDocs(productsRef);

  const products: Product[] = snapshot.docs.map((doc) => ({
    id: doc.id,
    ...doc.data(),
  })) as Product[];

  return products;
}

// Função para obter um produto pelo ID
export async function getProductById(id: string) {
  const productRef = doc(db, collectionName, id);

  const productSnapshot = await getDoc(productRef);
  if (!productSnapshot.exists()) {
    throw new Error('Produto não encontrado.');
  }

  return { id: productSnapshot.id, ...productSnapshot.data() } as Product;
}
