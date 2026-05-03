import { FormEvent, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Mail, Lock } from "lucide-react";
import { toast } from "sonner";
import AuthLayout from "@/components/auth/AuthLayout";
import InputField from "@/components/auth/InputField";
import GoogleAuthButton from "@/components/auth/GoogleAuthButton";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/context/AuthContext";
import { startGoogleLogin } from "@/lib/googleAuth";

const Login = () => {
  const navigate = useNavigate();
  const { login, loginWithGoogle } = useAuth();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [googleLoading, setGoogleLoading] = useState(false);
  const [errors, setErrors] = useState<{ email?: string; password?: string }>({});

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    const next: typeof errors = {};
    if (!email) next.email = "Email is required";
    else if (!/^\S+@\S+\.\S+$/.test(email)) next.email = "Enter a valid email";
    if (!password) next.password = "Password is required";
    setErrors(next);
    if (Object.keys(next).length) return;

    setLoading(true);
    try {
      const u = await login(email, password);
      toast.success("Welcome back!");
      navigate(u.role ? "/dashboard" : "/select-role", { replace: true });
    } catch {
      toast.error("Could not sign in. Try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleGoogle = async () => {
    // Real OAuth: redirect to backend with Google account chooser
    if (startGoogleLogin()) return;
    // Fallback simulated flow for local UI dev
    setGoogleLoading(true);
    try {
      const u = await loginWithGoogle();
      toast.success("Signed in with Google");
      navigate(u.role ? "/dashboard" : "/select-role", { replace: true });
    } finally {
      setGoogleLoading(false);
    }
  };

  return (
    <AuthLayout
      title="Welcome back"
      subtitle="Sign in to keep ordering your favorites."
      footer={
        <>
          New to Morsel?{" "}
          <Link to="/register" className="font-semibold text-primary hover:underline">
            Create an account
          </Link>
        </>
      }
    >
      <form onSubmit={handleSubmit} className="space-y-5" noValidate>
        <InputField
          label="Email"
          type="email"
          autoComplete="email"
          placeholder="you@example.com"
          icon={<Mail />}
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          error={errors.email}
        />
        <InputField
          label="Password"
          type="password"
          autoComplete="current-password"
          placeholder="••••••••"
          icon={<Lock />}
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          error={errors.password}
        />

        <div className="flex items-center justify-between text-sm">
          <label className="inline-flex cursor-pointer items-center gap-2 text-muted-foreground">
            <input type="checkbox" className="h-4 w-4 rounded border-input accent-primary" />
            Remember me
          </label>
          <Link to="/forgot-password" className="font-medium text-primary hover:underline">
            Forgot password?
          </Link>
        </div>

        <Button type="submit" variant="hero" size="lg" className="w-full" disabled={loading}>
          {loading ? "Signing in…" : "Sign in"}
        </Button>

        <div className="relative py-2 text-center">
          <span className="absolute inset-x-0 top-1/2 h-px bg-border" />
          <span className="relative bg-background px-3 text-xs uppercase tracking-wider text-muted-foreground">
            or
          </span>
        </div>

        <GoogleAuthButton onClick={handleGoogle} loading={googleLoading} />
      </form>
    </AuthLayout>
  );
};

export default Login;
