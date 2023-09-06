import { useState } from 'react';

export type useAsyncProps<T, K> = {
  fn: (params: K) => Promise<T>;
};
export const useAsync = <T, K>({ fn }: useAsyncProps<T, K>) => {
  const [data, setData] = useState<T>();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<Error>();

  async function execFunc(params: K) {
    try {
      setIsLoading(true);
      setError(undefined);
      const response = await fn(params);
      setData(response);
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (err: any) {
      setError(new Error(err.message));
    } finally {
      setIsLoading(false);
    }
  }

  return [{ isLoading, data, error }, execFunc] as const;
};
