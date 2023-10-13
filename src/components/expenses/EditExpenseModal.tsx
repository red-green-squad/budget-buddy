import {
  deleteObjects,
  getPresignedURL,
  uploadFilesWithCleanup,
} from '@/app/api/s3/s3';
import { useAsync } from '@/hooks/useAsync';
import { Expense } from '@/models/expense';
import { ExpenseItem } from '@/types/expenses';
import {
  EditExpenseSchema,
  EditExpenseValues,
  ExpenseValues,
} from '@/zod-schema/expense';
import { zodResolver } from '@hookform/resolvers/zod';
import axios, { AxiosResponse } from 'axios';
import moment from 'moment';
import { FC, useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import toast from 'react-hot-toast';
import { FileInput, FileUploader } from '../common/FileUploader';
import { Loader } from '../common/Loader';
import { Modal } from '../common/Modal';
import { ExpenseForm } from './ExpenseForm';

type EditExpenseModalProps = {
  item: ExpenseItem;
  onClose(): void;
  onComplete(): Promise<void>;
};

export type EditExpenseRequest = Omit<ExpenseValues, 'files'> & {
  files: string[];
};

export const EditExpenseModal: FC<EditExpenseModalProps> = ({
  item,
  onClose,
  onComplete,
}) => {
  const [signedURLMap, setSignedURLMap] = useState<Record<string, string>>({});
  const [previousFiles, setPreviousFiles] = useState<string[]>(item.files);

  const {
    register,
    getValues,
    setValue,
    formState: { isDirty, isValid, errors },
    reset,
  } = useForm<EditExpenseValues>({
    resolver: zodResolver(EditExpenseSchema),
    mode: 'all',
    defaultValues: {
      amount: item.amount,
      category: item.category,
      name: item.name,
      description: item.description,
      date: moment(item.date).format('YYYY-MM-DD') as any,
    },
  });

  const [{ isLoading: isPresignedURLLoading }, getPreSignedURLs] = useAsync<
    string[],
    unknown
  >({
    fn: async () => {
      const fileKeys = item.files;
      const signedURLs = await getPresignedURL(fileKeys, 36000);
      const urlMap = signedURLs.reduce<Record<string, string>>(
        (prevVal, currentVal, index) => {
          prevVal[fileKeys[index]] = currentVal;
          return prevVal;
        },
        {}
      );
      setSignedURLMap(urlMap);
      return signedURLs;
    },
  });

  const [{ isLoading }, editExpense] = useAsync<
    AxiosResponse<Expense>,
    { body: EditExpenseRequest; id: string }
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
    const { files, ...data } = getValues();
    const deletedFiles = item.files.filter((file) => {
      return !previousFiles.includes(file);
    });
    if (deletedFiles.length > 0) {
      await deleteObjects(deletedFiles.map((file) => ({ Key: file })));
    }
    let updatedFiles = previousFiles;
    if (files && files.length > 0) {
      const fileInputs = files.map((fileInput) => fileInput.file);
      const newFileKeys = await uploadFilesWithCleanup(fileInputs);
      updatedFiles = updatedFiles.concat(newFileKeys.map((file) => file.Key!));
    }
    await editExpense({ body: { ...data, files: updatedFiles }, id: item.id });
  };

  const handleClose = () => {
    reset();
    onClose();
  };

  useEffect(() => {
    getPreSignedURLs({});
  }, []);

  const handleFilesChange = (updatedFiles: (FileInput | string)[]) => {
    const newFiles = updatedFiles.filter(
      (file) => typeof file !== 'string'
    ) as FileInput[];
    setValue('files', newFiles, {
      shouldValidate: true,
      shouldDirty: true,
    });

    const previouslySelectedFiles = updatedFiles.filter(
      (file) => typeof file === 'string'
    ) as string[];
    setPreviousFiles(previouslySelectedFiles);
  };

  const handleFileClick = (file: FileInput | string) => {
    if (typeof file !== 'string') {
      const objectURL = URL.createObjectURL(file.file);
      window.open(objectURL);
    } else {
      const url = signedURLMap[file];
      window.open(url);
    }
  };

  const uploadedFiles = getValues().files ?? [];
  const allFiles = [...uploadedFiles, ...previousFiles];

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
      {isPresignedURLLoading && <Loader />}
      {!isPresignedURLLoading && (
        <>
          <ExpenseForm register={register} errors={errors} />
          <FileUploader
            files={allFiles}
            onFileClick={handleFileClick}
            onFilesChange={handleFilesChange}
          />
        </>
      )}
    </Modal>
  );
};
