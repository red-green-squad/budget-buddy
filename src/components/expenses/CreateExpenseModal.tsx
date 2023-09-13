import { useAsync } from '@/hooks/useAsync';
import { Expense } from '@/models/expense';
import { ExpenseSchema, ExpenseValues } from '@/zod-schema/expense';
import { zodResolver } from '@hookform/resolvers/zod';
import axios, { AxiosResponse } from 'axios';
import { FC } from 'react';
import { useForm } from 'react-hook-form';
import { Modal } from '../common/Modal';
import { ExpenseForm } from './ExpenseForm';
import toast from 'react-hot-toast';

type CreateExpenseModal = {
  isOpen: boolean;
  onClose(): void;
};

export const CreateExpenseModal: FC<CreateExpenseModal> = ({
  isOpen,
  onClose,
}) => {
  const {
    register,
    getValues,
    formState: { isDirty, isValid, errors },
    reset,
  } = useForm<ExpenseValues>({
    resolver: zodResolver(ExpenseSchema),
    mode: 'all',
  });
  const [{ isLoading }, createExpense] = useAsync<
    AxiosResponse<Expense>,
    ExpenseValues
  >({
    fn: (values) => {
      return axios.post('/api/expenses', values);
    },
    onComplete: handleCreateComplete,
    onError: handleCreateError,
  });

  function handleCreateComplete() {
    toast.success('Successfully Created the Expense');
    handleClose();
  }

  function handleCreateError(e: Error) {
    toast.error(e.message);
  }

  const handleFormSubmit = async () => {
    const data = getValues();
    await createExpense(data);
  };

  const handleClose = () => {
    onClose();
    reset();
  };

  return (
    <Modal
      open={isOpen}
      header={
        <div className="flex text-2xl justify-center p-4">
          <h1>Create Expense</h1>
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
            disabled={!isDirty || !isValid}
            className="p-2 flex-1 h-12 rounded-xl disabled:bg-gray-400 bg-indigo-500 text-white items-center hover:bg-indigo-600"
            onClick={() => handleFormSubmit()}
          >
            <p>{isLoading ? 'Signing Up...' : 'Sign Up'}</p>
          </button>
        </section>
      }
    >
      <ExpenseForm register={register} errors={errors} />
    </Modal>
  );
};
