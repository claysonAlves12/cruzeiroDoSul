import { NextResponse } from 'next/server';
import {
  getProductById,
  updateProduct,
  deleteProduct,
} from '@/app/services/productService';

// Função auxiliar para lidar com erros
function handleError(error: unknown): string {
  return error instanceof Error ? error.message : 'Erro desconhecido';
}

// Tipo corrigido para o contexto da rota
type RouteContext = { params: Promise<{ id: string }> };

// GET: Retorna o produto pelo ID
export async function GET(req: Request, context: RouteContext) {
  let product = null; // Variável para armazenar o resultado
  try {
    const { id } = await context.params; // Aguarde a resolução do `params`

    if (!id) {
      return NextResponse.json(
        { error: 'ID do produto é obrigatório.' },
        { status: 400 }
      );
    }

    product = await getProductById(id); // Chamada da promessa

    if (!product) {
      return NextResponse.json(
        { error: 'Produto não encontrado.' },
        { status: 404 }
      );
    }

    return NextResponse.json(product); // Retorna o produto se encontrado
  } catch (error) {
    return NextResponse.json(
      { error: handleError(error) },
      { status: 500 }
    );
  } finally {
    if (product) {
      console.log(`Produto ${product.id} foi retornado com sucesso.`);
    } else {
      console.log('Nenhum produto foi encontrado ou ocorreu um erro.');
    }
    console.log('Finalização da execução da requisição GET.');
  }
}

// PUT: Atualiza um produto pelo ID
export async function PUT(req: Request, context: RouteContext) {
  try {
    const { id } = await context.params; // Aguarde a resolução do `params`
    const body = await req.json();

    if (!id) {
      return NextResponse.json(
        { error: 'ID do produto é obrigatório para atualização.' },
        { status: 400 }
      );
    }

    const updatedProduct = await updateProduct(id, body);
    return NextResponse.json(updatedProduct);
  } catch (error) {
    return NextResponse.json(
      { error: handleError(error) },
      { status: 404 }
    );
  }
}

// DELETE: Exclui um produto pelo ID
export async function DELETE(req: Request, context: RouteContext) {
  try {
    const { id } = await context.params; // Aguarde a resolução do `params`

    if (!id) {
      return NextResponse.json(
        { error: 'ID do produto é obrigatório para exclusão.' },
        { status: 400 }
      );
    }

    const deletedProduct = await deleteProduct(id);
    return NextResponse.json(deletedProduct);
  } catch (error) {
    return NextResponse.json(
      { error: handleError(error) },
      { status: 404 }
    );
  }
}
