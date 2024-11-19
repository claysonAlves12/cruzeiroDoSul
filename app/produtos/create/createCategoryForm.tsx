'use client';

import React from 'react';

interface CreateCategoryFormProps {
  newCategoryName: string;
  setNewCategoryName: (value: string) => void;
  onSave: () => void;
  onCancel: () => void;
}

const CreateCategoryForm: React.FC<CreateCategoryFormProps> = ({
  newCategoryName,
  setNewCategoryName,
  onSave,
  onCancel,
}) => {
  return (
    <div className='max-w-lg w-full'>
      <h1 className="text-3xl font-bold text-center text-blue-500 mb-6">Criar Categoria</h1>
      <input
        type="text"
        placeholder="Nome da Categoria"
        value={newCategoryName}
        onChange={(e) => setNewCategoryName(e.target.value)}
        className="w-full px-4 py-2 mb-4 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
        required
      />
      <div className="flex gap-2">
        <button
          onClick={onSave}
          className="w-full bg-green-600 text-white px-6 py-2 rounded-md font-semibold hover:bg-green-700 transition duration-300"
        >
          Salvar Categoria
        </button>
        <button
          onClick={onCancel}
          className="w-full bg-gray-300 text-gray-800 px-6 py-2 rounded-md font-semibold hover:bg-gray-400 transition duration-300"
        >
          Cancelar
        </button>
      </div>
    </div>
  );
};

export default CreateCategoryForm;