'use client';

import { useAsync } from '@/hooks/useAsync';
import { SignUpFields, SingUpSchema } from '@/zod-schema/singnup';
import { zodResolver } from '@hookform/resolvers/zod';
import axios from 'axios';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';
import { SubmitHandler, useForm } from 'react-hook-form';
import { FcGoogle } from 'react-icons/fc';

export default function SignUp() {
  const router = useRouter();

  const [{ isLoading, error, data }, signUpUser] = useAsync<
    unknown,
    SignUpFields
  >({
    fn: (data) =>
      axios.post('/api/signup', {
        data,
      }),
  });

  const {
    register,
    handleSubmit,
    formState: { isDirty, isValid },
  } = useForm<SignUpFields>({
    resolver: zodResolver(SingUpSchema),
  });

  const handleFormSubmit: SubmitHandler<SignUpFields> = async (data) => {
    await signUpUser(data);
  };

  useEffect(() => {
    if (data && !error) {
      router.replace('/signin');
    }
  }, [data, error]);

  return (
    <div className=" flex flex-col p-4 gap-4 sm:w-full md:w-2/3 md:mx-auto lg:w-1/3">
      <p className="text-center text-3xl">SignUp</p>
      <form
        className="flex flex-col gap-4"
        onSubmit={handleSubmit(handleFormSubmit)}
      >
        <section className="flex flex-col p-4 gap-4">
          <label>Full Name</label>
          <input
            className="h-12 p-2 border-0 ring-2 ring-inset ring-indigo-200 rounded-lg focus:outline-none focus:ring-inset focus:ring-2 focus:ring-indigo-400"
            {...register('fullName')}
          />
        </section>
        <section className="flex flex-col p-4 gap-4">
          <label>Email</label>
          <input
            className="h-12 p-2 border-0 ring-2 ring-inset ring-indigo-200 rounded-lg focus:outline-none focus:ring-inset focus:ring-2 focus:ring-indigo-400"
            {...register('email')}
          />
        </section>
        <section className="flex flex-col p-4 gap-4">
          <label>Password</label>
          <input
            type="password"
            className="h-12 p-2 border-0 ring-2 ring-inset ring-indigo-200 rounded-lg focus:outline-none focus:ring-inset focus:ring-2 focus:ring-indigo-400"
            {...register('password')}
          />
        </section>
        <button
          type="submit"
          disabled={!isDirty || !isValid}
          className="p-2 mx-[25%] h-12 rounded-xl disabled:bg-gray-400 bg-indigo-500 text-white items-center hover:bg-indigo-600"
        >
          <p>{isLoading ? 'Signing Up...' : 'Sign Up'}</p>
        </button>
        {error && (
          <p className="text-sm text-center text-red-400">{error.message}</p>
        )}
      </form>
      <section className="items-center flex justify-end">
        <Link href={'/signin'}>
          <p>
            Already Registered?
            <span className="text-lg text-indigo-400 "> Sign In</span>
          </p>
        </Link>
      </section>
      <div className="inline-flex items-center justify-center w-full">
        <hr className="w-64 h-px my-8 border-0 bg-indigo-700" />
        <span className="absolute p-3 font-extrabold rounded-full text-white -translate-x-1/2 left-1/2 bg-indigo-900">
          OR
        </span>
      </div>
      <p>Continue with : </p>
      <div className="flex flex-col gap-2">
        <button className="flex gap-2 p-2 mx-[25%] h-12 rounded-xl bg-indigo-50 items-center justify-center hover:bg-indigo-100">
          <FcGoogle />
          <span>Google</span>
        </button>
      </div>
    </div>
  );
}
