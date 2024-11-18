import { NextResponse } from 'next/server';
import { getProductById, updateProduct } from '@/app/services/productService';

// Função GET para buscar produto por ID
export async function GET(req: Request, { params }: { params: { id: string } }) {
  try {
    const id = parseInt(params.id, 10);
    if (isNaN(id)) {
      return NextResponse.json({ error: 'ID inválido.' }, { status: 400 });
    }

    const product = await getProductById(id);
    return NextResponse.json(product);
  } catch (error: unknown) {
    const errorMessage = error instanceof Error ? error.message : 'Erro desconhecido';
    return NextResponse.json({ error: errorMessage }, { status: 404 });
  }
}

export async function PUT(req: Request, { params }: { params: { id: string } }) {
  try {
    const id = parseInt(params.id, 10);
    if (isNaN(id)) {
      return NextResponse.json({ error: 'ID inválido.' }, { status: 400 });
    }

    const productToUpdate = await getProductById(id);
    if (!productToUpdate) {
      return NextResponse.json({ error: 'Produto não encontrado.' }, { status: 404 });
    }

    const body = await req.json();
    const updatedProduct = await updateProduct(id, body); // Atualiza o produto usando o serviço

    return NextResponse.json(updatedProduct);
  } catch (error: unknown) {
    const errorMessage = error instanceof Error ? error.message : 'Erro desconhecido';
    return NextResponse.json({ error: errorMessage }, { status: 500 });
  }
}