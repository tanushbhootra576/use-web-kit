import ApiHookSection from '@/components/ApiHookSection';
import { HOOKS_DATA } from '@/lib/hooks-data';
import { notFound } from 'next/navigation';

export async function generateMetadata() {
  const hook = HOOKS_DATA.find((h) => h.id === 'usePermission');
  if (!hook) return {};
  return {
    title: `${hook.name} — use-web-kit`,
    description: hook.description,
  };
}

export default function Page() {
  const hook = HOOKS_DATA.find((h) => h.id === 'usePermission');

  if (!hook) {
    notFound();
  }

  return (
    <div>
      <ApiHookSection hook={hook} />
    </div>
  );
}
