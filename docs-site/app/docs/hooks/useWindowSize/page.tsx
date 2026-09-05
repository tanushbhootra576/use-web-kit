import ApiHookSection from '@/components/ApiHookSection';
import { HOOKS_DATA } from '@/lib/hooks-data';
import { notFound } from 'next/navigation';

export default function Page() {
  const hook = HOOKS_DATA.find((h) => h.id === 'useWindowSize');
  
  if (!hook) {
    notFound();
  }

  return (
    <div className="animate-in fade-in slide-in-from-bottom-4 duration-700 ease-out">
      <ApiHookSection hook={hook} />
    </div>
  );
}
