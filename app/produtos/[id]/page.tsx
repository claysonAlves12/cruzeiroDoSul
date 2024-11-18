'use client'

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useParams } from 'next/navigation';

import { Product } from '@/app/types/Product';

const ProductEditPage: React.FC = () => {
  const { id } = useParams(); // Captura o ID da URL
  const router = useRouter();
  const [product, setProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  // Fetch product data
  const fetchProduct = async () => {
    try {
      const response = await fetch(`/api/products/${id}`);
      if (!response.ok) {
        throw new Error('Produto não encontrado');
      }
      const data = await response.json();
      setProduct(data);
    } catch (error) {
      setError((error as Error).message || 'Erro ao buscar o produto');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProduct();
  }, [id]);

  const handleSave = async () => {
    try {
      const updatedProduct = {
        codIdentification: product?.codIdentification,
        name: product?.name,
        description: product?.description,
        stock: product?.stock,
        price: product?.price,
        category: product?.category,
        imageUrl: product?.imageUrl, // Usa diretamente a URL fornecida
      };

      const response = await fetch(`/api/products/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(updatedProduct),
      });

      if (response.ok) {
        alert('Produto atualizado com sucesso!');
        router.push('/produtos');
      } else {
        alert('Erro ao atualizar o produto');
      }
    } catch (error) {
      console.error('Erro ao salvar as alterações:', error);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setProduct((prev) => (prev ? { ...prev, [name]: value } : null));
  };

  if (loading) return <p>Carregando...</p>;
  if (error) return <p className="text-red-500">{error}</p>;

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-semibold text-center text-gray-800 mb-6">Editar Produto</h1>
      {product && (
        <div className="max-w-2xl mx-auto bg-white shadow-md rounded-lg p-6">
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-2">Código</label>
            <input
              type="text"
              name="codIdentification"
              value={product.codIdentification}
              onChange={handleChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-md"
            />
          </div>
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-2">Nome</label>
            <input
              type="text"
              name="name"
              value={product.name}
              onChange={handleChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-md"
            />
          </div>
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-2">Descrição</label>
            <textarea
              name="description"
              value={product.description}
              onChange={handleChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-md"
            ></textarea>
          </div>
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-2">Preço</label>
            <input
              type="number"
              name="price"
              value={product.price}
              onChange={handleChange}
              step="0.01"
              className="w-full px-3 py-2 border border-gray-300 rounded-md"
            />
          </div>
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-2">Estoque</label>
            <input
              type="number"
              name="stock"
              value={product.stock}
              onChange={handleChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-md"
            />
          </div>
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-2">Categoria</label>
            <input
              type="text"
              name="category"
              value={product.category}
              onChange={handleChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-md"
            />
          </div>
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-2">Imagem (URL)</label>
            {product.imageUrl && (
              <img
                src={product.imageUrl}
                alt="Produto"
                className="w-32 h-32 object-cover mb-4"
              />
            )}
            <input
              type="text"
              name="imageUrl"
              value={product.imageUrl || ''}
              onChange={handleChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-md"
              placeholder="Cole a URL da imagem aqui"
            />
          </div>
          <div className="flex justify-between">
            <button
              onClick={() => router.push('/products')}
              className="px-6 py-2 bg-gray-500 text-white font-semibold rounded-md shadow-lg hover:bg-gray-600 transition duration-300"
            >
              Cancelar
            </button>
            <button
              onClick={handleSave}
              className="px-6 py-2 bg-blue-600 text-white font-semibold rounded-md shadow-lg hover:bg-blue-700 transition duration-300"
            >
              Salvar Alterações
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default ProductEditPage;
