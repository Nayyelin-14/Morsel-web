import { useNavigate } from "react-router-dom";
import { Bell, LogOut, Search, UtensilsCrossed } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/context/AuthContext";

interface Props {
  showSearch?: boolean;
  searchPlaceholder?: string;
}

const DashboardHeader = ({ showSearch = false, searchPlaceholder = "Search restaurants, dishes…" }: Props) => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  if (!user) return null;

  const handleLogout = () => {
    logout();
    toast.success("Signed out");
    navigate("/login", { replace: true });
  };

  return (
    <header className="sticky top-0 z-30 border-b border-border bg-background/80 backdrop-blur-lg">
      <div className="mx-auto flex h-16 w-full max-w-7xl items-center justify-between gap-4 px-5 sm:px-8">
        <div className="flex items-center gap-2">
          <span className="grid h-9 w-9 place-items-center rounded-lg bg-gradient-warm shadow-elegant">
            <UtensilsCrossed className="h-4 w-4 text-primary-foreground" />
          </span>
          <span className="font-display text-lg font-bold tracking-tight">Morsel</span>
        </div>

        {showSearch ? (
          <div className="hidden flex-1 max-w-md md:block">
            <div className="relative">
              <Search className="absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <input
                aria-label="Search"
                placeholder={searchPlaceholder}
                className="h-10 w-full rounded-lg border border-input bg-secondary/40 pl-10 pr-4 text-sm transition-smooth focus:border-primary focus:bg-card focus:outline-none focus:ring-4 focus:ring-primary/10"
              />
            </div>
          </div>
        ) : (
          <div className="hidden flex-1 md:block" />
        )}

        <div className="flex items-center gap-2">
          <Button variant="ghost" size="icon" aria-label="Notifications">
            <Bell className="h-5 w-5" />
          </Button>
          <div className="hidden items-center gap-3 rounded-full border border-border bg-card px-3 py-1.5 sm:flex">
            <span className="grid h-7 w-7 place-items-center rounded-full bg-gradient-warm text-xs font-bold text-primary-foreground">
              {user.name.slice(0, 1).toUpperCase()}
            </span>
            <span className="text-sm font-medium">{user.name}</span>
          </div>
          <Button variant="outline" size="sm" onClick={handleLogout}>
            <LogOut className="h-4 w-4" />
            <span className="hidden sm:inline">Sign out</span>
          </Button>
        </div>
      </div>
    </header>
  );
};

export default DashboardHeader;
