'use client';

import { useAsync } from '@/hooks/useAsync';
import { SignInSchema, SignInFieldValues } from '@/zod-schema/signin';
import { zodResolver } from '@hookform/resolvers/zod';
import { signIn } from 'next-auth/react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';
import { SubmitHandler, useForm } from 'react-hook-form';
import { FcGoogle } from 'react-icons/fc';

export default function SignUp() {
  const router = useRouter();

  const [{ isLoading, error, data }, credentialsSignIn] = useAsync<
    unknown,
    SignInFieldValues
  >({
    fn: (data) => signIn('credentials', { redirect: false, ...data }),
  });

  const handleGoogleSignIn = async () => {
    await signIn('google');
    router.replace('/expenses');
  };

  const {
    register,
    handleSubmit,
    formState: { isDirty, isValid, errors },
  } = useForm<SignInFieldValues>({
    resolver: zodResolver(SignInSchema),
    mode: 'all',
  });

  const handleFormSubmit: SubmitHandler<SignInFieldValues> = async (data) => {
    await credentialsSignIn(data);
  };

  useEffect(() => {
    if (data && !error) {
      router.replace('/');
    }
  }, [data, error]);

  return (
    <div className=" flex flex-col p-4 gap-4 sm:w-full md:w-2/3 md:mx-auto lg:w-1/3">
      <p className="text-center text-3xl">SignIn</p>
      <form
        className="flex flex-col gap-4"
        onSubmit={handleSubmit(handleFormSubmit)}
      >
        <section className="flex flex-col p-4 gap-4">
          <label>Email</label>
          <input
            className="h-12 p-2 border-0 ring-2 ring-inset ring-indigo-200 rounded-lg focus:outline-none focus:ring-inset focus:ring-2 focus:ring-indigo-400"
            {...register('email')}
          />
          {errors.email && (
            <span className="text-red-400">{errors.email.message}</span>
          )}
        </section>
        <section className="flex flex-col p-4 gap-4">
          <label>Password</label>
          <input
            type="password"
            className="h-12 p-2 border-0 ring-2 ring-inset ring-indigo-200 rounded-lg focus:outline-none focus:ring-inset focus:ring-2 focus:ring-indigo-400"
            {...register('password')}
          />
          {errors.password && (
            <span className="text-red-400">{errors.password.message}</span>
          )}
        </section>
        <button
          type="submit"
          disabled={!isDirty || !isValid}
          className="p-2 mx-[25%] h-12 rounded-xl disabled:bg-gray-400 bg-indigo-500 text-white items-center hover:bg-indigo-600"
        >
          <p>{isLoading ? 'Signing In...' : 'Sign In'}</p>
        </button>
        {error && (
          <p className="text-sm text-center text-red-400">{error.message}</p>
        )}
      </form>
      <section className="items-center flex justify-end">
        <Link href={'/signup'}>
          <p>
            Not Registered?
            <span className="text-lg text-indigo-400 "> Sign Up</span>
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
        <button
          onClick={handleGoogleSignIn}
          className="flex gap-2 p-2 mx-[25%] h-12 rounded-xl bg-indigo-50 items-center justify-center hover:bg-indigo-100"
        >
          <FcGoogle />
          <span>Google</span>
        </button>
      </div>
    </div>
  );
}
