import Link from 'next/link';
import { Button } from '@/components/ui/button';

export default function PricingPage() {
  return (
    <main className="min-h-screen flex flex-col items-center justify-center px-6 gap-6">
      <h1 className="text-4xl font-bold">Тарифи</h1>
      <p className="text-muted-foreground">Безкоштовний план — необмежена кількість матеріалів.</p>
      <Button asChild>
        <Link href="/register">Почати безкоштовно</Link>
      </Button>
    </main>
  );
}
