import { useState } from "react";
import {
  Bike,
  MapPin,
  Navigation,
  Package,
  CheckCircle2,
  DollarSign,
  Clock,
  Phone,
  Power,
} from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import DashboardHeader from "@/components/dashboard/DashboardHeader";
import { useAuth } from "@/context/AuthContext";

type Stage = "pickup" | "delivering" | "delivered";

interface Delivery {
  id: string;
  restaurant: string;
  customer: string;
  pickup: string;
  dropoff: string;
  payout: number;
  distance: string;
  stage: Stage;
}

const initialDeliveries: Delivery[] = [
  { id: "#A-2041", restaurant: "Bella Napoli", customer: "Alex M.", pickup: "12 Pine St", dropoff: "88 Maple Ave", payout: 8.5, distance: "2.4 km", stage: "pickup" },
  { id: "#A-2042", restaurant: "Smash & Co.", customer: "Sara P.", pickup: "55 Oak Rd", dropoff: "201 Cedar Ln", payout: 6.25, distance: "1.8 km", stage: "delivering" },
];

const stages: { key: Stage; label: string; icon: typeof Package }[] = [
  { key: "pickup", label: "Pickup", icon: Package },
  { key: "delivering", label: "Delivering", icon: Bike },
  { key: "delivered", label: "Delivered", icon: CheckCircle2 },
];

const RiderDashboard = () => {
  const { user } = useAuth();
  const [online, setOnline] = useState(true);
  const [deliveries, setDeliveries] = useState<Delivery[]>(initialDeliveries);

  const advance = (id: string) => {
    setDeliveries((d) =>
      d.map((x) => {
        if (x.id !== id) return x;
        const next: Stage = x.stage === "pickup" ? "delivering" : x.stage === "delivering" ? "delivered" : "delivered";
        if (next === "delivered" && x.stage !== "delivered") toast.success(`${x.id} delivered • +$${x.payout.toFixed(2)}`);
        return { ...x, stage: next };
      }),
    );
  };

  const earnings = {
    today: deliveries.filter((d) => d.stage === "delivered").reduce((s, d) => s + d.payout, 0),
    week: 184.5,
    trips: 27,
  };

  return (
    <div className="min-h-screen bg-background">
      <DashboardHeader />

      <main className="mx-auto w-full max-w-7xl px-5 py-8 sm:px-8 lg:py-12">
        {/* Top bar: online status + earnings */}
        <section className="mb-8 grid grid-cols-1 gap-4 lg:grid-cols-3 animate-fade-in">
          <div className={`rounded-2xl border p-5 shadow-soft transition-smooth lg:col-span-1 ${online ? "border-success/40 bg-success/5" : "border-border bg-card"}`}>
            <div className="flex items-start justify-between">
              <div>
                <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">Status</p>
                <p className="mt-1 font-display text-2xl font-bold">{online ? "You're online" : "You're offline"}</p>
                <p className="mt-1 text-sm text-muted-foreground">{online ? "Receiving delivery requests" : "Tap to go online"}</p>
              </div>
              <span className={`grid h-11 w-11 place-items-center rounded-xl ${online ? "bg-success text-success-foreground" : "bg-muted text-muted-foreground"}`}>
                <Power className="h-5 w-5" />
              </span>
            </div>
            <div className="mt-4 flex items-center justify-between rounded-xl border border-border bg-background/50 px-4 py-2.5">
              <span className="text-sm font-medium">Availability</span>
              <Switch checked={online} onCheckedChange={(v) => { setOnline(v); toast.success(v ? "You're online" : "You're offline"); }} aria-label="Toggle availability" />
            </div>
          </div>

          <div className="rounded-2xl border border-border bg-card p-5 shadow-soft">
            <div className="flex items-center justify-between">
              <span className="grid h-11 w-11 place-items-center rounded-xl bg-gradient-warm/10 text-primary"><DollarSign className="h-5 w-5" /></span>
              <span className="text-xs font-semibold text-muted-foreground">Today</span>
            </div>
            <p className="mt-5 text-sm text-muted-foreground">Earnings today</p>
            <p className="mt-1 font-display text-3xl font-bold">${earnings.today.toFixed(2)}</p>
          </div>

          <div className="rounded-2xl border border-border bg-card p-5 shadow-soft">
            <div className="flex items-center justify-between">
              <span className="grid h-11 w-11 place-items-center rounded-xl bg-gradient-warm/10 text-primary"><Bike className="h-5 w-5" /></span>
              <span className="text-xs font-semibold text-muted-foreground">This week</span>
            </div>
            <p className="mt-5 text-sm text-muted-foreground">Trips • Earnings</p>
            <p className="mt-1 font-display text-3xl font-bold">{earnings.trips} <span className="text-base font-medium text-muted-foreground">• ${earnings.week.toFixed(2)}</span></p>
          </div>
        </section>

        {/* Map placeholder */}
        <section className="mb-8 overflow-hidden rounded-2xl border border-border shadow-soft">
          <div className="relative h-72 w-full bg-[radial-gradient(ellipse_at_center,hsl(var(--secondary))_0%,hsl(var(--background))_70%)]">
            <svg className="absolute inset-0 h-full w-full opacity-30" xmlns="http://www.w3.org/2000/svg">
              <defs>
                <pattern id="grid" width="40" height="40" patternUnits="userSpaceOnUse">
                  <path d="M 40 0 L 0 0 0 40" fill="none" stroke="hsl(var(--border))" strokeWidth="1" />
                </pattern>
              </defs>
              <rect width="100%" height="100%" fill="url(#grid)" />
              <path d="M 50 250 Q 200 100 400 180 T 800 120" stroke="hsl(var(--primary))" strokeWidth="3" fill="none" strokeDasharray="6 6" />
            </svg>
            <div className="absolute left-6 top-6 inline-flex items-center gap-2 rounded-full border border-border bg-card/95 px-3 py-1.5 text-xs font-semibold shadow-soft backdrop-blur">
              <MapPin className="h-3.5 w-3.5 text-primary" /> Live map preview
            </div>
            <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 text-center">
              <span className="grid h-14 w-14 place-items-center rounded-full bg-gradient-warm text-primary-foreground shadow-elegant">
                <Navigation className="h-6 w-6" />
              </span>
              <p className="mt-3 font-display text-base font-semibold">Route to next pickup</p>
              <p className="text-sm text-muted-foreground">Bella Napoli • 2.4 km away</p>
            </div>
          </div>
        </section>

        {/* Active deliveries */}
        <section>
          <div className="mb-4 flex items-end justify-between">
            <div>
              <h2 className="font-display text-xl font-bold sm:text-2xl">Active deliveries</h2>
              <p className="text-sm text-muted-foreground">Hi {user?.name}, here are your assigned tasks.</p>
            </div>
            <span className="rounded-full border border-border bg-card px-3 py-1 text-xs font-semibold">
              {deliveries.filter((d) => d.stage !== "delivered").length} active
            </span>
          </div>

          <div className="space-y-4">
            {deliveries.map((d) => (
              <article key={d.id} className="rounded-2xl border border-border bg-card p-5 shadow-soft">
                <div className="flex flex-wrap items-start justify-between gap-3">
                  <div>
                    <p className="font-mono text-xs text-muted-foreground">{d.id}</p>
                    <h3 className="mt-1 font-display text-lg font-bold">{d.restaurant} → {d.customer}</h3>
                    <div className="mt-1 flex flex-wrap items-center gap-3 text-xs text-muted-foreground">
                      <span className="inline-flex items-center gap-1"><MapPin className="h-3 w-3" /> {d.distance}</span>
                      <span className="h-1 w-1 rounded-full bg-border" />
                      <span className="inline-flex items-center gap-1"><Clock className="h-3 w-3" /> ETA 12 min</span>
                    </div>
                  </div>
                  <span className="rounded-lg bg-success/10 px-3 py-1.5 text-sm font-bold text-success">+${d.payout.toFixed(2)}</span>
                </div>

                {/* Tracker */}
                <div className="mt-5 flex items-center justify-between gap-2">
                  {stages.map((s, i) => {
                    const currentIdx = stages.findIndex((x) => x.key === d.stage);
                    const reached = i <= currentIdx;
                    return (
                      <div key={s.key} className="flex flex-1 items-center gap-2">
                        <div className="flex flex-col items-center gap-1.5">
                          <span className={`grid h-9 w-9 place-items-center rounded-full transition-smooth ${reached ? "bg-gradient-warm text-primary-foreground shadow-elegant" : "bg-muted text-muted-foreground"}`}>
                            <s.icon className="h-4 w-4" />
                          </span>
                          <span className={`text-[11px] font-semibold ${reached ? "text-foreground" : "text-muted-foreground"}`}>{s.label}</span>
                        </div>
                        {i < stages.length - 1 && (
                          <div className={`h-1 flex-1 rounded-full transition-smooth ${i < currentIdx ? "bg-gradient-warm" : "bg-muted"}`} />
                        )}
                      </div>
                    );
                  })}
                </div>

                <div className="mt-5 grid grid-cols-1 gap-3 rounded-xl bg-secondary/40 p-4 sm:grid-cols-2">
                  <div className="flex items-start gap-2">
                    <Package className="mt-0.5 h-4 w-4 text-primary" />
                    <div>
                      <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">Pickup</p>
                      <p className="text-sm font-medium">{d.pickup}</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-2">
                    <MapPin className="mt-0.5 h-4 w-4 text-primary" />
                    <div>
                      <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">Drop-off</p>
                      <p className="text-sm font-medium">{d.dropoff}</p>
                    </div>
                  </div>
                </div>

                <div className="mt-4 flex flex-wrap items-center justify-end gap-2">
                  <Button variant="outline" size="sm"><Phone className="h-4 w-4" />Call customer</Button>
                  <Button variant="hero" size="sm" onClick={() => advance(d.id)} disabled={d.stage === "delivered"}>
                    {d.stage === "pickup" ? "Confirm pickup" : d.stage === "delivering" ? "Mark delivered" : "Completed"}
                  </Button>
                </div>
              </article>
            ))}
          </div>
        </section>
      </main>
    </div>
  );
};

export default RiderDashboard;
