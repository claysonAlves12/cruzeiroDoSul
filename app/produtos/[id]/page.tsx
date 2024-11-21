'use client';

import React, { useEffect, useState } from 'react';
import { useRouter, useParams } from 'next/navigation';
import Image from 'next/image';
import { Product } from '@/app/types/Product';
import { motion } from 'framer-motion';

const ProductPage: React.FC = () => {
  const [product, setProduct] = useState<Product | null>(null); 
  const [tempProduct, setTempProduct] = useState<Product | null>(null); 
  const [loading, setLoading] = useState<boolean>(true);
  const [isEditing, setIsEditing] = useState<boolean>(false);
  const router = useRouter();
  const { id } = useParams();

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const response = await fetch(`/api/products/${id}`);
        if (!response.ok) throw new Error('Erro ao buscar produto');
        const data = await response.json();
        setProduct(data);
        setTempProduct(data);
      } catch (error) {
        console.error('Erro ao buscar produto:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchProduct();
  }, [id]);

  const formatCurrency = (value: number | string): string => {
    const numericValue = typeof value === 'string' ? parseFloat(value.replace(/\D/g, '')) / 100 : value;
    return numericValue
      ? new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(numericValue)
      : 'R$ 0,00';
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
  
    if (name === 'price') {
      const numericValue = parseFloat(value.replace(/\D/g, '')) / 100;
      setTempProduct((prev) => {
        if (!prev) return prev;
        return {
          ...prev,
          [name]: formatCurrency(numericValue),
        };
      });
    } else {
      setTempProduct((prev) => {
        if (!prev) return prev;
        return {
          ...prev,
          [name]: value,
        };
      });
    }
  };

  const handleSave = async () => {
    if (!tempProduct) return;

    try {
      const response = await fetch(`/api/products/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(tempProduct),
      });

      if (!response.ok) {
        throw new Error('Erro ao salvar alterações');
      }

      alert('Produto atualizado com sucesso!');
      setProduct(tempProduct);
      setIsEditing(false);
    } catch (error) {
      console.error('Erro ao salvar alterações:', error);
      alert('Erro ao salvar alterações.');
    }
  };

  const handleCancel = () => {
    setTempProduct(product);
    setIsEditing(false);
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <motion.div
          className="flex flex-col items-center justify-center gap-2"
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{
            duration: 0.5,
            ease: 'easeInOut',
            repeat: Infinity,
            repeatType: 'reverse',
          }}
        >
          <motion.div
            className="h-8 w-8 rounded-full bg-blue-500"
            animate={{
              y: [0, -10, 0],
            }}
            transition={{
              duration: 0.6,
              ease: 'easeInOut',
              repeat: Infinity,
            }}
          />
          <p className="text-gray-600 font-medium">Carregando...</p>
        </motion.div>
      </div>
    );
  }
  
  if (!product) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p>Produto não encontrado.</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex justify-center items-center w-screen bg-gray-50 px-4">
      <main className="flex flex-col items-center justify-center w-full max-w-6xl p-4">
        <motion.div
          className="border p-5 rounded-lg items-center flex flex-col md:flex-row gap-6 bg-white max-w-6xl w-full shadow-lg"
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, ease: "easeOut" }}
        >
          {/* Imagem */}
          <div className="flex flex-col items-center md:w-1/2">
            {tempProduct?.imageUrl && (
              <motion.div
                className="border border-blue-600 rounded-md w-full max-w-xs md:max-w-md"
                initial={{ scale: 0.9 }}
                animate={{ scale: 1 }}
                transition={{ duration: 0.3, ease: "easeInOut" }}
              >
                <Image
                  src={tempProduct.imageUrl}
                  alt={tempProduct.name}
                  width={400}
                  height={400}
                  className="rounded-lg object-contain w-full"
                />
              </motion.div>
            )}
          </div>
  
          {/* Detalhes ou Formulário */}
          <motion.div
            className="md:w-1/2 flex flex-col gap-4"
            initial={{ x: 50, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            transition={{ duration: 0.5, ease: "easeOut" }}
          >
            {isEditing ? (
              <>
                {/* Campos de Edição */}
                <div className="flex flex-col">
                  <label className="text-base font-semibold">Produto:</label>
                  <input
                    type="text"
                    name="name"
                    value={tempProduct?.name || ""}
                    onChange={handleInputChange}
                    className="border px-4 py-2 rounded-md w-full focus:outline-blue-500"
                  />
                </div>
                <div className="flex flex-col">
                  <label className="text-base font-semibold">Código de identificação:</label>
                  <input
                    type="text"
                    name="codIdentification"
                    value={tempProduct?.codIdentification || ""}
                    onChange={handleInputChange}
                    className="border px-4 py-2 rounded-md w-full focus:outline-blue-500"
                  />
                </div>
                <div className="flex flex-col">
                  <label className="text-base font-semibold">Descrição:</label>
                  <textarea
                    name="description"
                    value={tempProduct?.description || ""}
                    onChange={handleInputChange}
                    className="w-full border px-4 py-2 rounded-md h-24 focus:outline-blue-500 "
                    maxLength={200}
                  />
                  <p
                    className={`text-sm font-bold text-end ${
                      tempProduct?.description ? "text-green-600" : "text-red-600"
                    }`}
                  >
                    {200 - (tempProduct?.description?.length || 0)} caracteres restantes
                  </p>
                </div>
                <div className="flex flex-col">
                  <label className="text-base font-semibold">Preço:</label>
                  <input
                    type="text"
                    name="price"
                    value={tempProduct?.price ? formatCurrency(tempProduct.price) : "R$ 0,00"}
                    onChange={handleInputChange}
                    className="border px-4 py-2 rounded-md w-full focus:outline-blue-500"
                  />
                </div>
                <div className="flex flex-col">
                  <label className="text-base font-semibold">Estoque:</label>
                  <input
                    type="number"
                    name="stock"
                    value={tempProduct?.stock || ""}
                    onChange={handleInputChange}
                    className="border px-4 py-2 rounded-md w-full focus:outline-blue-500"
                  />
                </div>
                <div className="flex flex-col">
                  <label className="text-base font-semibold">URL da Imagem:</label>
                  <input
                    type="url"
                    name="imageUrl"
                    value={tempProduct?.imageUrl || ""}
                    onChange={handleInputChange}
                    className="border px-4 py-2 rounded-md w-full focus:outline-blue-500"
                  />
                </div>
              </>
            ) : (
              <>
                {/* Exibição dos Detalhes */}
                <p className="text-lg mb-2">
                  <strong>Produto:</strong> {product.name}
                </p>
                <p className="text-lg mb-2">
                  <strong>Categoria:</strong> {product.category || "Sem categoria"}
                </p>
                <p className="text-lg mb-2">
                  <strong>Código:</strong> {product.codIdentification}
                </p>
                <p className="text-lg mb-2">
                  <strong>Descrição:</strong> {product.description || "Sem descrição"}
                </p>
                <p className="text-lg mb-2">
                  <strong>Preço:</strong> {product.price}
                </p>
                <p className="text-lg mb-2">
                  <strong>Estoque:</strong> {product.stock} unidades
                </p>
              </>
            )}
          </motion.div>
        </motion.div>
  
        {/* Botões */}
        <motion.div
          className="flex justify-center gap-4 mt-6"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, ease: "easeOut", delay: 0.2 }}
        >
          {isEditing ? (
            <>
              <button
                onClick={handleSave}
                className="bg-green-600 text-white px-4 py-2 rounded-md font-semibold hover:bg-green-700 transition duration-300"
              >
                Salvar
              </button>
              <button
                onClick={handleCancel}
                className="bg-red-600 text-white px-4 py-2 rounded-md font-semibold hover:bg-red-700 transition duration-300"
              >
                Cancelar
              </button>
            </>
          ) : (
            <>
              <button
                onClick={() => setIsEditing(true)}
                className="bg-orange-600 text-white px-4 py-2 rounded-md font-semibold hover:bg-orange-700 transition duration-300"
              >
                Editar
              </button>
              <button
                onClick={() => router.push("/produtos")}
                className="bg-blue-600 text-white px-4 py-2 rounded-md font-semibold hover:bg-blue-700 transition duration-300"
              >
                Voltar para Lista
              </button>
            </>
          )}
        </motion.div>
      </main>
    </div>
  );
};

export default ProductPage;
