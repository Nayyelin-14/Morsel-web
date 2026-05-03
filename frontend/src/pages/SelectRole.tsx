import { useState } from "react";
import { useNavigate, Navigate } from "react-router-dom";
import { ShoppingBag, ChefHat, Bike, UtensilsCrossed, ArrowRight } from "lucide-react";
import { toast } from "sonner";
import RoleCard from "@/components/auth/RoleCard";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Role, useAuth } from "@/context/AuthContext";

const roles: Array<{
  id: Role;
  title: string;
  description: string;
  icon: React.ReactNode;
  features: string[];
}> = [
  {
    id: "buyer",
    title: "I'm a Buyer",
    description: "Discover restaurants and order in a few taps.",
    icon: <ShoppingBag className="h-7 w-7" />,
    features: ["Browse local restaurants", "Real-time order tracking", "Exclusive member deals"],
  },
  {
    id: "seller",
    title: "I'm a Seller",
    description: "Run your restaurant and grow your sales.",
    icon: <ChefHat className="h-7 w-7" />,
    features: ["Manage menu & orders", "Sales analytics dashboard", "Reach more customers"],
  },
  {
    id: "rider",
    title: "I'm a Rider",
    description: "Earn flexibly delivering meals on your schedule.",
    icon: <Bike className="h-7 w-7" />,
    features: ["Flexible hours, your way", "Weekly fast payouts", "Live navigation built-in"],
  },
];

const SelectRole = () => {
  const navigate = useNavigate();
  const { user, setRole, loading } = useAuth();
  const [selected, setSelected] = useState<Role | null>(null);
  const [confirmOpen, setConfirmOpen] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  if (loading) return null;
  if (!user) return <Navigate to="/login" replace />;
  if (user.role) return <Navigate to="/dashboard" replace />;

  const confirm = () => {
    if (!selected) return;
    setSubmitting(true);
    setTimeout(() => {
      setRole(selected);
      toast.success(`Welcome aboard, ${selected}!`);
      navigate("/dashboard", { replace: true });
    }, 500);
  };

  return (
    <div className="relative min-h-screen w-full bg-background">
      <div className="pointer-events-none absolute inset-0 bg-gradient-hero" aria-hidden="true" />

      <div className="relative mx-auto w-full max-w-6xl px-5 py-10 sm:px-8 lg:py-16">
        <header className="mb-12 flex flex-col items-center gap-5 text-center animate-fade-in">
          <span className="grid h-12 w-12 place-items-center rounded-xl bg-gradient-warm shadow-elegant">
            <UtensilsCrossed className="h-6 w-6 text-primary-foreground" />
          </span>
          <div className="space-y-3">
            <span className="inline-block rounded-full border border-border bg-card/70 px-4 py-1 text-xs font-medium uppercase tracking-wider text-muted-foreground backdrop-blur-sm">
              One last step
            </span>
            <h1 className="font-display text-4xl font-bold tracking-tight text-foreground sm:text-5xl">
              How will you use <span className="bg-gradient-warm bg-clip-text text-transparent">Morsel</span>?
            </h1>
            <p className="mx-auto max-w-xl text-base text-muted-foreground">
              Choose a role to personalize your experience. Don't worry — you can switch later from your account.
            </p>
          </div>
        </header>

        <div className="grid grid-cols-1 gap-5 md:grid-cols-3">
          {roles.map((r) => (
            <RoleCard
              key={r.id}
              icon={r.icon}
              title={r.title}
              description={r.description}
              features={r.features}
              selected={selected === r.id}
              onSelect={() => setSelected(r.id)}
            />
          ))}
        </div>

        <div className="mt-12 flex flex-col items-center gap-3">
          <Button
            variant="hero"
            size="xl"
            disabled={!selected}
            onClick={() => setConfirmOpen(true)}
            className="min-w-[240px]"
          >
            Continue
            <ArrowRight className="h-5 w-5" />
          </Button>
          <p className="text-xs text-muted-foreground">
            {selected ? `You'll continue as ${selected}` : "Select a role to continue"}
          </p>
        </div>
      </div>

      <Dialog open={confirmOpen} onOpenChange={setConfirmOpen}>
        <DialogContent className="rounded-2xl">
          <DialogHeader>
            <DialogTitle className="font-display text-2xl">Confirm your role</DialogTitle>
            <DialogDescription>
              You're about to join Morsel as a{" "}
              <span className="font-semibold text-foreground">{selected}</span>. This personalizes your dashboard
              and onboarding.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter className="gap-2 sm:gap-2">
            <Button variant="outline" onClick={() => setConfirmOpen(false)} disabled={submitting}>
              Go back
            </Button>
            <Button variant="hero" onClick={confirm} disabled={submitting}>
              {submitting ? "Setting up…" : "Yes, continue"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default SelectRole;
