import { Suspense } from 'react';
import SignUpContent from '../component/Signup/SignUpContent';

export default function SignupPage() {
  return (
    <Suspense fallback={<div className="min-h-screen flex items-center justify-center">Loading...</div>}>
      <SignUpContent />
    </Suspense>
  );
}