import { db } from '@/lib/db/firebase';
import { collection, getDocs, addDoc, where, query, deleteDoc } from 'firebase/firestore';

// Handle GET requests
export async function GET() {
  try {
    const categoriesSnapshot = await getDocs(collection(db, 'categories'));
    const categories = categoriesSnapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    }));
    return new Response(JSON.stringify({ categories }), { status: 200 });
  } catch (error) {
    return new Response(JSON.stringify({ error: 'Internal Server Error', details: String(error)}), { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { name } = body;

    if (!name) {
      return new Response(JSON.stringify({ error: 'Name is required' }), { status: 400 });
    }

    const categoriesRef = collection(db, 'categories');
    const q = query(categoriesRef, where('name', '==', name));
    const querySnapshot = await getDocs(q);

    if (!querySnapshot.empty) {
      return new Response(
        JSON.stringify({ error: 'Já existe uma categoria com esse nome' }),
        { status: 400 }
      );
    }

    const docRef = await addDoc(categoriesRef, { name });
    return new Response(JSON.stringify({ id: docRef.id, name }), { status: 201 });
  } catch (error) {
    return new Response(JSON.stringify({ error: 'Internal Server Error', details: String(error) }), { status: 500 });
  }
}

export async function DELETE(req: Request) {
  try {
    const body = await req.json();
    const { name } = body;

    if (!name) {
      return new Response(JSON.stringify({ error: 'Name is required to delete category' }), { status: 400 });
    }

    const productsRef = collection(db, 'products');
    const productsQuery = query(productsRef, where('category', '==', name));
    const productsSnapshot = await getDocs(productsQuery);

    if (!productsSnapshot.empty) {
      return new Response(
        JSON.stringify({ error: 'Não é possivel excluir a categoria, porque ela está associada a produtos existentes' }),
        { status: 400 }
      );
    }

    const categoriesRef = collection(db, 'categories');
    const categoryQuery = query(categoriesRef, where('name', '==', name));
    const categorySnapshot = await getDocs(categoryQuery);

    if (categorySnapshot.empty) {
      return new Response(JSON.stringify({ error: 'Category not found' }), { status: 404 });
    }

    const batchDeletePromises = categorySnapshot.docs.map((doc) => deleteDoc(doc.ref));
    await Promise.all(batchDeletePromises);

    return new Response(JSON.stringify({ message: 'Category deleted successfully' }), { status: 200 });
  } catch (error) {
    return new Response(JSON.stringify({ error: 'Internal Server Error', details: String(error) }), { status: 500 });
  }
}