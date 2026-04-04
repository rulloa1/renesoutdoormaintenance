import { useState } from "react";
import { useLocation } from "wouter";
import { trpc } from "@/lib/trpc";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Loader2, AlertCircle } from "lucide-react";
import { toast } from "sonner";

export default function AdminLogin() {
  const [, setLocation] = useLocation();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");

  const loginMutation = trpc.admin.login.useMutation();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setIsLoading(true);

    try {
      const result = await loginMutation.mutateAsync({
        email: email || undefined,
        password: password || undefined,
      });

      if (result.success) {
        toast.success("Login successful!");
        setLocation("/admin/dashboard");
      }
    } catch (err: any) {
      const errorMessage = err?.message || "Login failed. Please try again.";
      setError(errorMessage);
      toast.error(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-[#0D0D0D] to-[#1A1A1A] p-4">
      <Card className="w-full max-w-md bg-[#111111] border-white/10">
        <CardHeader className="space-y-2">
          <CardTitle className="text-2xl font-bold text-white">Admin Portal</CardTitle>
          <CardDescription className="text-white/60">Sign in to manage appointments</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleLogin} className="space-y-4">
            {error && (
              <div className="flex items-center gap-2 p-3 bg-red-500/10 border border-red-500/30 rounded-md">
                <AlertCircle size={16} className="text-red-500 shrink-0" />
                <p className="text-sm text-red-500">{error}</p>
              </div>
            )}

            <div className="space-y-2">
              <label className="text-sm font-medium text-white">Email</label>
              <Input
                type="email"
                placeholder="Enter your email (or just click Sign In if already logged in)"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="bg-[#1A1A1A] border-white/10 text-white placeholder:text-white/40"
                disabled={isLoading}
              />
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium text-white">Password</label>
              <Input
                type="password"
                placeholder="Enter your password (optional if logged in via OAuth)"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="bg-[#1A1A1A] border-white/10 text-white placeholder:text-white/40"
                disabled={isLoading}
              />
            </div>

            <Button
              type="submit"
              disabled={isLoading}
              className="w-full bg-[#B5E61D] text-[#0D0D0D] font-bold hover:bg-[#B5E61D]/90"
            >
              {isLoading ? (
                <>
                  <Loader2 size={16} className="mr-2 animate-spin" />
                  Signing in...
                </>
              ) : (
                "Sign In"
              )}
            </Button>
          </form>

          <p className="text-xs text-white/40 mt-4 text-center">
            Demo credentials: renelklever@gmail.com / Admin123
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
