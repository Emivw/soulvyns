'use client';
import { useState } from 'react';
import { Button } from '@/components/ui/button'
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import { Code, KeyRound, Loader2 } from 'lucide-react'
import { MicrosoftAuthProvider, signInWithPopup } from 'firebase/auth';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/firebase';

const MicrosoftIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24"><path fill="#f25022" d="M11.25 11.25H2V2h9.25z"/><path fill="#00a4ef" d="M22 11.25h-9.25V2H22z"/><path fill="#7fba00" d="M11.25 22H2v-9.25h9.25z"/><path fill="#ffb900" d="M22 22h-9.25v-9.25H22z"/></svg>
)

export default function LoginPage() {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const auth = useAuth();
  const router = useRouter();

  const handleMicrosoftSignIn = async () => {
    setIsLoading(true);
    setError(null);
    if (!auth) {
        setError("Firebase Auth not initialized");
        setIsLoading(false);
        return;
    }
    const provider = new MicrosoftAuthProvider();
    try {
      await signInWithPopup(auth, provider);
      router.push('/dashboard');
    } catch (error: any) {
      setError(error.message);
      console.error("Error signing in with Microsoft", error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <main className="flex min-h-screen flex-col items-center justify-center p-4">
      <Card className="w-full max-w-sm">
        <CardHeader className="text-center">
            <div className="flex justify-center items-center mb-4">
                <div className="bg-primary p-3 rounded-full">
                    <Code className="w-8 h-8 text-primary-foreground" />
                </div>
            </div>
          <CardTitle className="text-2xl font-headline">Welcome to TeamBook</CardTitle>
          <CardDescription>
            Sign in to access your team's booking calendar.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4">
            <Button onClick={handleMicrosoftSignIn} disabled={isLoading}>
              {isLoading ? (
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              ) : (
                <MicrosoftIcon />
              )}
              Sign in with Microsoft
            </Button>
            {error && <p className="text-sm text-destructive text-center">{error}</p>}
            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <span className="w-full border-t" />
              </div>
              <div className="relative flex justify-center text-xs uppercase">
                <span className="bg-card px-2 text-muted-foreground">
                  Or continue with
                </span>
              </div>
            </div>
            <Button variant="outline" disabled>
                <KeyRound className="mr-2 h-4 w-4" />
                Sign in with SSO
            </Button>
          </div>
        </CardContent>
      </Card>
    </main>
  )
}
