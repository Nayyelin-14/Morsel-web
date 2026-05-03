import { Check } from "lucide-react";
import { cn } from "@/lib/utils";
import { ReactNode } from "react";

interface RoleCardProps {
  icon: ReactNode;
  title: string;
  description: string;
  features: string[];
  selected: boolean;
  onSelect: () => void;
}

const RoleCard = ({ icon, title, description, features, selected, onSelect }: RoleCardProps) => {
  return (
    <button
      type="button"
      onClick={onSelect}
      aria-pressed={selected}
      className={cn(
        "group relative flex h-full w-full flex-col items-start gap-4 rounded-2xl border-2 bg-card p-6 text-left transition-spring",
        "hover:-translate-y-1 hover:shadow-card",
        selected
          ? "border-primary bg-gradient-to-br from-primary/5 to-accent/5 shadow-elegant"
          : "border-border hover:border-primary/40",
      )}
    >
      {/* Selected check */}
      <span
        className={cn(
          "absolute right-5 top-5 grid h-7 w-7 place-items-center rounded-full border-2 transition-smooth",
          selected
            ? "border-primary bg-primary text-primary-foreground"
            : "border-border bg-background text-transparent group-hover:border-primary/40",
        )}
        aria-hidden="true"
      >
        <Check className="h-4 w-4" strokeWidth={3} />
      </span>

      <div
        className={cn(
          "grid h-14 w-14 place-items-center rounded-2xl text-2xl transition-smooth",
          selected ? "bg-gradient-warm text-primary-foreground shadow-elegant" : "bg-secondary text-foreground",
        )}
      >
        {icon}
      </div>

      <div className="space-y-1.5">
        <h3 className="font-display text-xl font-bold text-foreground">{title}</h3>
        <p className="text-sm leading-relaxed text-muted-foreground">{description}</p>
      </div>

      <ul className="mt-2 space-y-1.5 text-sm">
        {features.map((f) => (
          <li key={f} className="flex items-start gap-2 text-foreground/80">
            <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-primary" />
            <span>{f}</span>
          </li>
        ))}
      </ul>
    </button>
  );
};

export default RoleCard;
