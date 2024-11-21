// types/Product.ts
export interface Product {
  id: string;
  name: string;
  codIdentification: string;
  description: string;
  stock: number;
  price: string;
  category: string;
  imageUrl?: string;
  createdAt: string;
  updatedAt: string;
}