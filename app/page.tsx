'use client'

import { useRouter } from 'next/navigation';
import React, { useState } from 'react';

export default function Home() {
  const [email, setEmail] = useState('');
  const [senha, setSenha] = useState('');
  const router = useRouter();

  // O tipo correto para eventos de formulários é React.FormEvent
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    alert(`Login realizado com: ${email}`);
  };

  return (
    <div className="flex justify-center items-center min-h-screen bg-red-100">
      <div className="w-full max-w-md p-8 bg-white rounded-lg shadow-lg">
        <h1 className="text-2xl font-semibold text-center text-gray-700 mb-6">Controle de Estoque</h1>

        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label htmlFor="email" className="block text-sm font-medium text-gray-600">Email</label>
            <input
              type="email"
              id="email"
              className="w-full p-3 mt-1 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Digite seu e-mail"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>

          <div className="mb-6">
            <label htmlFor="senha" className="block text-sm font-medium text-gray-600">Senha</label>
            <input
              type="password"
              id="senha"
              className="w-full p-3 mt-1 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Digite sua senha"
              value={senha}
              onChange={(e) => setSenha(e.target.value)}
              required
            />
          </div>

          <button
            type="submit"
            className="w-full py-3 bg-blue-600 text-white font-medium rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            Entrar
          </button>

          <button
            onClick={() => router.push(`/produtos`)}
            className="px-3 py-1 text-white bg-orange-500 rounded-md hover:bg-orange-600 transition duration-300 w-full"
          >
            Produto test
          </button>
        </form>
      </div>
    </div>
  );
}
