import { createClient } from '@/lib/supabase/server';
import { redirect } from 'next/navigation';
import SettingsForm from '@/components/settings/settings-form';

export default async function SettingsPage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) redirect('/login');

  return (
    <div className="p-6 max-w-4xl mx-auto font-mono min-h-[calc(100vh-4rem)]">
      <div className="mb-8 border-b border-black/10 pb-4">
        <h1 className="text-3xl font-bold">Налаштування</h1>
        <p className="text-gray-500 mt-1">Керуйте своїм акаунтом та налаштуваннями</p>
      </div>

      <SettingsForm user={user} />
    </div>
  );
}