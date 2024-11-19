'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useToast } from "@/hooks/use-toast";
import CreateCategoryForm from './createCategoryForm';
import CreateProductForm from './createProductForm';

const ProductManager = () => {
  const router = useRouter();
  const { toast } = useToast();
  const [isCreatingCategory, setIsCreatingCategory] = useState(false);
  const [newCategoryName, setNewCategoryName] = useState('');
  const [categories, setCategories] = useState<string[]>([]);
  const [product, setProduct] = useState({
    name: '',
    codIdentification: '',
    description: '',
    stock: 0,
    price: '',
    category: '',
    imageUrl: '',
  });

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const res = await fetch('/api/products/categories');
        if (res.ok) {
          const data = await res.json();
          setCategories(data.categories.map((cat: { name: string }) => cat.name));
        } else {
          throw new Error('Failed to fetch categories');
        }
      } catch (error: unknown) {
        const errorMessage = error instanceof Error ? error.message : 'Erro desconhecido';
        toast({ open: true, description: `Erro ao carregar categorias: ${errorMessage}`, variant: 'destructive' });
      }
      
    };
    fetchCategories();
  },[toast] );

  const handleProductChange = (key: keyof typeof product, value: string | number) => {
    if (key === "category" && value === "new") {
      setIsCreatingCategory(true);
    } else {
      setProduct({ ...product, [key]: value });
    }
  };
  
  
  const handleCategorySave = async () => {
    if (!newCategoryName.trim()) {
      toast({ open: true, description: 'Por favor, insira o nome da categoria.', variant: 'destructive' });
      return;
    }

    try {
      const res = await fetch('/api/products/categories', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name: newCategoryName }),
      });

      if (!res.ok) {
        const errorData = await res.json(); 
        throw new Error(errorData.error || 'Erro ao criar categoria'); 
      }

      const data = await res.json();
      setCategories((prev) => [...prev, data.name]);
      setNewCategoryName('');
      setIsCreatingCategory(false);
      toast({ open: true, description: 'Categoria criada com sucesso!', variant: 'success' });
    } catch (error:unknown) {
      const errorMessage = error instanceof Error ? error.message : 'Erro desconhecido';
      toast({ open: true, description: `Erro ao criar categoria: ${errorMessage}`, variant: 'destructive' });
    }
  };

  const handleCategoryDelete = async (categoryName: string) => {
    try {
      const res = await fetch('/api/products/categories', {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name: categoryName }),
      });

      if (!res.ok) {
        const errorData = await res.json(); 
        throw new Error(errorData.error || 'Erro ao excluir categoria'); 
      }

      setCategories((prev) => prev.filter((cat) => cat !== categoryName));
      setProduct((prev) => ({ ...prev, category: '' })); // Reset category if the deleted one was selected
      toast({ open: true, description: 'Categoria excluída com sucesso!', variant: 'success' });
    } catch (error:unknown) {
      const errorMessage = error instanceof Error ? error.message : 'Erro desconhecido';
      toast({ open: true, description: `Erro ao excluir categoria: ${errorMessage}`, variant: 'destructive' });
    }
  };

  const handleProductSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      const productData = { ...product};

      const res = await fetch('/api/products', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(productData),
      });

      if (res.ok) {
        toast({ open: true, description: 'Produto criado com sucesso!', variant: 'success' });
        router.push('/produtos');
      } else {
        const error = await res.json();
        toast({ open: true, description: error.error || 'Erro ao criar produto', variant: 'destructive' });
      }
    } catch (error:unknown) {
      const errorMessage = error instanceof Error ? error.message : 'Erro desconhecido';
      toast({ open: true, description: `error ao criar o produto: ${errorMessage}`, variant: 'destructive' });
    }
  };

  const backProductHome = async() =>{
    router.push('/produtos')
  }

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
      {isCreatingCategory ? (
        <CreateCategoryForm
          newCategoryName={newCategoryName}
          setNewCategoryName={setNewCategoryName}
          onSave={handleCategorySave}
          onCancel={() => setIsCreatingCategory(false)}
        />
      ) : (
        <CreateProductForm
          product={product}
          categories={categories}
          onProductChange={handleProductChange}
          onSubmit={handleProductSubmit}
          onDeleteCategory={handleCategoryDelete}
          onCreatingCategory={setIsCreatingCategory}
          onBackProductHome={backProductHome}
        />
      )}
    </div>
  );
};

export default ProductManager;