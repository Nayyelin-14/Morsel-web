import { FormEvent, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Lock, CheckCircle2 } from "lucide-react";
import { toast } from "sonner";
import AuthLayout from "@/components/auth/AuthLayout";
import InputField from "@/components/auth/InputField";
import { Button } from "@/components/ui/button";

const ResetPassword = () => {
  const navigate = useNavigate();
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [loading, setLoading] = useState(false);
  const [done, setDone] = useState(false);
  const [error, setError] = useState<string>();

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    setError(undefined);
    if (password.length < 8) return setError("At least 8 characters");
    if (password !== confirm) return setError("Passwords do not match");
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      setDone(true);
      toast.success("Password updated");
      setTimeout(() => navigate("/login", { replace: true }), 1500);
    }, 700);
  };

  return (
    <AuthLayout
      title={done ? "Password updated" : "Set a new password"}
      subtitle={done ? "Redirecting you to sign in…" : "Choose a strong password you haven't used before."}
      footer={
        <Link to="/login" className="font-medium text-primary hover:underline">
          Back to sign in
        </Link>
      }
    >
      {done ? (
        <div className="flex flex-col items-center gap-4 rounded-2xl border border-border bg-card p-8 text-center shadow-soft animate-scale-in">
          <span className="grid h-16 w-16 place-items-center rounded-full bg-success/10 text-success">
            <CheckCircle2 className="h-8 w-8" />
          </span>
          <p className="text-sm text-muted-foreground">You can now sign in with your new password.</p>
        </div>
      ) : (
        <form onSubmit={handleSubmit} className="space-y-5" noValidate>
          <InputField
            label="New password"
            type="password"
            icon={<Lock />}
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="At least 8 characters"
            error={error && error.includes("8") ? error : undefined}
          />
          <InputField
            label="Confirm password"
            type="password"
            icon={<Lock />}
            value={confirm}
            onChange={(e) => setConfirm(e.target.value)}
            placeholder="Re-enter password"
            error={error && error.includes("match") ? error : undefined}
          />
          <Button type="submit" variant="hero" size="lg" className="w-full" disabled={loading}>
            {loading ? "Updating…" : "Update password"}
          </Button>
        </form>
      )}
    </AuthLayout>
  );
};

export default ResetPassword;
