import { useEffect } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { UtensilsCrossed, Home } from "lucide-react";

const NotFound = () => {
  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    console.error("404 Error: Route not found:", location.pathname);
  }, [location.pathname]);

  return (
    <div className="relative flex min-h-screen items-center justify-center bg-background px-5">
      <div className="pointer-events-none absolute inset-0 bg-gradient-hero" aria-hidden="true" />
      <div className="relative w-full max-w-md text-center animate-fade-in">
        <span className="mb-6 inline-grid h-16 w-16 place-items-center rounded-2xl bg-gradient-warm shadow-elegant">
          <UtensilsCrossed className="h-7 w-7 text-primary-foreground" />
        </span>
        <p className="font-display text-7xl font-bold tracking-tight bg-gradient-warm bg-clip-text text-transparent sm:text-8xl">
          404
        </p>
        <h1 className="mt-4 font-display text-2xl font-bold text-foreground sm:text-3xl">
          This page is off the menu
        </h1>
        <p className="mt-3 text-muted-foreground">
          The page you're looking for doesn't exist or has moved.
        </p>
        <div className="mt-8 flex flex-wrap justify-center gap-3">
          <Button variant="hero" size="lg" onClick={() => navigate(-1)}>
            Go back
          </Button>
          <Button variant="outline" size="lg" asChild>
            <Link to="/">
              <Home className="h-4 w-4" />
              Home
            </Link>
          </Button>
        </div>
      </div>
    </div>
  );
};

export default NotFound;
