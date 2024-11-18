/* import { NextResponse } from 'next/server';
import { initializeUserDB } from '@/app/lib/t'; // Importa o DB dos users

// GET: Retorna todos os users
export async function GET() {
  const userDb = await initializeUserDB();
  return NextResponse.json(userDb.data?.users || []);
}

// POST: Adiciona um novo user
export async function POST(req: Request) {
  const userDb = await initializeUserDB();
  const body = await req.json();
  const { name } = body;

  if (!name) {
    return NextResponse.json(
      { error: 'Name is required' },
      { status: 400 }
    );
  }

  const newUser = {
    id: userDb.data?.users.length ? userDb.data.users[userDb.data.users.length - 1].id + 1 : 1,
    name,
  };

  userDb.data?.users.push(newUser);
  await userDb.write();

  return NextResponse.json(newUser, { status: 201 });
}

export async function PUT(req: Request) {
  const userDb = await initializeUserDB();
  const body = await req.json();
  const { id, name } = body;

  const userIndex = userDb.data?.users.findIndex(user => user.id === id);

  if (userIndex === -1) {
    return NextResponse.json({ error: 'User not found' }, { status: 404 });
  }

  if (!name) {
    return NextResponse.json({ error: 'Name is required' }, { status: 400 });
  }

  // Atualiza o usuário
  userDb.data.users[userIndex!].name = name;
  await userDb.write();

  return NextResponse.json(userDb.data?.users[userIndex!], { status: 200 });
}

export async function DELETE(req: Request) {
  const userDb = await initializeUserDB();
  const { id } = await req.json();

  const userIndex = userDb.data?.users.findIndex(user => user.id === id);

  if (userIndex === -1) {
    return NextResponse.json({ error: 'User not found' }, { status: 404 });
  }

  // Exclui o usuário
  const deletedUser = userDb.data?.users.splice(userIndex!, 1);
  await userDb.write();

  return NextResponse.json(deletedUser, { status: 200 });
}
 */