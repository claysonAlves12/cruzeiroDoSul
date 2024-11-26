'use client';

import React, { useEffect, useState, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { IoAddCircle } from 'react-icons/io5';
import { useToast } from "@/hooks/use-toast";
import Image from 'next/image';
import { Product } from '@/app/types/Product';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogTrigger, DialogTitle } from "@/components/ui/dialog";

const ProductsPage: React.FC = () => {
  const { toast } = useToast();
  const [isConfirmDialogOpen, setConfirmDialogOpen] = useState(false);
  const [currentProductId, setCurrentProductId] = useState<string | null>(null);
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
    } catch (error:unknown) {
      const errorMessage = error instanceof Error ? error.message : 'Erro desconhecido';
      toast({ open: true, description: `Erro ao buscar produtos: ${errorMessage}`, variant: 'destructive' });
    }
  }, [toast]);

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
        toast({ open: true, description: 'Produto não encontrado!', variant: 'destructive' });
        return;
      }

      const newStock = productToUpdate.stock - reductionQuantity;
      if (newStock < 0) {
        toast({ open: true, description: 'Quantidade de venda ou uso maior do que o estoque disponível!', variant: 'destructive' });
        return;
      }

      if (reductionQuantity === 0) {
        toast({ open: true, description: 'Você não pode vender ou usar 0 itens', variant: 'destructive' });
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
        toast({ open: true, description: 'Estoque atualizado com sucesso', variant: 'success' });
        setReductionQuantity(0)
        fetchProducts();
      } else {
        toast({ open: true, description: 'Falha ao atualizar estoque', variant: 'destructive' });
      }
    } catch (error:unknown) {
      const errorMessage = error instanceof Error ? error.message : 'Erro desconhecido';
      toast({ open: true, description: `Erro ao reduzir o estoque: ${errorMessage}`, variant: 'destructive' });
    }
  };

  interface ConfirmDialogProps {
    isOpen: boolean;
    onConfirm: () => void;
    onCancel: () => void;
    title: string;
    description: string;
  }

  const ConfirmDialog: React.FC<ConfirmDialogProps> = ({ isOpen, onConfirm, onCancel, title, description }) => {
    return (
      <Dialog open={isOpen} onOpenChange={(open) => !open && onCancel()}>
        <DialogContent>
          <DialogTitle>{title}</DialogTitle>
          <p className="text-sm text-gray-600 mt-2">{description}</p>
          <div className="flex justify-end mt-4 gap-4">
            <Button variant="outline" onClick={onCancel}>
              Cancelar
            </Button>
            <Button variant="destructive" onClick={onConfirm}>
              Confirmar
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    );
  };


  const handleDeleteProduct = async (id: string) => {
    setCurrentProductId(id);
    setConfirmDialogOpen(true);
  };

  const confirmDeleteProduct = async () => {
    if (!currentProductId) return;

    try {
      const response = await fetch(`/api/products/${currentProductId}`, {
        method: 'DELETE',
      });

      if (response.ok) {
        toast({ description: 'Produto excluído com sucesso!', variant: 'success' });
        fetchProducts();
      } else {
        toast({ description: 'Erro ao excluir o produto.', variant: 'destructive' });
      }
    } catch (error: unknown) {
      const errorMessage = error instanceof Error ? error.message : 'Erro desconhecido';
      toast({ description: `Erro ao excluir o produto: ${errorMessage}`, variant: 'destructive' });
    } finally {
      setConfirmDialogOpen(false);
      setCurrentProductId(null);
    }
  };
  

  return (
    <div className="min-h-screen w-screen bg-white flex flex-col">
      <header className="bg-blue-600 text-white py-4 px-6">
        <h1 className="text-3xl font-semibold text-center">Lista de Produtos</h1>
      </header>
      <main className="flex-grow p-6 overflow-y-auto">
     
        <div className="flex flex-col gap-4 items-center justify-center mb-6 sm:flex-row">
          <div className="grid grid-cols-2 gap-4  sm:grid-cols-3 md:grid-cols-3 lg:grid-cols-7">
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
                    <div className="flex w-52">
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
                        Vender ou Usar
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

        <ConfirmDialog
          isOpen={isConfirmDialogOpen}
          onConfirm={confirmDeleteProduct}
          onCancel={() => setConfirmDialogOpen(false)}
          title="Confirmação de Exclusão"
          description="Tem certeza que deseja excluir este produto? Esta ação não pode ser desfeita."
        />
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