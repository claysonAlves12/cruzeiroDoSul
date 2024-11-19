'use client'

import { useState } from 'react';
import { useRouter } from 'next/navigation';

const CreateProduct = () => {
  const router = useRouter();
  const [product, setProduct] = useState({
    name: '',
    codIdentification: '',
    description: '',
    stock: 0,
    price: '',
    category: '',
    imageUrl: '',
  });
  const [errors, setErrors] = useState({ price: '' });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;

    if (name === 'price') {
      // Formatar o preço e validar
      const formattedPrice = formatCurrency(value);
      setProduct((prev) => ({ ...prev, [name]: formattedPrice }));
      validatePrice(formattedPrice);
    } else {
      setProduct((prev) => ({ ...prev, [name]: value }));
    }
  };

  const validatePrice = (value: string) => {
    const isValid = /^\d+(\.\d{2}|\.\d{1}|,\d{2}|,\d{1})$/.test(value);
    if (!isValid) {
      setErrors((prev) => ({ ...prev, price: 'O preço deve estar no formato 0.00 ou 0,00.' }));
    } else {
      setErrors((prev) => ({ ...prev, price: '' }));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Verificar erros antes de enviar
    if (errors.price || !product.price) {
      alert('Por favor, corrija os erros antes de continuar.');
      return;
    }

    try {
      const productData = {
        ...product,
        price: parseCurrency(product.price), // Converter para número antes de enviar
      };

      const res = await fetch('/api/products', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(productData),
      });

      if (res.ok) {
       
        alert('Produto criado com sucesso!');
        router.push('/produtos');
      } else {
        const error = await res.json();
        alert(error.error || 'Erro ao criar produto');
      }
    } catch (error) {
      console.error('Erro:', error);
      alert('Erro ao enviar dados');
    }
  };

  // Formatar um valor para moeda BRL
  const formatCurrency = (value: string) => {
    const numericValue = value.replace(/\D/g, ''); // Remove qualquer caractere não numérico
    const formatted = (Number(numericValue) / 100).toLocaleString('pt-BR', {
      style: 'currency',
      currency: 'BRL',
    });
    return formatted.replace('R$', '').trim(); // Remove o símbolo "R$" para exibição no campo
  };

  // Converter o valor do campo para número antes de enviar
  const parseCurrency = (value: string) => {
    return Number(value.replace(/\./g, '').replace(',', '.')); // Converte de "1.234,56" para 1234.56
  };

  return (
    <div className="max-w-lg mx-auto mt-10">
      <h1 className="text-2xl font-bold mb-4">Criar Produto</h1>
      <form onSubmit={handleSubmit} className="space-y-4">
        <input
          type="text"
          name="name"
          placeholder="Nome do Produto"
          value={product.name}
          onChange={handleChange}
          className="w-full px-4 py-2 border rounded"
          required
        />
        <input
          type="text"
          name="codIdentification"
          placeholder="Código de Identificação"
          value={product.codIdentification}
          onChange={handleChange}
          className="w-full px-4 py-2 border rounded"
          required
        />
        <textarea
          name="description"
          placeholder="Descrição"
          value={product.description}
          onChange={handleChange}
          className="w-full px-4 py-2 border rounded"
        />
        <input
          type="number"
          name="stock"
          placeholder="Estoque"
          value={product.stock}
          onChange={handleChange}
          className="w-full px-4 py-2 border rounded"
          required
        />
        <input
          type="text"
          name="price"
          placeholder="Preço (ex: 0.00 ou 0,00)"
          value={product.price}
          onChange={handleChange}
          className={`w-full px-4 py-2 border rounded ${errors.price ? 'border-red-500' : ''}`}
          required
        />
        {errors.price && <p className="text-red-500 text-sm">{errors.price}</p>}
        <input
          type="text"
          name="category"
          placeholder="Categoria"
          value={product.category}
          onChange={handleChange}
          className="w-full px-4 py-2 border rounded"
          required
        />
        <input
          type="url"
          name="imageUrl"
          placeholder="URL da Imagem (opcional)"
          value={product.imageUrl}
          onChange={handleChange}
          className="w-full px-4 py-2 border rounded"
        />
        <button
          type="submit"
          className="bg-green-600 text-white px-6 py-2 rounded-md font-semibold hover:bg-green-700 transition duration-300"
        >
          Criar Produto
        </button>
      </form>
    </div>
  );
};

export default CreateProduct;
