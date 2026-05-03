import { ReactNode } from "react";
import { Link } from "react-router-dom";
import { UtensilsCrossed } from "lucide-react";

interface AuthLayoutProps {
  children: ReactNode;
  title: string;
  subtitle?: string;
  footer?: ReactNode;
}

const AuthLayout = ({ children, title, subtitle, footer }: AuthLayoutProps) => {
  return (
    <div className="relative min-h-screen w-full bg-background">
      {/* Decorative gradient backdrop */}
      <div className="pointer-events-none absolute inset-0 bg-gradient-hero" aria-hidden="true" />

      <div className="relative mx-auto grid min-h-screen w-full max-w-7xl grid-cols-1 lg:grid-cols-2">
        {/* Brand panel */}
        <aside className="relative hidden flex-col justify-between overflow-hidden p-12 lg:flex">
          <Link to="/" className="inline-flex items-center gap-2 text-foreground">
            <span className="grid h-10 w-10 place-items-center rounded-xl bg-gradient-warm shadow-elegant">
              <UtensilsCrossed className="h-5 w-5 text-primary-foreground" />
            </span>
            <span className="font-display text-xl font-bold tracking-tight">Morsel</span>
          </Link>

          <div className="space-y-6">
            <h2 className="font-display text-4xl font-bold leading-[1.1] tracking-tight text-foreground xl:text-5xl">
              Crave it.
              <br />
              Order it.
              <br />
              <span className="relative inline-block">
                <span className="relative z-10 bg-gradient-warm bg-clip-text text-transparent">
                  Done.
                </span>
                <span
                  aria-hidden="true"
                  className="absolute inset-x-0 bottom-1 -z-0 h-3 rounded-sm bg-primary/15"
                />
              </span>
            </h2>
            <p className="max-w-md text-base text-muted-foreground">
              The fastest way to discover the best food in your city — built for buyers, sellers, and riders alike.
            </p>

            <div className="flex flex-wrap gap-2 pt-4">
              {["🍕 Pizza", "🍣 Sushi", "🥗 Healthy", "🍔 Burgers", "🌮 Tacos", "🍜 Ramen"].map((tag) => (
                <span
                  key={tag}
                  className="rounded-full border border-border bg-card/70 px-4 py-1.5 text-sm font-medium text-foreground/80 backdrop-blur-sm"
                >
                  {tag}
                </span>
              ))}
            </div>
          </div>

          <p className="text-xs text-muted-foreground">© {new Date().getFullYear()} Morsel, Inc.</p>
        </aside>

        {/* Form panel */}
        <main className="flex items-center justify-center px-5 py-10 sm:px-8 lg:py-16">
          <div className="w-full max-w-md animate-fade-in">
            <Link to="/" className="mb-8 inline-flex items-center gap-2 lg:hidden">
              <span className="grid h-9 w-9 place-items-center rounded-lg bg-gradient-warm shadow-elegant">
                <UtensilsCrossed className="h-4 w-4 text-primary-foreground" />
              </span>
              <span className="font-display text-lg font-bold">Morsel</span>
            </Link>

            <div className="mb-8 space-y-2">
              <h1 className="font-display text-3xl font-bold tracking-tight text-foreground sm:text-4xl">
                {title}
              </h1>
              {subtitle && <p className="text-muted-foreground">{subtitle}</p>}
            </div>

            {children}

            {footer && <div className="mt-8 text-center text-sm text-muted-foreground">{footer}</div>}
          </div>
        </main>
      </div>
    </div>
  );
};

export default AuthLayout;
