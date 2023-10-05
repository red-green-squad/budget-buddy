import { useAsync } from '@/hooks/useAsync';
import { Expense } from '@/models/expense';
import { ExpenseItem } from '@/types/expenses';
import axios, { AxiosResponse } from 'axios';
import { FC } from 'react';
import toast from 'react-hot-toast';
import { Modal } from '../common/Modal';

type DeleteExpensesModalProps = {
  items: ExpenseItem[];
  onClose(): void;
  onComplete(): Promise<void>;
};

export const DeleteExpensesModal: FC<DeleteExpensesModalProps> = ({
  items,
  onClose,
  onComplete,
}) => {
  const [{ isLoading }, deleteExpenses] = useAsync<AxiosResponse<Expense>, any>(
    {
      fn: () => {
        return axios.delete(`/api/expenses`, {
          data: items.map((item) => item.id),
          headers: {
            'Content-Type': 'application/json',
          },
        });
      },
      onComplete: handleDeleteComplete,
      onError: handleDeleteError,
    }
  );

  async function handleDeleteComplete() {
    toast.success('Successfully Edited the Expense');
    handleClose();
    await onComplete();
  }

  function handleDeleteError(e: Error) {
    toast.error(e.message);
  }

  const handleDelete = async () => {
    await deleteExpenses({});
  };

  const handleClose = () => {
    onClose();
  };

  return (
    <Modal
      open={true}
      header={
        <div className="flex text-2xl justify-center p-4">
          <h1>Delete Expenses</h1>
        </div>
      }
      footer={
        <section className="flex flex-row justify-between mx-[5%] p-4 gap-4">
          <button
            type="button"
            className="p-2 flex-1 h-12 rounded-xl disabled:bg-gray-400 bg-gray-500 text-white items-center hover:bg-gray-600"
            onClick={handleClose}
          >
            <p>Cancel</p>
          </button>
          <button
            type="submit"
            className="p-2 flex-1 h-12 rounded-xl disabled:bg-gray-400 bg-red-500 text-white items-center hover:bg-indigo-600"
            onClick={handleDelete}
          >
            <p>{isLoading ? 'Deleting..' : 'Delete'}</p>
          </button>
        </section>
      }
    >
      <p className="text-xl p-8">{`Are you sure to delete ${items.length} Expenses?`}</p>
      <p className="text-lg p-10">
        This action can not be undone. Check before performing
      </p>
    </Modal>
  );
};
