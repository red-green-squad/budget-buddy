'use client';

import { CreateExpenseModal } from '@/components/expenses/CreateExpenseModal';
import { Table } from '@/components/expenses/Table';
import { TableToolbar } from '@/components/expenses/TableToolbar';
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
    <div className="relative overflow-hidden shadow-md sm:rounded-lg flex-1 p-4 flex flex-col">
      <h1 className="mb-4 text-xl text-center">Expenses</h1>
      <div className="flex flex-col flex-1 overflow-y-scroll gap-4">
        <TableToolbar onCreateExpense={handleCreateExpense} />
        <Table />
      </div>
      <CreateExpenseModal isOpen={isModalOpen} onClose={handleModalClose} />
    </div>
  );
}
