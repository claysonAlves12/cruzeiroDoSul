'use client';

import React from 'react';
import { ImBin2 } from "react-icons/im";
import { motion } from 'framer-motion';
import Image from 'next/image';

interface CreateProductFormProps {
  product: {
    name: string;
    codIdentification: string;
    description: string;
    stock: number;
    price: string;
    category: string;
    imageUrl: string;
  };
  categories: string[];
  onProductChange: (key: keyof CreateProductFormProps['product'], value: string | number) => void;
  onSubmit: (e: React.FormEvent) => void;
  onDeleteCategory: (categoryName: string) => void;
  onCreatingCategory: (value: boolean) => void; 
  onBackProductHome: () => void;
}

const formatCurrency = (value: string | number): string => {
  const numericValue = typeof value === 'string' ? parseFloat(value.replace(/\D/g, '')) / 100 : value;
  return new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(numericValue);
};

const parseCurrency = (formattedValue: string): number => {
  return parseFloat(formattedValue.replace(/\D/g, '')) / 100; // Remove todos os caracteres não numéricos e ajusta a casa decimal
};


const CreateProductForm: React.FC<CreateProductFormProps> = ({
  product,
  categories,
  onProductChange,
  onSubmit,
  onDeleteCategory,
  onCreatingCategory,
  onBackProductHome,
}) => {
  return (
    <motion.form
    onSubmit={onSubmit}
    className="max-w-3xl w-full mx-auto p-6 bg-white rounded-lg shadow-md space-y-4"
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ duration: 0.3 }}
  >
    <h1 className="text-2xl font-bold text-center text-blue-600 mb-6">
      Cadastrar Produto
    </h1>

    <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 p-2 ">
      <div className='flex flex-col gap-1'>
        <label htmlFor="name" className="block text-sm font-medium text-gray-700">
          Nome do Produto *
        </label>
        <input
          type="text"
          id="name"
          name="name"
          value={product.name}
          onChange={(e) => onProductChange('name', e.target.value)}
          className="block w-full rounded-md border-2 border-zinc-200 p-2"
          required
        />
      </div>

      <div className='flex flex-col gap-1'>
        <label
          htmlFor="codIdentification"
          className="block text-sm font-medium text-gray-700"
        >
          Código de Identificação *
        </label>
        <input
          type="text"
          id="codIdentification"
          name="codIdentification"
          value={product.codIdentification}
          onChange={(e) => onProductChange('codIdentification', e.target.value)}
          className="block w-full rounded-md border-2 border-zinc-200 p-2"
          required
        />
      </div>
    </div>

    <div className=' p-2 flex flex-col gap-1'>

      <label htmlFor="description" className="block text-sm font-medium text-gray-700">
        Descrição (opcional)
      </label>
      <textarea
        id="description"
        name="description"
        placeholder="Descrição (máx: 200 caracteres)"
        value={product.description}
        onChange={(e) => onProductChange('description', e.target.value)}
        maxLength={200}
        className="block w-full rounded-md border-2 border-zinc-200 p-2 h-24"
      />
      {product.description.length > 0 && (
        <p className="mt-1 text-sm text-green-600 font-bold">
          {200 - product.description.length} caracteres restantes
        </p>
      )}
    </div>

    <div className="grid grid-cols-1 sm:grid-cols-3 gap-6  p-2">
      <div>
        <label htmlFor="stock" className="block text-sm font-medium text-gray-700">
          Estoque *
        </label>
        <input
          type="number"
          id="stock"
          name="stock"
          value={product.stock}
          onChange={(e) => onProductChange('stock', Number(e.target.value))}
          className="block w-full rounded-md border-2 border-zinc-200 p-2"
          required
        />
      </div>

      <div>
        <label htmlFor="price" className="block text-sm font-medium text-gray-700">
          Preço (opcional)
        </label>
        <input
          type="text"
          id="price"
          name="price"
          value={formatCurrency(product.price || 0)} // Exibe o valor formatado
          onChange={(e) => {
            const numericValue = parseCurrency(e.target.value);
            onProductChange('price', numericValue);
          }}
          className="block w-full rounded-md border-2 border-zinc-200 p-2"
          
        />

      </div>

      <div className='flex flex-col gap-2'>
        <div>
          <label htmlFor="category" className="block text-sm font-medium text-gray-700">
            Categoria (opcional)
          </label>
          <select
            id="category"
            name="category"
            value={product.category}
            onChange={(e) => {
              if (e.target.value === "new") {
                onProductChange("category", "");
                onCreatingCategory(true);
              } else {
                onProductChange("category", e.target.value);
              }
            }}
            className="block w-full rounded-md p-3 cursor-pointer border"
            
          >
            <option value="" disabled>
              Selecione ou Crie
            </option>
            <option value="new" className='bg-green-500 text-white'>Criar Nova Categoria</option>
            {categories.map((cat) => (
              <option key={cat} value={cat}>
                {cat}
              </option>
            ))}
          </select>
        </div>
        
        {product.category && (
          <div 
            onClick={() => onDeleteCategory(product.category)}
            className=" flex items-center gap-2 w-full bg-red-600 text-white px-6 py-2 rounded-md font-semibold hover:bg-red-700 transition duration-300 cursor-pointer"
          >
            <ImBin2 /> 
            <span>Apagar Categoria</span>
          </div>
         
        )}
      </div>
    </div>

    <div className='p-2 flex items-center gap-2'>
     
      <Image
        src={product.imageUrl?.trim() !== '' ? product.imageUrl : '/semFoto.png'}
        alt="Imagem do produto"
        width={128} // Ajuste conforme necessário
        height={128} // Ajuste conforme necessário
        className="object-cover rounded-md border"
        placeholder="blur" // Opcional: Adiciona um efeito de carregamento
        blurDataURL="/semFoto.png" // Opcional: Para o carregamento de imagem padrão
      />
      
      <div className='w-full'>
        <label htmlFor="imageUrl" className="block text-sm font-medium text-gray-700">
          URL da Imagem (opcional)
        </label>
        <input
          type="url"
          id="imageUrl"
          name="imageUrl"
          value={product.imageUrl || ''}
          onChange={(e) => onProductChange('imageUrl', e.target.value)}
          className="block w-full rounded-md border-2 border-zinc-200 p-2"
        />
      </div>
      
    </div>


    <div className="flex justify-between gap-4">
      <button
        onClick={onBackProductHome}
        className="bg-gray-600 text-white px-6 py-2 rounded-md font-semibold hover:bg-gray-700 transition duration-300"

      >
        voltar
      </button>

      <button
        type="submit"
        className="bg-green-600 text-white px-6 py-2 rounded-md font-semibold hover:bg-green-700 transition duration-300"
      >
        Criar Produto
      </button>
    </div>
  </motion.form>
  );
};

export default CreateProductForm;