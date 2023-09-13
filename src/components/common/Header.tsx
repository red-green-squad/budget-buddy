'use client';

import Logo from '@/../public/icons/BudgetBuddy.svg';
import { signOut, useSession } from 'next-auth/react';
import Image from 'next/image';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { GoSignOut } from 'react-icons/go';

export const Header = () => {
  const router = useRouter();
  const { status } = useSession();

  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

  const handleSignIn = () => {
    setIsDropdownOpen((prev) => !prev);
    router.push('/signin');
  };

  const handleSignUp = () => {
    setIsDropdownOpen((prev) => !prev);
    router.push('/signup');
  };

  const handleSignOut = async () => {
    await signOut({ redirect: true });
  };

  return (
    <nav className="bg-white sticky w-full z-20 top-0 left-0 border-b border-gray-200 ">
      <div className="max-w-screen-xl flex flex-wrap items-center justify-between mx-auto p-2">
        <Link href="/" className="flex items-center">
          <Image src={Logo} width={60} height={60} alt="BudgetBuddyLogo" />
          <span className="self-center text-2xl font-semibold whitespace-nowrap ">
            BudgetBuddy
          </span>
        </Link>
        {status === 'unauthenticated' && (
          <div className="md:flex hidden md:order-2 md:gap-8">
            <button
              onClick={handleSignUp}
              className="text-white bg-gradient-to-r from-sky-500 to-indigo-500 hover:bg-gradient-to-r hover:from-sky-600 hover:to-indigo-600 focus:ring-2 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-4 py-2 text-center mr-3 md:mr-0 "
            >
              SignUp
            </button>
            <button
              onClick={handleSignIn}
              className="text-white bg-gradient-to-r from-sky-500 to-indigo-500 hover:bg-gradient-to-r hover:from-sky-600 hover:to-indigo-600 focus:ring-2 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-4 py-2 text-center mr-3 md:mr-0 "
            >
              SingIn
            </button>
          </div>
        )}
        {status === 'authenticated' && (
          <div className="md:flex hidden md:order-2 md:gap-8">
            <Link
              href={'/expenses'}
              className="text-white bg-gradient-to-r from-sky-500 to-indigo-500 hover:bg-gradient-to-r hover:from-sky-600 hover:to-indigo-600 focus:ring-2 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-4 py-2 text-center mr-3 md:mr-0 "
            >
              Expenses
            </Link>
            <Link
              href={'dashboard'}
              className="text-white bg-gradient-to-r from-sky-500 to-indigo-500 hover:bg-gradient-to-r hover:from-sky-600 hover:to-indigo-600 focus:ring-2 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-4 py-2 text-center mr-3 md:mr-0 "
            >
              Dashboard
            </Link>
            <button
              onClick={handleSignOut}
              className="flex items-center gap-2 text-white bg-gradient-to-r from-sky-500 to-indigo-500 hover:bg-gradient-to-r hover:from-sky-600 hover:to-indigo-600 focus:ring-2 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-4 py-2 text-center mr-3 md:mr-0 "
            >
              <GoSignOut />
              <span> SignOut</span>
            </button>
          </div>
        )}
        {status === 'loading' && (
          <div role="status" className="max-w-sm animate-pulse">
            <div className="h-2 bg-gray-200 rounded-full max-w-[360px] mb-2.5"></div>
            <div className="h-2.5 bg-gray-200 rounded-full w-48 mb-4"></div>
            <div className="h-2 bg-gray-200 rounded-full mb-2.5"></div>
          </div>
        )}
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
      {
        <div
          id="dropdown"
          className={`md:hidden z-10 ${
            isDropdownOpen ? 'block' : 'hidden'
          } bg-white divide-y divide-gray-100 rounded-lg shadow w-full`}
        >
          {status === 'authenticated' ? (
            <ul
              className="py-2 text-sm text-gray-800 w-full text-center flex flex-col items-center"
              aria-labelledby="dropdownDefaultButton"
            >
              <li>
                <button
                  onClick={handleSignIn}
                  className="block w-full px-4 py-2 hover:bg-purple-300 "
                >
                  Dashboard
                </button>
              </li>
              <li>
                <button
                  onClick={handleSignUp}
                  className="block w-full px-4 py-2 hover:bg-purple-300 "
                >
                  Expenses
                </button>
              </li>
              <li>
                <button
                  onClick={handleSignOut}
                  className="flex items-center gap-2 w-full px-4 py-2 hover:bg-purple-300 "
                >
                  <GoSignOut />
                  <span> SignOut</span>
                </button>
              </li>
            </ul>
          ) : (
            status === 'unauthenticated' && (
              <ul
                className="py-2 text-sm text-gray-800 w-full text-center"
                aria-labelledby="dropdownDefaultButton"
              >
                <li>
                  <button
                    onClick={handleSignUp}
                    className="block w-full px-4 py-2 hover:bg-purple-300 "
                  >
                    SignUp
                  </button>
                </li>
                <li>
                  <button
                    onClick={handleSignIn}
                    className="block w-full px-4 py-2 hover:bg-purple-300 "
                  >
                    SingIn
                  </button>
                </li>
              </ul>
            )
          )}
        </div>
      }
    </nav>
  );
};
