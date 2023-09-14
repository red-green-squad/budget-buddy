'use client';

import { CreateExpenseModal } from '@/components/expenses/CreateExpenseModal';
import { ExpensesList } from '@/components/expenses/ExpensesList';
import { useState } from 'react';

export default function Expenses() {
  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleModalClose = () => {
    setIsModalOpen(false);
  };

  const handleCreateExpense = () => {
    setIsModalOpen(true);
  };

  return (
    <div className="h-full shadow-md sm:rounded-lg flex-1 p-4 flex flex-col">
      <div className="flex flex-col h-[15%]">
        <h1 className="mb-4 text-xl text-center">Expenses</h1>
        <button
          onClick={handleCreateExpense}
          className="bg-indigo-500 hover:bg-indigo-400 text-white rounded-md self-end px-4 py-2 my-4"
        >
          Create Expense
        </button>
      </div>
      <div className="flex flex-col h-[85%]">
        <ExpensesList />
      </div>
      <CreateExpenseModal isOpen={isModalOpen} onClose={handleModalClose} />
    </div>
  );
}
