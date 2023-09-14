import { Loader } from '@/components/common/Loader';

export default function Loading() {
  return (
    <div className="min-h-screen flex items-center justify-center flex-col">
      <Loader />
    </div>
  );
}
