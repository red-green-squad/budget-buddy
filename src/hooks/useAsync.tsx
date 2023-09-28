import { useState } from 'react';

export type AsyncResult<T> = {
  isLoading: boolean;
  data?: T;
  error?: Error;
};

export type useAsyncProps<T, K> = {
  fn: (params: K) => Promise<T>;
  onComplete?(data?: T): void | Promise<void>;
  onError?(error: Error): void;
};

export const useAsync = <T, K>({
  fn,
  onComplete,
  onError,
}: useAsyncProps<T, K>) => {
  const [data, setData] = useState<T>();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<Error>();

  async function execFunc(params: K) {
    try {
      setIsLoading(true);
      setError(undefined);
      const response = await fn(params);
      setData(response);
      await onComplete?.(data);
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (err: any) {
      setError(new Error(err.message));
      await onError?.(err);
    } finally {
      setIsLoading(false);
    }
  }

  return [{ isLoading, data, error }, execFunc] as const;
};
