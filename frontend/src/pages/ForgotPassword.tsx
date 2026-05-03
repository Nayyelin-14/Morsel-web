import { FormEvent, useState } from "react";
import { Link } from "react-router-dom";
import { Mail, ArrowLeft, CheckCircle2 } from "lucide-react";
import AuthLayout from "@/components/auth/AuthLayout";
import InputField from "@/components/auth/InputField";
import { Button } from "@/components/ui/button";

const ForgotPassword = () => {
  const [email, setEmail] = useState("");
  const [sent, setSent] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      setSent(true);
    }, 700);
  };

  return (
    <AuthLayout
      title={sent ? "Check your inbox" : "Forgot password?"}
      subtitle={
        sent
          ? `We've sent a reset link to ${email}. It may take a minute to arrive.`
          : "No worries — enter your email and we'll send you a reset link."
      }
      footer={
        <Link to="/login" className="inline-flex items-center gap-2 font-medium text-primary hover:underline">
          <ArrowLeft className="h-4 w-4" />
          Back to sign in
        </Link>
      }
    >
      {sent ? (
        <div className="flex flex-col items-center gap-5 rounded-2xl border border-border bg-card p-8 text-center shadow-soft animate-scale-in">
          <span className="grid h-16 w-16 place-items-center rounded-full bg-success/10 text-success">
            <CheckCircle2 className="h-8 w-8" />
          </span>
          <p className="text-sm text-muted-foreground">
            Didn't get it? Check your spam folder or{" "}
            <button onClick={() => setSent(false)} className="font-medium text-primary hover:underline">
              try a different email
            </button>
            .
          </p>
        </div>
      ) : (
        <form onSubmit={handleSubmit} className="space-y-5" noValidate>
          <InputField
            label="Email"
            type="email"
            icon={<Mail />}
            placeholder="you@example.com"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
          <Button type="submit" variant="hero" size="lg" className="w-full" disabled={loading || !email}>
            {loading ? "Sending…" : "Send reset link"}
          </Button>
        </form>
      )}
    </AuthLayout>
  );
};

export default ForgotPassword;
