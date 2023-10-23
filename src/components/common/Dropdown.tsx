'use client';

import { isEqual } from 'lodash';
import { useEffect, useLayoutEffect, useRef, useState } from 'react';
import { AiOutlineArrowDown, AiOutlineArrowUp } from 'react-icons/ai';

export type DropdownOption<T> = {
  label: string;
  value: T;
};
export type DropdownProps<T> = {
  title: string;
  options: DropdownOption<T>[];
  value?: DropdownOption<T>;
  className?: string;
  onChange(value: DropdownOption<T>): void;
};

export const Dropdown = <T,>({
  title,
  value,
  options,
  className,
  onChange,
}: DropdownProps<T>) => {
  const [isOpen, setIsOpen] = useState<boolean>(false);
  const dropdownRef = useRef<HTMLDivElement | null>(null);
  const [dropdownWidth, setDropdownWidth] = useState<number>(120);

  const handleMenuOpen = () => {
    setIsOpen((prevState) => !prevState);
  };

  const handleClickOutside = (event: MouseEvent) => {
    if (
      dropdownRef.current &&
      !dropdownRef.current.contains(event.target as Node)
    ) {
      setIsOpen(false);
    }
  };

  const handleSelectOption = (option: DropdownOption<T>) => {
    onChange(option);
    setIsOpen(false);
  };

  useEffect(() => {
    window.addEventListener('click', handleClickOutside);

    return () => {
      window.removeEventListener('click', handleClickOutside);
    };
  }, []);

  useLayoutEffect(() => {
    if (dropdownRef.current) {
      setDropdownWidth(dropdownRef.current.offsetWidth);
    }
  }, []);

  useLayoutEffect(() => {
    function handleWindowResize() {
      if (dropdownRef.current) {
        setDropdownWidth(dropdownRef.current.offsetWidth);
      }
    }
    window.addEventListener('resize', handleWindowResize);

    return () => {
      window.removeEventListener('resize', handleWindowResize);
    };
  }, []);

  return (
    <div>
      <div
        ref={dropdownRef}
        className={`relative border-2 bg-white border-indigo-200 p-2 h-10 w-44 rounded-md hover:border-indigo-300 ${className}`}
        onClick={() => handleMenuOpen()}
      >
        <p className="absolute -top-3 text-center bg-inherit">{title}</p>
        <div className="flex justify-between">
          <p>{value?.label}</p>
          {isOpen ? (
            <AiOutlineArrowUp onClick={handleMenuOpen} />
          ) : (
            <AiOutlineArrowDown onClick={handleMenuOpen} />
          )}
        </div>
      </div>
      <div
        id="dropdown"
        style={{ width: `${dropdownWidth}px` }}
        className={`z-10 ${
          isOpen ? 'block' : 'hidden'
        } bg-white divide-y divide-gray-100 rounded-lg shadow w-44 dark:bg-gray-700 absolute`}
      >
        <ul
          className="py-2 text-sm text-gray-700 dark:text-gray-200"
          aria-labelledby="dropdownDefaultButton"
        >
          {options.map((option) => {
            const isSelected = isEqual(value, option);
            return (
              <li
                key={option.label}
                className={`block px-4 py-2 hover:bg-gray-100 hover:cursor-pointer dark:hover:bg-gray-600 dark:hover:text-white ${
                  isSelected ? 'bg-indigo-300 dark:hover:bg-indigo-300' : ''
                }`}
                onClick={() => handleSelectOption(option)}
              >
                {option.label}
              </li>
            );
          })}
        </ul>
      </div>
    </div>
  );
};
