import { uploadFilesWithCleanup } from '@/app/api/s3/s3';
import { useAsync } from '@/hooks/useAsync';
import { Expense } from '@/models/expense';
import { ExpenseSchema, ExpenseValues } from '@/zod-schema/expense';
import { zodResolver } from '@hookform/resolvers/zod';
import axios, { AxiosResponse } from 'axios';
import { FC } from 'react';
import { useForm } from 'react-hook-form';
import toast from 'react-hot-toast';
import { FileInput, FileUploader } from '../common/FileUploader';
import { Modal } from '../common/Modal';
import { ExpenseForm } from './ExpenseForm';

type CreateExpenseModal = {
  onClose(): void;
  onComplete(): Promise<void>;
};

export type CreateExpenseRequest = Omit<ExpenseValues, 'files'> & {
  files: string[];
};

export const CreateExpenseModal: FC<CreateExpenseModal> = ({
  onClose,
  onComplete,
}) => {
  const {
    register,
    getValues,
    formState: { isDirty, isValid, errors },
    setValue,
    reset,
  } = useForm<ExpenseValues>({
    resolver: zodResolver(ExpenseSchema),
    mode: 'all',
  });
  const [{ isLoading }, createExpense] = useAsync<
    AxiosResponse<Expense>,
    CreateExpenseRequest
  >({
    fn: (values) => {
      return axios.post('/api/expenses', values);
    },
    onComplete: handleCreateComplete,
    onError: handleCreateError,
  });

  async function handleCreateComplete() {
    toast.success('Successfully Created the Expense');
    await onComplete();
    handleClose();
  }

  function handleCreateError(e: Error) {
    toast.error(e.message);
  }

  const handleFormSubmit = async () => {
    try {
      const { files: inputFiles, ...data } = getValues();
      const files = inputFiles?.map((inputFile) => inputFile.file);
      let fileKeys: string[] = [];
      if (files) {
        const uploadedFiles = await uploadFilesWithCleanup(files);
        fileKeys = uploadedFiles.map((file) => file.Key!);
      }
      await createExpense({ ...data, files: fileKeys });
    } catch (error) {
      toast.error('Error while creating the Expense');
    }
  };

  const handleFilesChange = (updatedFiles: FileInput[]) => {
    setValue('files', updatedFiles, {
      shouldValidate: true,
      shouldDirty: true,
    });
  };

  const handleFileClick = (file: FileInput | string) => {
    if (typeof file !== 'string') {
      const objectURL = URL.createObjectURL(file.file);
      window.open(objectURL);
    }
  };

  const handleClose = () => {
    onClose();
    reset();
  };

  const { files } = getValues();

  return (
    <Modal
      open={true}
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
            <p>{isLoading ? 'Creating..' : 'Create'}</p>
          </button>
        </section>
      }
    >
      <ExpenseForm register={register} errors={errors} />
      <FileUploader
        files={files ?? []}
        onFilesChange={handleFilesChange}
        onFileClick={handleFileClick}
      />
    </Modal>
  );
};
