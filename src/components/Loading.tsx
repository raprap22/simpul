import { Icon } from '@iconify/react';

interface LoadingStateProps {
  text?: string;
  heightClass?: string;
}

export default function LoadingState({
  text = 'Loading...',
  heightClass = 'h-120',
}: LoadingStateProps) {
  return (
    <div className={`${heightClass} flex flex-col gap-3 items-center justify-center text-gray-500`}>
      <Icon icon="eos-icons:loading" width={85} />
      <p>{text}</p>
    </div>
  );
}
