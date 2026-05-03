import { useState } from "react";
import {
  Search,
  MapPin,
  Star,
  Clock,
  Flame,
  Pizza,
  Beef,
  Soup,
  IceCream,
  Coffee,
  Salad,
  Copy,
  Check,
  Tag,
  ChevronRight,
} from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import DashboardHeader from "@/components/dashboard/DashboardHeader";
import { useAuth } from "@/context/AuthContext";

const categories = [
  { name: "Pizza", icon: Pizza },
  { name: "Burger", icon: Beef },
  { name: "Asian", icon: Soup },
  { name: "Dessert", icon: IceCream },
  { name: "Drinks", icon: Coffee },
  { name: "Healthy", icon: Salad },
];

const restaurants = [
  { name: "Bella Napoli", cuisine: "Italian • Pizza", rating: 4.8, time: "20-30 min", distance: "0.8 km", tags: ["Fast Delivery", "Popular"], img: "https://images.unsplash.com/photo-1565299624946-b28f40a0ae38?w=600&q=80" },
  { name: "Tokyo Ramen House", cuisine: "Japanese • Ramen", rating: 4.7, time: "25-35 min", distance: "1.2 km", tags: ["New"], img: "https://images.unsplash.com/photo-1569718212165-3a8278d5f624?w=600&q=80" },
  { name: "Smash & Co.", cuisine: "American • Burgers", rating: 4.6, time: "15-25 min", distance: "0.5 km", tags: ["Fast Delivery"], img: "https://images.unsplash.com/photo-1568901346375-23c9450c58cd?w=600&q=80" },
  { name: "Saigon Street", cuisine: "Vietnamese • Pho", rating: 4.9, time: "30-40 min", distance: "1.8 km", tags: ["Popular", "Trending"], img: "https://images.unsplash.com/photo-1582878826629-29b7ad1cdc43?w=600&q=80" },
];

const coupons = [
  { code: "SAVE20", desc: "20% off orders above $10", how: ["Apply at checkout", "Valid on all restaurants"], expiry: "Dec 31, 2026", color: "from-primary to-orange-500" },
  { code: "FREEDELIVERY", desc: "Free delivery on your next 3 orders", how: ["Apply at checkout", "Min order $15"], expiry: "Nov 15, 2026", color: "from-indigo-500 to-purple-500" },
  { code: "PIZZA50", desc: "50% off any large pizza", how: ["Apply at checkout", "Selected pizzerias only"], expiry: "Oct 30, 2026", color: "from-rose-500 to-pink-600" },
  { code: "WELCOME10", desc: "$10 off your first order", how: ["Apply at checkout", "New users only"], expiry: "Always", color: "from-emerald-500 to-teal-500" },
];

const BuyerDashboard = () => {
  const { user } = useAuth();
  const [copied, setCopied] = useState<string | null>(null);

  const copy = (code: string) => {
    navigator.clipboard.writeText(code);
    setCopied(code);
    toast.success(`Copied ${code}`);
    setTimeout(() => setCopied(null), 1800);
  };

  return (
    <div className="min-h-screen bg-background">
      <DashboardHeader showSearch />

      <main className="mx-auto w-full max-w-7xl px-5 py-8 sm:px-8 lg:py-12">
        {/* Hero */}
        <section className="relative mb-10 overflow-hidden rounded-3xl bg-gradient-warm p-8 shadow-elegant sm:p-12 animate-fade-in">
          <div className="relative z-10 max-w-2xl">
            <span className="inline-flex items-center gap-1.5 rounded-full bg-white/15 px-3 py-1 text-xs font-semibold uppercase tracking-wider text-primary-foreground backdrop-blur">
              <MapPin className="h-3 w-3" /> Delivering to Downtown
            </span>
            <h1 className="mt-4 font-display text-3xl font-bold leading-tight text-primary-foreground sm:text-5xl">
              Hungry, {user?.name}? <br />Discover food you'll love.
            </h1>
            <p className="mt-3 text-base text-primary-foreground/85 sm:text-lg">
              Order from the best restaurants nearby — delivered fast.
            </p>
            <div className="mt-6 flex max-w-lg items-center gap-2 rounded-2xl bg-card p-2 shadow-card">
              <Search className="ml-2 h-5 w-5 text-muted-foreground" />
              <input
                aria-label="Search food, restaurants or cuisines"
                placeholder="Search food, restaurants or cuisines"
                className="flex-1 bg-transparent px-2 py-2 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none"
              />
              <Button variant="hero" size="sm">Search</Button>
            </div>
          </div>
          <div className="pointer-events-none absolute -right-16 -top-10 h-64 w-64 rounded-full bg-white/10 blur-3xl" />
          <div className="pointer-events-none absolute -bottom-20 right-20 h-48 w-48 rounded-full bg-white/10 blur-3xl" />
        </section>

        {/* Categories */}
        <section className="mb-10">
          <SectionTitle title="Explore categories" />
          <div className="grid grid-cols-3 gap-3 sm:grid-cols-6">
            {categories.map(({ name, icon: Icon }) => (
              <button
                key={name}
                className="group flex flex-col items-center gap-2 rounded-2xl border border-border bg-card p-4 shadow-soft transition-spring hover:-translate-y-1 hover:border-primary/40 hover:shadow-card"
              >
                <span className="grid h-12 w-12 place-items-center rounded-xl bg-gradient-warm/10 text-primary transition-smooth group-hover:bg-gradient-warm group-hover:text-primary-foreground">
                  <Icon className="h-5 w-5" />
                </span>
                <span className="text-sm font-medium">{name}</span>
              </button>
            ))}
          </div>
        </section>

        {/* Coupons */}
        <section className="mb-10">
          <SectionTitle title="Available coupons" subtitle="Tap to copy and apply at checkout" icon={<Tag className="h-4 w-4" />} />
          <div className="-mx-2 flex snap-x snap-mandatory gap-4 overflow-x-auto px-2 pb-3">
            {coupons.map((c) => (
              <article
                key={c.code}
                className={`relative min-w-[280px] max-w-[320px] flex-1 snap-start overflow-hidden rounded-2xl bg-gradient-to-br ${c.color} p-5 text-white shadow-elegant transition-spring hover:-translate-y-1`}
              >
                <div className="absolute -right-8 -top-8 h-32 w-32 rounded-full bg-white/10 blur-2xl" />
                <div className="relative">
                  <div className="flex items-center justify-between">
                    <span className="rounded-full bg-white/20 px-2.5 py-0.5 text-[10px] font-bold uppercase tracking-wider backdrop-blur">
                      Coupon
                    </span>
                    <span className="text-[11px] opacity-90">Exp. {c.expiry}</span>
                  </div>
                  <p className="mt-4 font-display text-2xl font-bold tracking-tight">{c.desc}</p>
                  <ul className="mt-3 space-y-1 text-xs opacity-90">
                    {c.how.map((h) => (
                      <li key={h} className="flex items-center gap-1.5">
                        <span className="h-1 w-1 rounded-full bg-white" /> {h}
                      </li>
                    ))}
                  </ul>
                  <div className="mt-5 flex items-center justify-between rounded-xl border border-dashed border-white/40 bg-white/10 px-3 py-2 backdrop-blur">
                    <span className="font-mono text-base font-bold tracking-wider">{c.code}</span>
                    <button
                      onClick={() => copy(c.code)}
                      className="inline-flex items-center gap-1 rounded-md bg-white/90 px-2.5 py-1 text-xs font-semibold text-foreground transition-smooth hover:bg-white"
                      aria-label={`Copy coupon ${c.code}`}
                    >
                      {copied === c.code ? <Check className="h-3.5 w-3.5" /> : <Copy className="h-3.5 w-3.5" />}
                      {copied === c.code ? "Copied" : "Copy"}
                    </button>
                  </div>
                </div>
              </article>
            ))}
          </div>
        </section>

        {/* Nearby restaurants */}
        <section className="mb-10">
          <SectionTitle title="Nearby restaurants" subtitle="Within 2 km of your location" icon={<MapPin className="h-4 w-4" />} action="See all" />
          <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
            {restaurants.map((r) => (
              <RestaurantCard key={r.name} {...r} />
            ))}
          </div>
        </section>

        {/* Trending */}
        <section className="mb-10">
          <SectionTitle title="Trending now" icon={<Flame className="h-4 w-4 text-primary" />} action="See all" />
          <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
            {[...restaurants].reverse().map((r) => (
              <RestaurantCard key={r.name} {...r} />
            ))}
          </div>
        </section>

        {/* Recommended */}
        <section>
          <SectionTitle title="Recommended for you" />
          <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
            {restaurants.slice(0, 4).map((r) => (
              <RestaurantCard key={r.name + "-rec"} {...r} />
            ))}
          </div>
        </section>
      </main>
    </div>
  );
};

const SectionTitle = ({
  title,
  subtitle,
  icon,
  action,
}: { title: string; subtitle?: string; icon?: React.ReactNode; action?: string }) => (
  <div className="mb-4 flex items-end justify-between gap-4">
    <div>
      <h2 className="flex items-center gap-2 font-display text-xl font-bold tracking-tight text-foreground sm:text-2xl">
        {icon}
        {title}
      </h2>
      {subtitle && <p className="mt-1 text-sm text-muted-foreground">{subtitle}</p>}
    </div>
    {action && (
      <button className="inline-flex items-center gap-1 text-sm font-semibold text-primary transition-smooth hover:gap-1.5">
        {action} <ChevronRight className="h-4 w-4" />
      </button>
    )}
  </div>
);

const RestaurantCard = ({
  name,
  cuisine,
  rating,
  time,
  distance,
  tags,
  img,
}: {
  name: string;
  cuisine: string;
  rating: number;
  time: string;
  distance: string;
  tags: string[];
  img: string;
}) => (
  <article className="group cursor-pointer overflow-hidden rounded-2xl border border-border bg-card shadow-soft transition-spring hover:-translate-y-1 hover:shadow-card">
    <div className="relative aspect-[4/3] overflow-hidden bg-secondary">
      <img
        src={img}
        alt={name}
        loading="lazy"
        className="h-full w-full object-cover transition-spring group-hover:scale-105"
      />
      <div className="absolute left-3 top-3 flex flex-wrap gap-1.5">
        {tags.map((t) => (
          <Badge key={t} className="bg-card/95 text-foreground backdrop-blur hover:bg-card">
            {t}
          </Badge>
        ))}
      </div>
    </div>
    <div className="p-4">
      <div className="flex items-start justify-between gap-2">
        <h3 className="font-display text-base font-bold leading-tight">{name}</h3>
        <span className="inline-flex shrink-0 items-center gap-1 rounded-md bg-success/10 px-1.5 py-0.5 text-xs font-bold text-success">
          <Star className="h-3 w-3 fill-current" /> {rating}
        </span>
      </div>
      <p className="mt-1 text-xs text-muted-foreground">{cuisine}</p>
      <div className="mt-3 flex items-center gap-3 text-xs text-muted-foreground">
        <span className="inline-flex items-center gap-1"><Clock className="h-3 w-3" /> {time}</span>
        <span className="h-1 w-1 rounded-full bg-border" />
        <span className="inline-flex items-center gap-1"><MapPin className="h-3 w-3" /> {distance}</span>
      </div>
    </div>
  </article>
);

export default BuyerDashboard;
