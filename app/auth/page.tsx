'use client';

import { useEffect } from 'react';
import { getAuth, signInWithPopup, GoogleAuthProvider } from 'firebase/auth';
import { useSearchParams, useRouter } from 'next/navigation';

export default function AuthPage() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const redirect = searchParams.get('redirect');

  useEffect(() => {
    const auth = getAuth();
    const provider = new GoogleAuthProvider();

    const signIn = async () => {
      try {
        await signInWithPopup(auth, provider);
        // After successful sign-in, redirect to the original page
        if (redirect) {
          router.push(redirect);
        } else {
          router.push('/');
        }
      } catch (error) {
        console.error('Authentication error:', error);
      }
    };

    signIn();
  }, [redirect, router]);

  return (
    <div className="flex items-center justify-center min-h-screen">
      <div className="text-center">
        <h1 className="text-xl mb-4">Initiating sign-in...</h1>
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900 mx-auto"></div>
      </div>
    </div>
  );
}