import { NextResponse } from 'next/server';
import { addProduct, updateProduct, deleteProduct, getAllProducts, getProductById } from '@/app/services/productService';

// Função auxiliar para lidar com erros
function handleError(error: unknown) {
  // Verifica se o erro é uma instância de Error
  if (error instanceof Error) {
    return error.message; // Retorna a mensagem do erro
  }
  return 'Erro desconhecido'; // Caso contrário, retorna uma mensagem padrão
}

// GET: Retorna todos os produtos
export async function GET() {
  try {
    const products = await getAllProducts();
    return NextResponse.json(products);
  } catch (error: unknown) {
    const errorMessage = handleError(error);
    return NextResponse.json({ error: errorMessage }, { status: 500 });
  }
}

// POST: Adiciona um novo produto
export async function POST(req: Request) {
  try {
    const body = await req.json();
    console.log(body, 'itens recebidos')
    const newProduct = await addProduct(body);
    return NextResponse.json(newProduct, { status: 201 });
  } catch (error: unknown) {
    const errorMessage = handleError(error);
    return NextResponse.json({ error: errorMessage }, { status: 400 });
  }
}

// PUT: Atualiza um produto existente
export async function PUT(req: Request) {
  try {
    const body = await req.json();
    const { id, ...updatedProduct } = body;
    const updated = await updateProduct(id, updatedProduct);
    return NextResponse.json(updated);
  } catch (error: unknown) {
    const errorMessage = handleError(error);
    return NextResponse.json({ error: errorMessage }, { status: 404 });
  }
}

// DELETE: Exclui um produto
export async function DELETE(req: Request) {
  try {
    const { id } = await req.json();
    const deletedProduct = await deleteProduct(id);
    return NextResponse.json(deletedProduct);
  } catch (error: unknown) {
    const errorMessage = handleError(error);
    return NextResponse.json({ error: errorMessage }, { status: 404 });
  }
}
