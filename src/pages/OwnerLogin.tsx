import { useState } from "react";
import { useLocation } from "wouter";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { trpc } from "@/lib/trpc";
import { toast } from "sonner";
import { Loader2 } from "lucide-react";

export default function OwnerLogin() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [, setLocation] = useLocation();

  const loginMutation = trpc.admin.login.useMutation({
    onSuccess: () => {
      toast.success("Logged in successfully!");
      setLocation("/owner/dashboard");
    },
    onError: (error: any) => {
      toast.error(error.message || "Login failed");
    },
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      await loginMutation.mutateAsync({
        email: email || undefined,
        password: password || undefined,
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-brand-dark p-4">
      <Card className="w-full max-w-md bg-brand-darker border-brand-accent/20">
        <CardHeader className="space-y-2">
          <CardTitle className="text-2xl text-brand-accent">Owner Portal</CardTitle>
          <CardDescription className="text-gray-400">
            Sign in to manage your appointments
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-200">Email</label>
              <Input
                type="email"
                placeholder="your@email.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="bg-brand-dark border-brand-accent/20 text-white placeholder:text-gray-500"
              />
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-200">Password</label>
              <Input
                type="password"
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="bg-brand-dark border-brand-accent/20 text-white placeholder:text-gray-500"
              />
            </div>

            <Button
              type="submit"
              disabled={isLoading}
              className="w-full bg-brand-accent hover:bg-brand-accent/90 text-black font-bold"
            >
              {isLoading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Signing in...
                </>
              ) : (
                "Sign In"
              )}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
