import { FC, PropsWithChildren, ReactNode } from 'react';

type ModalProps = PropsWithChildren & {
  open: boolean;
  header?: ReactNode;
  footer?: ReactNode;
};

export const Modal: FC<ModalProps> = ({
  children,
  header,
  footer,
  open = true,
}) => {
  if (!open) return null;
  return (
    <div className="absolute z-30 overflow-hidden h-full p-[5%] w-full backdrop-blur-sm left-0 top-0 bg-indigo-200 bg-opacity-5">
      <div className="relative h-full overflow-scroll flex-col box-border rounded-lg md:w-2/3 md:mx-auto lg:w-1/2">
        {header && (
          <div className="flex-2 sticky top-0 z-10 bg-white shadow-md">
            {header}
          </div>
        )}
        <div className="flex-4 bg-white">{children}</div>
        {footer && (
          <div className="flex-2 sticky bottom-0 z-10 bg-white shadow-inner">
            {footer}
          </div>
        )}
      </div>
    </div>
  );
};
