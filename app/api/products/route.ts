import { NextResponse } from 'next/server';
import {
  getProductById,
  addProduct,
  updateProduct,
  deleteProduct,
} from '@/app/services/productService';

// Função auxiliar para lidar com erros
function handleError(error: unknown): string {
  if (error instanceof Error) {
    return error.message;
  }
  return 'Erro desconhecido';
}

// GET: Retorna o produto pelo ID
export async function GET(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params; // Resolva a promessa para obter o ID

    if (!id) {
      return NextResponse.json(
        { error: 'ID do produto é obrigatório.' },
        { status: 400 }
      );
    }

    const product = await getProductById(id); // Busca o produto pelo ID

    if (!product) {
      return NextResponse.json(
        { error: 'Produto não encontrado.' },
        { status: 404 }
      );
    }

    return NextResponse.json(product); // Retorna o produto em formato JSON
  } catch (error) {
    return NextResponse.json(
      { error: handleError(error) },
      { status: 500 }
    );
  }
}

// POST: Adiciona um novo produto
export async function POST(req: Request) {
  try {
    const body = await req.json();
    const newProduct = await addProduct(body);
    return NextResponse.json(newProduct, { status: 201 });
  } catch (error: unknown) {
    return NextResponse.json(
      { error: handleError(error) },
      { status: 400 }
    );
  }
}

// PUT: Atualiza um produto existente
export async function PUT(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params; // Resolva a promessa para obter o ID
    const body = await req.json();

    if (!id) {
      return NextResponse.json(
        { error: 'ID do produto é obrigatório para atualização.' },
        { status: 400 }
      );
    }

    const updatedProduct = await updateProduct(id, body);
    return NextResponse.json(updatedProduct);
  } catch (error: unknown) {
    return NextResponse.json(
      { error: handleError(error) },
      { status: 404 }
    );
  }
}

// DELETE: Exclui um produto
export async function DELETE(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params; // Resolva a promessa para obter o ID

    if (!id) {
      return NextResponse.json(
        { error: 'ID do produto é obrigatório para exclusão.' },
        { status: 400 }
      );
    }

    const deletedProduct = await deleteProduct(id);
    return NextResponse.json(deletedProduct);
  } catch (error: unknown) {
    return NextResponse.json(
      { error: handleError(error) },
      { status: 404 }
    );
  }
}
