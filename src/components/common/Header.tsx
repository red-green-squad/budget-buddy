'use client';

import Logo from '@/../public/icons/BudgetBuddy.svg';
import Image from 'next/image';
import Link from 'next/link';
import { useState } from 'react';

export const Header = () => {
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

  return (
    <nav className="bg-white sticky w-full z-20 top-0 left-0 border-b border-gray-200 ">
      <div className="max-w-screen-xl flex flex-wrap items-center justify-between mx-auto p-2">
        <Link href="/" className="flex items-center">
          <Image src={Logo} width={60} height={60} alt="BudgetBuddyLogo" />
          <span className="self-center text-2xl font-semibold whitespace-nowrap ">
            BudgetBuddy
          </span>
        </Link>
        <div className="md:flex hidden md:order-2 md:gap-8">
          <button
            type="button"
            className="text-white bg-gradient-to-r from-sky-500 to-indigo-500 hover:bg-gradient-to-r hover:from-sky-600 hover:to-indigo-600 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-4 py-2 text-center mr-3 md:mr-0 "
          >
            SignUp
          </button>
          <button
            type="button"
            className="text-white bg-gradient-to-r from-sky-500 to-indigo-500 hover:bg-gradient-to-r hover:from-sky-600 hover:to-indigo-600 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-4 py-2 text-center mr-3 md:mr-0 "
          >
            SingIn
          </button>
        </div>
        <button
          data-collapse-toggle="navbar-sticky"
          type="button"
          className="inline-flex items-center p-2 w-10 h-10 justify-center text-sm text-gray-500 rounded-lg md:hidden hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-gray-200"
          aria-controls="navbar-sticky"
          aria-expanded="false"
          onClick={() => setIsDropdownOpen((prev) => !prev)}
        >
          <span className="sr-only">Open main menu</span>
          <svg
            className="w-5 h-5"
            aria-hidden="true"
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 17 14"
          >
            <path
              stroke="currentColor"
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="M1 1h15M1 7h15M1 13h15"
            />
          </svg>
        </button>
      </div>
      <div
        id="dropdown"
        className={`md:hidden z-10 ${
          isDropdownOpen ? 'block' : 'hidden'
        } bg-white divide-y divide-gray-100 rounded-lg shadow w-full`}
      >
        <ul
          className="py-2 text-sm text-gray-800 w-full text-center"
          aria-labelledby="dropdownDefaultButton"
        >
          <li>
            <Link
              href="#"
              className="block w-full px-4 py-2 hover:bg-purple-300 "
            >
              SignUp
            </Link>
          </li>
          <li>
            <Link
              href="#"
              className="block w-full px-4 py-2 hover:bg-purple-300 "
            >
              SingIn
            </Link>
          </li>
        </ul>
      </div>
    </nav>
  );
};
