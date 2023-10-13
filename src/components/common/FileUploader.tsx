'use client';
import { FC } from 'react';
import { useDropzone } from 'react-dropzone';
import { MdClose } from 'react-icons/md';
import { v4 as uuid } from 'uuid';

export type FileInput = {
  id: string;
  file: File;
};

type FileUploaderProps = {
  files: (FileInput | string)[];
  onFilesChange(updatedFiles: (FileInput | string)[]): void;
  onFileClick(file: FileInput | string): void;
};

export const FileUploader: FC<FileUploaderProps> = ({
  files,
  onFilesChange,
  onFileClick,
}) => {
  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    accept: {
      'image/*': [],
    },
    onDrop: (acceptedFiles: File[]) => {
      const updatedFiles = files.concat(
        acceptedFiles.map((file) => ({
          id: uuid(),
          file,
        }))
      );
      onFilesChange(updatedFiles);
    },
  });

  const handleRemoveFile = (fileId: string) => {
    const updatedFiles = files.concat([]);
    const removedFileIndex = updatedFiles.findIndex((inputFile) => {
      const id = typeof inputFile === 'string' ? inputFile : inputFile.id;
      return id === fileId;
    });
    if (removedFileIndex !== -1) {
      updatedFiles.splice(removedFileIndex, 1);
      onFilesChange(updatedFiles);
    }
  };

  const thumbs = files.map((file) => {
    const id = typeof file === 'string' ? file : file.id;
    return (
      <div className="flex items-center justify-center flex-row gap-2" key={id}>
        <p className="hover:cursor-pointer" onClick={() => onFileClick(file)}>
          {typeof file === 'string' ? file : file.file.name}
        </p>
        <MdClose
          color="#D1041B"
          className={'bg-gray-400 rounded-lg hover:cursor-pointer'}
          onClick={() => handleRemoveFile(id)}
        />
      </div>
    );
  });

  return (
    <div className="p-4 flex flex-col gap-8">
      <p>Attachments</p>
      <div
        {...getRootProps()}
        className="p-8 border-gray-100 border-solid text-center border-2"
      >
        <input {...getInputProps()} />
        {isDragActive ? (
          <p>Drop the files here ...</p>
        ) : (
          <p>{"Drag'n drop some files here, or click to select files"}</p>
        )}
      </div>
      <div className="flex flex-row justify-center flex-wrap p-4 gap-4">
        {thumbs}
      </div>
    </div>
  );
};
