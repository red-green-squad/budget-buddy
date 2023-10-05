import { useAsync } from '@/hooks/useAsync';
import { Expense } from '@/models/expense';
import { ExpenseItem } from '@/types/expenses';
import { ExpenseSchema, ExpenseValues } from '@/zod-schema/expense';
import { zodResolver } from '@hookform/resolvers/zod';
import axios, { AxiosResponse } from 'axios';
import moment from 'moment';
import { FC } from 'react';
import { useForm } from 'react-hook-form';
import toast from 'react-hot-toast';
import { Modal } from '../common/Modal';
import { ExpenseForm } from './ExpenseForm';

type EditExpenseModalProps = {
  item: ExpenseItem;
  onClose(): void;
  onComplete(): Promise<void>;
};

export const EditExpenseModal: FC<EditExpenseModalProps> = ({
  item,
  onClose,
  onComplete,
}) => {
  const {
    register,
    getValues,
    formState: { isDirty, isValid, errors },
    reset,
  } = useForm<ExpenseValues>({
    resolver: zodResolver(ExpenseSchema),
    mode: 'all',
    defaultValues: {
      amount: item.amount,
      category: item.category,
      name: item.name,
      description: item.description,
      date: moment(item.date).format('YYYY-MM-DD') as any,
    },
  });

  const [{ isLoading }, editExpense] = useAsync<
    AxiosResponse<Expense>,
    { body: ExpenseValues; id: string }
  >({
    fn: ({ body, id }) => {
      return axios.put(`/api/expenses/${id}`, body);
    },
    onComplete: handleEditComplete,
    onError: handleEditError,
  });

  async function handleEditComplete() {
    toast.success('Successfully Edited the Expense');
    handleClose();
    await onComplete();
  }

  function handleEditError(e: Error) {
    toast.error(e.message);
  }

  const handleFormSubmit = async () => {
    const data = getValues();
    await editExpense({ body: data, id: item.id });
  };

  const handleClose = () => {
    reset();
    onClose();
  };

  return (
    <Modal
      open={true}
      header={
        <div className="flex text-2xl justify-center p-4">
          <h1>Edit Expense</h1>
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
            <p>{isLoading ? 'Editing..' : 'Edit'}</p>
          </button>
        </section>
      }
    >
      <ExpenseForm register={register} errors={errors} />
    </Modal>
  );
};
