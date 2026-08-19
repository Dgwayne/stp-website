'use client';

import { useRouter } from 'next/navigation';
import TrainingSignIn from '@/components/TrainingSignIn';
import '../training.css';

// Kept so older links and bookmarks still work. /training is the address
// people are given now, and it renders this same form in place when signed
// out rather than redirecting here.
export default function LoginPage() {
  const router = useRouter();

  return (
    <main className="stp">
      <div className="stp__shell">
        <TrainingSignIn onSignedIn={() => { router.push('/training'); router.refresh(); }} />
      </div>
    </main>
  );
}
