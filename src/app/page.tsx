'use client';

import Intro from '@/../public/icons/Intro.svg';
import { useSession } from 'next-auth/react';
import Image from 'next/image';
import Link from 'next/link';

const Home = () => {
  const { data } = useSession();
  return (
    <div className="min-h-screen h-full overflow-y-scroll box-border px-4 py-10">
      <section className="flex flex-col-reverse gap-8 md:flex-row md:gap-8 mx-auto">
        <Image
          priority
          src={Intro}
          alt="IntroImage"
          className="w-full md:w-1/3 lg:w-2/5 md:ml-10"
        />
        <section className="flex flex-col gap-3 self-center md:self-start md:p-16">
          <div className="text-2xl font-extrabold text-center md:text-3xl lg:text-4xl bg-gradient-to-r from-sky-500 to-indigo-500 bg-clip-text text-transparent">
            <p className="text-3xl mb-4 font-extrabold text-center md:text-3xl lg:text-6xl bg-gradient-to-r from-sky-500 to-indigo-500 bg-clip-text text-transparent">
              BudgetBuddy
            </p>
            <p>A smart, efficient, and easiest way to manage Expenses</p>
          </div>
          <span className="text-sm font-thin p-4 text-gray-600 rounded-xl bg-gradient-to-r from-sky-100 to-indigo-100 md:text-l lg:text-xl">
            <li>
              Are you tired of the endless hassle of managing your expenses
              manually?
            </li>
            <br />
            <li>
              Do you find it challenging to keep track of your spending and
              categorize your expenses efficiently?
            </li>
            <br />
            Look no further, because BudgetBuddy is here to simplify your
            financial life and make expense management a breeze!
          </span>
        </section>
      </section>
      <section>
        <p className="text-center text-2xl font-bold text-indigo-500 mb-4 md:text:3xl lg:text-4xl">
          Why BudgetBuddy?
        </p>
        <div className="flex flex-col gap-8 md:flex-row md:flex-wrap md:gap-12 justify-center">
          <div className="p-6 bg-indigo-50 rounded-lg shadow-md sm:w-full md:w-2/5 lg:w-1/4">
            <h2 className="text-xl font-semibold mb-2">
              Attach Images to Expense
            </h2>
            <p className="p-1 font-extralight">
              Never forget the details of your expenses again! With BudgetBuddy,
              you can easily attach images to each expense, allowing you to
              visualize your spending.
            </p>
          </div>
          <div className="p-6 bg-indigo-50 rounded-lg shadow-md sm:w-full md:w-2/5 lg:w-1/4">
            <h2 className="text-xl font-semibold mb-2">Group by Category</h2>
            <p className="p-1 font-extralight">
              Say goodbye to the chaos of disorganized expenses. BudgetBuddy
              enables you to categorize your expenses effortlessly.
            </p>
          </div>
          <div className="p-6 bg-indigo-50 rounded-lg shadow-md sm:w-full md:w-2/5 lg:w-1/4">
            <h2 className="text-xl font-semibold mb-2">
              Import & Export of Expenses from Excel
            </h2>
            <ul className="list-disc p-2 gap-2">
              <li className="font-extralight">
                Take control of your financial data. Our seamless export feature
                lets you effortlessly transfer your expense records into Excel
                sheets for further analysis.
              </li>
              <li> Create expenses from already stored info.</li>
            </ul>
          </div>
          <div className="p-6 bg-indigo-50 rounded-lg shadow-md sm:w-full md:w-2/5 lg:w-1/4">
            <h2 className="text-xl font-semibold mb-2">
              Add an Expense into Repeating One
            </h2>
            <p className="p-1 font-extralight">
              {`Whether it's a monthly subscription or a yearly bill, you can
              automate the tracking of your recurring expenses and never miss a
              payment again.`}
            </p>
          </div>
          <div className="p-6 bg-indigo-50 rounded-lg shadow-md sm:w-full md:w-2/5 lg:w-1/4">
            <h2 className="text-xl font-semibold mb-2">
              Dashboard to View Expenses
            </h2>
            <p className="p-1 font-extralight">
              Get a clear and concise overview of your financial health with our
              intuitive dashboard.
            </p>
          </div>
        </div>
      </section>
      <section className="bg-indigo-50 my-8 py-8 text-center">
        <h2 className="text-2xl font-semibold mb-2 md:text-3xl text-indigo-600">
          Experience Financial Freedom with BudgetBuddy
        </h2>
        <p className="text-lg sm:text-sm md:text-xl">
          Start your journey toward financial freedom and peace of mind.
        </p>
        {data ? (
          <button className="mt-4 py-2 px-4 bg-indigo-500 text-white font-semibold rounded-full hover:bg-indigo-600 ">
            <Link href={'/expenses'}>Expenses</Link>
          </button>
        ) : (
          <button className="mt-4 py-2 px-4 bg-indigo-500 text-white font-semibold rounded-full hover:bg-indigo-600 ">
            <Link href={'/signup'}>Sign Up Now</Link>
          </button>
        )}
      </section>
    </div>
  );
};

export default Home;
