'use client';

import React, { useEffect, useState, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { IoAddCircle } from 'react-icons/io5';
import Image from 'next/image';
import { Product } from '@/app/types/Product';
import { Dialog, DialogContent, DialogTrigger, DialogTitle } from "@/components/ui/dialog";

const ProductsPage: React.FC = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [filteredProducts, setFilteredProducts] = useState<Product[]>([]);
  const [reductionQuantity, setReductionQuantity] = useState<number>(0);
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
  const fetchProducts = useCallback(async () => {
    try {
      const response = await fetch('/api/products');
      if (!response.ok) throw new Error('Erro ao buscar produtos');
      const data = await response.json();
      setProducts(data);
      setFilteredProducts(data);
      console.log(data)
    } catch (error) {
      console.error('Erro ao buscar produtos:', error);
    }
  }, []);

  useEffect(() => {
    fetchProducts();
  }, [fetchProducts]);

  const applyFilters = useCallback(() => {
    const { category, name, codIdentification, minStock, maxStock } = filters;
  
    const filtered = products.filter((product) => {
      const matchesCategory = category ? product.category?.toLowerCase().includes(category.toLowerCase()) : true;
      const matchesName = name ? product.name.toLowerCase().includes(name.toLowerCase()) : true;
      const matchesCode = codIdentification ? product.codIdentification.includes(codIdentification) : true;
      const matchesMinStock = minStock ? product.stock >= parseInt(minStock, 10) : true;
      const matchesMaxStock = maxStock ? product.stock <= parseInt(maxStock, 10) : true;
  
      return (
        matchesCategory &&
        matchesName &&
        matchesCode &&
        matchesMinStock &&
        matchesMaxStock
      );
    });
  
    setFilteredProducts(filtered);
  }, [filters, products]);
  
  

  useEffect(() => {
    applyFilters();
  }, [applyFilters]);

  // Handle filter changes
  const handleFilterChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFilters((prevFilters) => ({ ...prevFilters, [name]: value }));
  };

  // Handle stock reduction
  const handleReduceStock = async (id: string) => {
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

      if (reductionQuantity === 0) {
        alert('Você não pode vender ou usar 0 itens');
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
        setReductionQuantity(0)
        fetchProducts();
      } else {
        alert('Falha ao atualizar estoque');
      }
    } catch (error) {
      console.error('Erro ao reduzir o estoque:', error);
    }
  };

  const handleDeleteProduct = async (id: string) => {
    const confirmDelete = confirm("Tem certeza que deseja excluir este produto?");
    if (!confirmDelete) return;
  
    try {
      const response = await fetch(`/api/products/${id}`, {
        method: 'DELETE',
      });
  
      if (response.ok) {
        alert("Produto excluído com sucesso!");
        fetchProducts(); // Atualiza a lista de produtos
      } else {
        alert("Erro ao excluir o produto.");
      }
    } catch (error) {
      console.error("Erro ao excluir o produto:", error);
      alert("Ocorreu um erro ao tentar excluir o produto.");
    }
  };
  

  return (
    <div className="min-h-screen w-screen bg-white flex flex-col">
      <header className="bg-blue-600 text-white py-4 px-6">
        <h1 className="text-3xl font-semibold text-center">Lista de Produtos</h1>
      </header>
      <main className="flex-grow p-6 overflow-y-auto">
     
        <div className="flex flex-col gap-4 items-center justify-center mb-6 sm:flex-row">
          <div className="grid grid-cols-2 gap-4  sm:grid-cols-3 md:grid-cols-3 lg:grid-cols-6">
            {[
              { name: 'category', placeholder: 'Filtrar por Categoria' },
              { name: 'name', placeholder: 'Filtrar por Nome' },
              { name: 'codIdentification', placeholder: 'Filtrar por Código' },
              { name: 'minStock', placeholder: 'Estoque Mín.', type: 'number' },
              { name: 'maxStock', placeholder: 'Estoque Máx.', type: 'number' },
            ].map((filter) => (
              <input
                key={filter.name}
                type={filter.type || 'text'}
                name={filter.name}
                value={filters[filter.name as keyof typeof filters]}
                onChange={handleFilterChange}
                className="border px-4 py-2 rounded-md w-full"
                placeholder={filter.placeholder}
              />
            ))}

            <div
              onClick={() => router.push('/produtos/create')}
              className="bg-green-600 text-white px-6 py-2 rounded-md font-semibold hover:bg-green-700 transition 
              duration-300 flex gap-2 items-center cursor-pointer"
            >
              <IoAddCircle className="w-6 h-6" />
              <p>Produto</p>
            </div>
          </div>
        </div>

        {/* Products Table */}
        <div className="overflow-x-auto border-2 rounded-lg shadow-md">
          <table className="w-full bg-white">
            <thead className="bg-slate-100 items-center justify-center">
              <tr>
                <th className="px-4 py-2 text-left text-sm font-medium text-gray-700 hidden lg:table-cell">
                  Imagem
                </th>
                <th className="px-4 py-2 text-left text-sm font-medium text-gray-700">Nome</th>
                <th className="px-4 py-2 text-left text-sm font-medium text-gray-700">Código</th>
                <th className="px-4 py-2 text-left text-sm font-medium text-gray-700 hidden lg:table-cell">
                  Categoria
                </th>
                <th className=" w-full px-4 py-2 text-left text-sm font-medium text-gray-700 hidden lg:table-cell">
                  Descrição
                </th>
                <th className="px-4 py-2 text-left text-sm font-medium text-gray-700">Preço</th>
                <th className="px-4 py-2 text-left text-sm font-medium text-gray-700">Estoque</th>
                <th className="px-4 py-2 text-left text-sm font-medium text-gray-700">Ações</th>
              </tr>
            </thead>
            <tbody>
              {filteredProducts.map((product) => (
                <tr key={product.id} className="border-t">
                  <td className="px-4 py-2 text-sm text-gray-800 hidden lg:table-cell bg-slate-100">
                    { product.imageUrl? (
                     <Dialog>
                      <DialogTrigger asChild>
                        <div className="cursor-pointer flex justify-center">
                          <Image
                            src={product.imageUrl}
                            alt={product.name || 'Imagem padrão'}
                            width={144}
                            height={64}
                            className="object-cover rounded"
                          />
                        </div>
                      </DialogTrigger>
                      <DialogContent className="max-w-4xl">
                        <DialogTitle className="text-center text-xl font-semibold mb-4">
                          {product.name}
                        </DialogTitle>
                        <div className="flex justify-center">
                          <Image
                           src={product.imageUrl}
                           alt={product.name || 'Imagem padrão'}
                           width={600}
                           height={500}
                           className="object-contain"
                          />
                        </div>
                      </DialogContent>
                     </Dialog>
                    ) : (
                      <Dialog>
                      <DialogTrigger asChild>
                        <div className="cursor-pointer flex justify-center">
                          <Image
                            src='/semFoto.png'
                            alt={product.name || 'Imagem padrão'}
                            width={144}
                            height={64}
                            className="object-cover rounded"
                          />
                        </div>
                      </DialogTrigger>
                      <DialogContent className="max-w-4xl">
                        <DialogTitle className="text-center text-xl font-semibold mb-4">
                          {product.name}
                        </DialogTitle>
                        <div className="flex justify-center">
                          <Image
                           src='/semFoto.png'
                           alt={product.name || 'Imagem padrão'}
                           width={600}
                           height={500}
                           className="object-contain"
                          />
                        </div>
                      </DialogContent>
                     </Dialog>
                    )}
                  </td>
                  <td className="px-4 py-2 text-sm text-gray-800 text-center">{product.name}</td>
                  <td className="px-4 py-2 text-sm text-gray-800 text-center bg-slate-100">{product.codIdentification}</td>
                  <td className="px-4 py-2 text-sm text-gray-800 text-center bg-white hidden lg:table-cell">{product.category}</td>
                  <td className="px-4 py-2 text-sm text-gray-800 bg-slate-100 hidden lg:table-cell">
                    {product.description}
                  </td>
                  <td className="px-4 py-2 text-sm text-gray-800">{product.price}</td>
                  <td className="px-4 py-2 text-sm text-gray-800">{product.stock} Un.</td>
                  <td className="px-4 py-2 text-sm flex flex-col gap-2">
                    <div className="flex">
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
                        className="px-3 py-1 mr-2 text-white bg-green-500 rounded-md hover:bg-green-600 transition duration-300 w-full"
                      >
                        VenderUsar
                      </button>
                    </div>
                    <div className='flex w-full gap-2'>
                      <button
                        onClick={() => router.push(`/produtos/${product.id}`)}
                        className="px-3 py-1 text-white bg-orange-500 rounded-md hover:bg-orange-600 transition duration-300 w-full"
                      >
                        Editar
                      </button>
                      <button
                        onClick={() => handleDeleteProduct(product.id)}
                        className="px-3 py-1 text-white bg-red-500 rounded-md hover:bg-red-600 transition duration-300 w-full"
                      >
                        Excluir
                      </button>
                    </div>
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