'use client';

import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { IoAddCircle } from "react-icons/io5";
import { Product } from '@/app/types/Product';

const ProductsPage: React.FC = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [filteredProducts, setFilteredProducts] = useState<Product[]>([]);
  const [reductionQuantity, setReductionQuantity] = useState<number>(1);
  const [filters, setFilters] = useState({
    category: '',
    name: '',
    codIdentification: '',
    minPrice: '',
    maxPrice: '',
    minStock: '',
    maxStock: '',
  });

  const router = useRouter();

  // Fetch products
  const fetchProducts = async () => {
    try {
      const response = await fetch('/api/products');
      const data = await response.json();
      setProducts(data);
      setFilteredProducts(data);
    } catch (error) {
      console.error('Erro ao buscar produtos:', error);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  // Handle filters
  const handleFilterChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFilters((prevFilters) => ({ ...prevFilters, [name]: value }));
  };

  const handleReduceStock = async (id: number) => {
    try {
      const productToUpdate = products.find((product) => product.id === id);
      if (!productToUpdate) {
        alert('Produto não encontrado!');
        return;
      }

      const newStock = productToUpdate.stock - reductionQuantity;
      if (newStock < 0) {
        alert('Quantidade de venda/uso maior do que o estoque disponível!');
        return;
      }

      const response = await fetch(`/api/products`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ ...productToUpdate, stock: newStock }),
      });

      if (response.ok) {
        alert('Estoque atualizado com sucesso');
        fetchProducts();
      } else {
        alert('Falha ao atualizar estoque');
      }
    } catch (error) {
      console.error('Erro ao reduzir o estoque:', error);
    }
  };

  const applyFilters = () => {
    const { category, name, codIdentification, minPrice, maxPrice, minStock, maxStock } = filters;

    const filtered = products.filter((product) => {
      const matchesCategory = category ? product.category?.toLowerCase().includes(category.toLowerCase()) : true;
      const matchesName = name ? product.name.toLowerCase().includes(name.toLowerCase()) : true;
      const matchesCode = codIdentification ? product.codIdentification.includes(codIdentification) : true;
      const matchesMinPrice = minPrice ? product.price >= parseFloat(minPrice) : true;
      const matchesMaxPrice = maxPrice ? product.price <= parseFloat(maxPrice) : true;
      const matchesMinStock = minStock ? product.stock >= parseInt(minStock, 10) : true;
      const matchesMaxStock = maxStock ? product.stock <= parseInt(maxStock, 10) : true;

      return (
        matchesCategory &&
        matchesName &&
        matchesCode &&
        matchesMinPrice &&
        matchesMaxPrice &&
        matchesMinStock &&
        matchesMaxStock
      );
    });

    setFilteredProducts(filtered);
  };

  useEffect(() => {
    applyFilters();
  }, [filters]);

  return (
    <div className="min-h-screen w-screen bg-white flex flex-col">
      <header className="bg-blue-600 text-white py-4 px-6">
        <h1 className="text-3xl font-semibold text-center">Lista de Produtos</h1>
      </header>
      <main className="flex-grow p-6 overflow-y-auto">

        {/* Filtros e Botão */}
        <div className="flex flex-col gap-4 items-center justify-between mb-6 sm:flex-row">
          <div className="grid grid-cols-3 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-7 gap-4 w-full">
            <input
              type="text"
              name="category"
              value={filters.category}
              onChange={handleFilterChange}
              className="border px-4 py-2 rounded-md"
              placeholder="Filtrar por Categoria"
            />
            <input
              type="text"
              name="name"
              value={filters.name}
              onChange={handleFilterChange}
              className="border px-4 py-2 rounded-md"
              placeholder="Filtrar por Nome"
            />
            <input
              type="text"
              name="codIdentification"
              value={filters.codIdentification}
              onChange={handleFilterChange}
              className="border px-4 py-2 rounded-md"
              placeholder="Filtrar por Código"
            />
            <input
              type="number"
              name="minPrice"
              value={filters.minPrice}
              onChange={handleFilterChange}
              className="border px-4 py-2 rounded-md"
              placeholder="Preço Mín."
            />
            <input
              type="number"
              name="maxPrice"
              value={filters.maxPrice}
              onChange={handleFilterChange}
              className="border px-4 py-2 rounded-md"
              placeholder="Preço Máx."
            />
            <input
              type="number"
              name="minStock"
              value={filters.minStock}
              onChange={handleFilterChange}
              className="border px-4 py-2 rounded-md "
              placeholder="Estoque Mín."
            />
            <input
              type="number"
              name="maxStock"
              value={filters.maxStock}
              onChange={handleFilterChange}
              className="border px-4 py-2 rounded-md"
              placeholder="Estoque Máx."
            />
          </div>
          <div
            onClick={() => router.push('/products/create')}
            className="bg-green-600 text-white px-6 py-2 rounded-md font-semibold hover:bg-green-700 transition duration-300 flex gap-2 items-center cursor-pointer flex-1"
          >
            <IoAddCircle className='w-6 h-6'/> 
            <p>Produto</p>
          </div>
        </div>

        <div className="overflow-x-auto border-2 rounded-lg shadow-md">
          <table className="min-w-full bg-white ">
            <thead className="bg-slate-100">
              <tr>
                <th className="px-4 py-2 text-left text-sm font-medium text-gray-700 hidden lg:table-cell">Imagem</th>
                <th className="px-4 py-2 text-left text-sm font-medium text-gray-700">Nome</th>
                <th className="px-4 py-2 text-left text-sm font-medium text-gray-700">Código</th>
                <th className="px-4 py-2 text-left text-sm font-medium text-gray-700 hidden lg:table-cell">Categoria</th>
                <th className="px-4 py-2 text-left text-sm font-medium text-gray-700 hidden lg:table-cell">Descrição</th>
                <th className="px-4 py-2 text-left text-sm font-medium text-gray-700 ">Preço</th>
                <th className="px-4 py-2 text-left text-sm font-medium text-gray-700 ">Estoque</th>
                <th className="px-4 py-2 text-left text-sm font-medium text-gray-700">Ações</th>
              </tr>
            </thead>
            <tbody>
              {filteredProducts.map((product) => (
                <tr key={product.id} className="border-t">
                  <td className="px-4 py-2 text-sm text-gray-800 hidden lg:table-cell">  
                    <img
                      src={product.imageUrl}
                      alt={product.name}
                      className="w-36 h-16 object-cover rounded "
                    />
                  </td>
                  <td className="px-4 py-2 text-sm text-gray-800 ">{product.name}</td>
                  <td className="px-4 py-2 text-sm text-gray-800  bg-slate-100">{product.codIdentification}</td>
                  <td className="px-4 py-2 text-sm text-gray-800 bg-white hidden lg:table-cell">{product.category}</td>
                  <td className="px-4 py-2 text-sm text-gray-800 bg-slate-100 hidden lg:table-cell">{product.description}</td>
                  <td className="px-4 py-2 text-sm text-gray-800  w-28">R$ {product.price.toFixed(2)}</td>
                  <td className="px-4 py-2 text-sm text-gray-800  ">{product.stock} Un.</td>
                  <td className="px-4 py-2 text-sm flex flex-col gap-2">
                    <div className='flex'>
                      <input
                        type="number"
                        value={reductionQuantity}
                        onChange={(e) => setReductionQuantity(Number(e.target.value))}
                        min="1"
                        className="px-2 py-1 border border-gray-300 rounded-md mr-2 w-14"
                        placeholder="Qtd"
                      />
                      <button
                        onClick={() => handleReduceStock(product.id)}
                        className="px-3 py-1 mr-2 text-white bg-green-500 rounded-md hover:bg-green-600 transition duration-300"
                      >
                        Vender/Usar
                      </button>
                    </div>
                    
                    <button
                      onClick={() => router.push(`/produtos/${product.id}`)}
                      className="px-3 py-1 text-white bg-orange-500 rounded-md hover:bg-orange-600 transition duration-300"
                    >
                      Editar
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </main>
      <footer className="bg-gray-200 text-center py-4">
        <p className="text-sm text-gray-600">
          © {new Date().getFullYear()} Dev.Clayson. Todos os direitos reservados.
        </p>
      </footer>
    </div>
  );
};

export default ProductsPage;
