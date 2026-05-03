import { useState } from "react";
import {
  DollarSign,
  ShoppingBag,
  UtensilsCrossed,
  Plus,
  Pencil,
  Trash2,
  Tag,
  TrendingUp,
} from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import DashboardHeader from "@/components/dashboard/DashboardHeader";

interface MenuItem { id: string; name: string; price: number; category: string; available: boolean; }
interface Order { id: string; customer: string; items: number; total: number; status: "Pending" | "Preparing" | "Delivered"; }
interface Coupon { id: string; code: string; discount: string; expiry: string; usage: string; }

const initialMenu: MenuItem[] = [
  { id: "1", name: "Margherita Pizza", price: 12.5, category: "Pizza", available: true },
  { id: "2", name: "Truffle Pasta", price: 18.0, category: "Pasta", available: true },
  { id: "3", name: "Tiramisu", price: 7.5, category: "Dessert", available: false },
];

const initialOrders: Order[] = [
  { id: "#1042", customer: "Alex M.", items: 3, total: 38.5, status: "Pending" },
  { id: "#1041", customer: "Sara P.", items: 2, total: 24.0, status: "Preparing" },
  { id: "#1040", customer: "John D.", items: 1, total: 12.5, status: "Delivered" },
  { id: "#1039", customer: "Maria L.", items: 4, total: 52.0, status: "Delivered" },
];

const statusStyle: Record<Order["status"], string> = {
  Pending: "bg-warning/15 text-warning border-warning/30",
  Preparing: "bg-primary/15 text-primary border-primary/30",
  Delivered: "bg-success/15 text-success border-success/30",
};

const SellerDashboard = () => {
  const [menu, setMenu] = useState<MenuItem[]>(initialMenu);
  const [orders] = useState<Order[]>(initialOrders);
  const [coupons, setCoupons] = useState<Coupon[]>([
    { id: "1", code: "GRAND10", discount: "10% off", expiry: "2026-12-31", usage: "Min order $20" },
  ]);

  const stats = [
    { label: "Total orders", value: "1,284", icon: ShoppingBag, trend: "+12.4%" },
    { label: "Revenue (mo.)", value: "$24,580", icon: DollarSign, trend: "+8.2%" },
    { label: "Active items", value: String(menu.filter((m) => m.available).length), icon: UtensilsCrossed, trend: `${menu.length} total` },
  ];

  const deleteItem = (id: string) => {
    setMenu((m) => m.filter((x) => x.id !== id));
    toast.success("Item removed");
  };

  return (
    <div className="min-h-screen bg-background">
      <DashboardHeader />

      <main className="mx-auto w-full max-w-7xl px-5 py-8 sm:px-8 lg:py-12">
        <div className="mb-8 flex flex-col gap-2 animate-fade-in">
          <span className="inline-flex w-fit items-center gap-1.5 rounded-full border border-border bg-card px-3 py-1 text-xs font-semibold uppercase tracking-wider text-muted-foreground">
            <UtensilsCrossed className="h-3 w-3" /> Restaurant admin
          </span>
          <h1 className="font-display text-3xl font-bold tracking-tight sm:text-4xl">Restaurant overview</h1>
          <p className="text-muted-foreground">Manage your menu, orders and promotions.</p>
        </div>

        {/* Stats */}
        <section className="grid grid-cols-1 gap-4 sm:grid-cols-3">
          {stats.map((s) => (
            <div key={s.label} className="rounded-2xl border border-border bg-card p-6 shadow-soft transition-spring hover:-translate-y-1 hover:shadow-card">
              <div className="flex items-center justify-between">
                <span className="grid h-11 w-11 place-items-center rounded-xl bg-gradient-warm/10 text-primary">
                  <s.icon className="h-5 w-5" />
                </span>
                <span className="rounded-full bg-success/10 px-2 py-0.5 text-xs font-semibold text-success">
                  <TrendingUp className="mr-1 inline h-3 w-3" />{s.trend}
                </span>
              </div>
              <p className="mt-5 text-sm text-muted-foreground">{s.label}</p>
              <p className="mt-1 font-display text-3xl font-bold">{s.value}</p>
            </div>
          ))}
        </section>

        {/* Menu management */}
        <section className="mt-10 rounded-2xl border border-border bg-card shadow-soft">
          <div className="flex items-center justify-between border-b border-border p-5">
            <div>
              <h2 className="font-display text-lg font-bold">Menu management</h2>
              <p className="text-sm text-muted-foreground">Add, edit and remove menu items</p>
            </div>
            <MenuItemDialog onSave={(item) => { setMenu((m) => [...m, { ...item, id: crypto.randomUUID() }]); toast.success("Item added"); }} />
          </div>
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Item</TableHead>
                  <TableHead>Category</TableHead>
                  <TableHead>Price</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {menu.map((item) => (
                  <TableRow key={item.id}>
                    <TableCell className="font-medium">{item.name}</TableCell>
                    <TableCell className="text-muted-foreground">{item.category}</TableCell>
                    <TableCell>${item.price.toFixed(2)}</TableCell>
                    <TableCell>
                      <Badge variant={item.available ? "default" : "secondary"} className={item.available ? "bg-success/15 text-success hover:bg-success/20" : ""}>
                        {item.available ? "Available" : "Hidden"}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-right">
                      <Button variant="ghost" size="icon" aria-label="Edit"><Pencil className="h-4 w-4" /></Button>
                      <Button variant="ghost" size="icon" aria-label="Delete" onClick={() => deleteItem(item.id)}><Trash2 className="h-4 w-4 text-destructive" /></Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </section>

        {/* Orders */}
        <section className="mt-10 rounded-2xl border border-border bg-card shadow-soft">
          <div className="border-b border-border p-5">
            <h2 className="font-display text-lg font-bold">Order management</h2>
            <p className="text-sm text-muted-foreground">Track and update order status</p>
          </div>
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Order</TableHead>
                  <TableHead>Customer</TableHead>
                  <TableHead>Items</TableHead>
                  <TableHead>Total</TableHead>
                  <TableHead>Status</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {orders.map((o) => (
                  <TableRow key={o.id}>
                    <TableCell className="font-mono font-medium">{o.id}</TableCell>
                    <TableCell>{o.customer}</TableCell>
                    <TableCell>{o.items}</TableCell>
                    <TableCell>${o.total.toFixed(2)}</TableCell>
                    <TableCell>
                      <span className={`inline-flex rounded-full border px-2.5 py-0.5 text-xs font-semibold ${statusStyle[o.status]}`}>
                        {o.status}
                      </span>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </section>

        {/* Coupons */}
        <section className="mt-10 rounded-2xl border border-border bg-card shadow-soft">
          <div className="flex items-center justify-between border-b border-border p-5">
            <div>
              <h2 className="font-display text-lg font-bold">Discount coupons</h2>
              <p className="text-sm text-muted-foreground">Create promotions for your customers</p>
            </div>
            <CouponDialog onSave={(c) => { setCoupons((p) => [...p, { ...c, id: crypto.randomUUID() }]); toast.success("Coupon created"); }} />
          </div>
          <div className="grid grid-cols-1 gap-4 p-5 sm:grid-cols-2 lg:grid-cols-3">
            {coupons.map((c) => (
              <div key={c.id} className="rounded-xl border border-dashed border-primary/40 bg-gradient-warm/5 p-4">
                <div className="flex items-center gap-2">
                  <Tag className="h-4 w-4 text-primary" />
                  <span className="font-mono text-base font-bold">{c.code}</span>
                </div>
                <p className="mt-2 text-sm font-semibold">{c.discount}</p>
                <p className="text-xs text-muted-foreground">{c.usage}</p>
                <p className="mt-3 text-xs text-muted-foreground">Expires {c.expiry}</p>
              </div>
            ))}
          </div>
        </section>
      </main>
    </div>
  );
};

const MenuItemDialog = ({ onSave }: { onSave: (item: Omit<MenuItem, "id">) => void }) => {
  const [open, setOpen] = useState(false);
  const [name, setName] = useState("");
  const [price, setPrice] = useState("");
  const [category, setCategory] = useState("");

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="hero" size="sm"><Plus className="h-4 w-4" />Add item</Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader><DialogTitle>Add menu item</DialogTitle></DialogHeader>
        <div className="space-y-4">
          <div><Label>Name</Label><Input value={name} onChange={(e) => setName(e.target.value)} placeholder="Margherita Pizza" /></div>
          <div className="grid grid-cols-2 gap-3">
            <div><Label>Price ($)</Label><Input type="number" value={price} onChange={(e) => setPrice(e.target.value)} placeholder="12.50" /></div>
            <div><Label>Category</Label><Input value={category} onChange={(e) => setCategory(e.target.value)} placeholder="Pizza" /></div>
          </div>
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={() => setOpen(false)}>Cancel</Button>
          <Button variant="hero" onClick={() => {
            if (!name || !price || !category) return toast.error("Fill all fields");
            onSave({ name, price: parseFloat(price), category, available: true });
            setOpen(false); setName(""); setPrice(""); setCategory("");
          }}>Save item</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

const CouponDialog = ({ onSave }: { onSave: (c: Omit<Coupon, "id">) => void }) => {
  const [open, setOpen] = useState(false);
  const [code, setCode] = useState("");
  const [discount, setDiscount] = useState("");
  const [expiry, setExpiry] = useState("");
  const [usage, setUsage] = useState("");

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="hero" size="sm"><Plus className="h-4 w-4" />Create coupon</Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader><DialogTitle>Create discount coupon</DialogTitle></DialogHeader>
        <div className="space-y-4">
          <div><Label>Coupon code</Label><Input value={code} onChange={(e) => setCode(e.target.value.toUpperCase())} placeholder="SAVE20" /></div>
          <div><Label>Discount</Label><Input value={discount} onChange={(e) => setDiscount(e.target.value)} placeholder="20% off" /></div>
          <div className="grid grid-cols-2 gap-3">
            <div><Label>Expiry date</Label><Input type="date" value={expiry} onChange={(e) => setExpiry(e.target.value)} /></div>
            <div><Label>Usage rules</Label><Input value={usage} onChange={(e) => setUsage(e.target.value)} placeholder="Min order $10" /></div>
          </div>
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={() => setOpen(false)}>Cancel</Button>
          <Button variant="hero" onClick={() => {
            if (!code || !discount || !expiry) return toast.error("Fill required fields");
            onSave({ code, discount, expiry, usage: usage || "No restrictions" });
            setOpen(false); setCode(""); setDiscount(""); setExpiry(""); setUsage("");
          }}>Create</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default SellerDashboard;
