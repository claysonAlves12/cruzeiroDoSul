import { NextResponse } from 'next/server';
import {
  addProduct,
  updateProduct,
  deleteProduct,
  getAllProducts,
} from '@/app/services/productService';

// Função auxiliar para lidar com erros
function handleError(error: unknown): string {
  return error instanceof Error ? error.message : 'Erro desconhecido';
}

// GET: Retorna todos os produtos
export async function GET() {
  try {
    const products = await getAllProducts(); // Busca todos os produtos
    return NextResponse.json(products); // Retorna os produtos
  } catch (error: unknown) {
    const errorMessage = handleError(error);
    return NextResponse.json({ error: errorMessage }, { status: 500 }); // Erro de servidor
  }
}

// POST: Adiciona um novo produto
export async function POST(req: Request) {
  try {
    const body = await req.json(); // Lê o corpo da requisição
    const newProduct = await addProduct(body); // Adiciona o novo produto
    return NextResponse.json(newProduct, { status: 201 }); // Retorna o produto criado
  } catch (error: unknown) {
    const errorMessage = handleError(error);
    return NextResponse.json({ error: errorMessage }, { status: 400 }); // Erro de validação
  }
}

// PUT: Atualiza um produto existente
export async function PUT(req: Request) {
  try {
    const body = await req.json(); // Lê o corpo da requisição
    const { id, ...updatedProduct } = body; // Extrai o ID e os dados atualizados

    if (!id) {
      return NextResponse.json(
        { error: 'ID do produto é obrigatório para atualização.' },
        { status: 400 }
      );
    }

    const updated = await updateProduct(id, updatedProduct); // Atualiza o produto
    return NextResponse.json(updated); // Retorna o produto atualizado
  } catch (error: unknown) {
    const errorMessage = handleError(error);
    return NextResponse.json({ error: errorMessage }, { status: 404 }); // Produto não encontrado
  }
}

// DELETE: Exclui um produto
export async function DELETE(req: Request) {
  try {
    const { id } = await req.json(); // Lê o ID do corpo da requisição

    if (!id) {
      return NextResponse.json(
        { error: 'ID do produto é obrigatório para exclusão.' },
        { status: 400 }
      );
    }

    const deletedProduct = await deleteProduct(id); // Exclui o produto
    return NextResponse.json(deletedProduct); // Retorna o produto excluído
  } catch (error: unknown) {
    const errorMessage = handleError(error);
    return NextResponse.json({ error: errorMessage }, { status: 404 }); // Produto não encontrado
  }
}
