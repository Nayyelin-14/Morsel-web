import { FormEvent, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Mail, Lock, User } from "lucide-react";
import { toast } from "sonner";
import AuthLayout from "@/components/auth/AuthLayout";
import InputField from "@/components/auth/InputField";
import GoogleAuthButton from "@/components/auth/GoogleAuthButton";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/context/AuthContext";
import { startGoogleLogin } from "@/lib/googleAuth";

const Register = () => {
  const navigate = useNavigate();
  const { register, loginWithGoogle } = useAuth();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [googleLoading, setGoogleLoading] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    const next: Record<string, string> = {};
    if (!name.trim()) next.name = "Name is required";
    if (!/^\S+@\S+\.\S+$/.test(email)) next.email = "Enter a valid email";
    if (password.length < 8) next.password = "At least 8 characters";
    setErrors(next);
    if (Object.keys(next).length) return;

    setLoading(true);
    try {
      await register(name, email, password);
      toast.success("Account created — please sign in");
      // Role selection happens AFTER login, not after registration.
      navigate("/login", { replace: true });
    } catch {
      toast.error("Could not create account");
    } finally {
      setLoading(false);
    }
  };

  const handleGoogle = async () => {
    // Real OAuth: redirect to backend /auth/google with prompt=select_account
    if (startGoogleLogin()) return;
    // Fallback (no backend configured): simulated flow
    setGoogleLoading(true);
    try {
      await loginWithGoogle(true);
      toast.success("Signed up with Google");
      navigate("/select-role", { replace: true });
    } finally {
      setGoogleLoading(false);
    }
  };

  return (
    <AuthLayout
      title="Create your account"
      subtitle="Join thousands ordering, cooking, and delivering on Morsel."
      footer={
        <>
          Already have an account?{" "}
          <Link to="/login" className="font-semibold text-primary hover:underline">
            Sign in
          </Link>
        </>
      }
    >
      <form onSubmit={handleSubmit} className="space-y-5" noValidate>
        <InputField
          label="Full name"
          icon={<User />}
          placeholder="Jane Cooper"
          value={name}
          onChange={(e) => setName(e.target.value)}
          autoComplete="name"
          error={errors.name}
        />
        <InputField
          label="Email"
          type="email"
          icon={<Mail />}
          placeholder="you@example.com"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          autoComplete="email"
          error={errors.email}
        />
        <InputField
          label="Password"
          type="password"
          icon={<Lock />}
          placeholder="At least 8 characters"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          autoComplete="new-password"
          error={errors.password}
          hint={errors.password ? undefined : "Use 8+ characters with a mix of letters & numbers."}
        />

        <Button type="submit" variant="hero" size="lg" className="w-full" disabled={loading}>
          {loading ? "Creating account…" : "Create account"}
        </Button>

        <div className="relative py-2 text-center">
          <span className="absolute inset-x-0 top-1/2 h-px bg-border" />
          <span className="relative bg-background px-3 text-xs uppercase tracking-wider text-muted-foreground">
            or
          </span>
        </div>

        <GoogleAuthButton label="Sign up with Google" onClick={handleGoogle} loading={googleLoading} />

        <p className="text-center text-xs text-muted-foreground">
          By continuing you agree to our{" "}
          <a className="underline hover:text-foreground" href="#">Terms</a> and{" "}
          <a className="underline hover:text-foreground" href="#">Privacy Policy</a>.
        </p>
      </form>
    </AuthLayout>
  );
};

export default Register;
