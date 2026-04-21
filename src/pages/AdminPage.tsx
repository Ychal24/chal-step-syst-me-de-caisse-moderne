import React, { useState, useMemo } from "react";
import { useQuery, useMutation } from "convex/react";
import { api } from "@convex/_generated/api";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell } from 'recharts';
import { formatCurrency, formatDate } from "@/lib/format";
import { TrendingUp, ShoppingBag, AlertTriangle, PieChart, Clock, Users, PlusCircle, UserCheck, UserMinus, ShieldAlert } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { Id } from "@convex/_generated/dataModel";
import { useAuthStore } from "@/store/useAuthStore";
export function AdminPage() {
  const userRole = useAuthStore(s => s.userRole);
  const stats = useQuery(api.pos.getDashboardStats, {});
  const products = useQuery(api.pos.getProducts, {});
  const sellers = useQuery(api.pos.getSellers, {});
  const [selectedSellerFilter, setSelectedSellerFilter] = useState<string>("all");
  const transactions = useQuery(api.pos.getTransactions, {
    limit: 10,
    sellerId: selectedSellerFilter === "all" ? undefined : (selectedSellerFilter as Id<"sellers">)
  });
  const createSeller = useMutation(api.pos.createSeller);
  const updateSeller = useMutation(api.pos.updateSeller);
  const sellerChartData = useMemo(() => {
    if (!stats?.sellerPerformance) return [];
    return stats.sellerPerformance.map(p => ({
      name: p.name,
      val: p.revenue / 100
    }));
  }, [stats]);
  if (userRole !== 'admin') {
    return (
      <div className="flex flex-col items-center justify-center h-full min-h-[60vh] text-center p-8">
        <div className="h-20 w-20 bg-rose-100 rounded-3xl flex items-center justify-center mb-6">
          <ShieldAlert className="h-10 w-10 text-rose-600" />
        </div>
        <h1 className="text-3xl font-black uppercase tracking-tighter">Accès Refusé</h1>
        <p className="text-muted-foreground mt-2 max-w-sm">Désolé, cette section est réservée exclusivement aux administrateurs du système.</p>
      </div>
    );
  }
  if (!stats) return <div className="max-w-7xl mx-auto p-12 text-center font-bold">Chargement de l'analytics...</div>;
  const lowStockProducts = products?.filter(p => p.stock <= p.minStockThreshold) ?? [];
  const lowStockCount = lowStockProducts.length;
  const handleAddSeller = async () => {
    const name = prompt("Nom du nouveau vendeur :");
    const pin = prompt("Définir un code PIN (4 chiffres) :");
    if (name && pin) {
      if (pin.length !== 4 || isNaN(Number(pin))) {
        toast.error("Le code PIN doit être composé de 4 chiffres.");
        return;
      }
      await createSeller({ name, active: true, pin });
      toast.success("Vendeur ajouté");
    }
  };
  const toggleSeller = async (id: Id<"sellers">, currentStatus: boolean) => {
    await updateSeller({ id, updates: { active: !currentStatus } });
    toast.info("Statut mis à jour");
  };
  const averageBasket = stats.dailyTransactions > 0 ? stats.dailyRevenue / stats.dailyTransactions : 0;
  const cards = [
    { title: "CA Aujourd'hui", value: formatCurrency(stats.dailyRevenue), icon: TrendingUp, color: "text-emerald-500", bg: "bg-emerald-500/10" },
    { title: "Transactions", value: stats.dailyTransactions, icon: ShoppingBag, color: "text-indigo-500", bg: "bg-indigo-500/10" },
    { title: "Alertes Stock", value: lowStockCount, icon: AlertTriangle, color: "text-rose-500", bg: "bg-rose-500/10" },
    { title: "Moyen / Panier", value: formatCurrency(averageBasket), icon: PieChart, color: "text-amber-500", bg: "bg-amber-500/10" },
  ];
  const COLORS = ['#10b981', '#6366f1', '#f59e0b', '#f43f5e', '#8b5cf6', '#ec4899', '#06b6d4'];
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 md:py-10 lg:py-12 animate-fade-in space-y-10 pb-20">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-end gap-4">
        <div>
          <h1 className="text-5xl font-black tracking-tighter uppercase text-foreground">Dashboard</h1>
          <p className="text-muted-foreground font-medium">Analyse de performance en temps réel.</p>
        </div>
        <Button onClick={handleAddSeller} className="rounded-2xl h-12 px-6 btn-gradient">
          <PlusCircle className="mr-2 h-5 w-5" /> Ajouter Vendeur
        </Button>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {cards.map((card, i) => (
          <Card key={i} className="border shadow-soft rounded-3xl overflow-hidden hover:scale-[1.02] transition-transform duration-300">
            <CardContent className="p-6 flex items-center gap-4">
              <div className={cn(card.bg, "p-4 rounded-2xl")}>
                <card.icon className={cn("h-7 w-7", card.color)} />
              </div>
              <div>
                <p className="text-[10px] font-black text-muted-foreground uppercase tracking-widest">{card.title}</p>
                <h3 className="text-2xl font-black tracking-tighter">{card.value}</h3>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        <Card className="lg:col-span-8 border-none shadow-soft rounded-[2.5rem] bg-card/50 overflow-hidden">
          <CardHeader className="bg-muted/30 pb-6 border-b flex flex-row items-center justify-between">
            <CardTitle className="text-xl font-black uppercase tracking-tight flex items-center gap-2">
              <Users className="h-5 w-5 text-indigo-500" /> Performance Staff
            </CardTitle>
          </CardHeader>
          <CardContent className="h-[450px] w-full pt-10 px-6">
            {sellerChartData.length > 0 ? (
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={sellerChartData} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} strokeOpacity={0.1} />
                  <XAxis dataKey="name" axisLine={false} tickLine={false} fontSize={12} fontWeight="bold" />
                  <YAxis axisLine={false} tickLine={false} fontSize={12} fontWeight="bold" tickFormatter={(v) => `${v} DH`} />
                  <Tooltip
                    cursor={{ fill: 'rgba(0,0,0,0.02)' }}
                    contentStyle={{ borderRadius: '16px', border: 'none', boxShadow: '0 20px 25px -5px rgba(0,0,0,0.1)', fontWeight: 'bold' }}
                    formatter={(v: number) => [`${v.toFixed(2)} DH`, 'CA']}
                  />
                  <Bar dataKey="val" radius={[12, 12, 0, 0]} barSize={50}>
                    {sellerChartData.map((_, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            ) : (
              <div className="flex items-center justify-center h-full text-muted-foreground italic">Aucune donnée disponible</div>
            )}
          </CardContent>
        </Card>
        <div className="lg:col-span-4 space-y-8">
           <Card className="border shadow-soft rounded-[2.5rem] overflow-hidden">
            <CardHeader className="bg-indigo-600 text-white pb-6">
              <CardTitle className="text-lg font-black uppercase flex items-center gap-2">
                <Users className="h-5 w-5" /> Gestion Staff
              </CardTitle>
            </CardHeader>
            <CardContent className="p-0">
              <div className="divide-y max-h-[400px] overflow-y-auto custom-scrollbar">
                {sellers?.map((s) => (
                  <div key={s._id} className="flex items-center justify-between p-4 hover:bg-muted/50 transition-colors">
                    <div className="flex items-center gap-3">
                      <div className={cn("h-8 w-8 rounded-full flex items-center justify-center font-black text-xs", s.active ? "bg-emerald-100 text-emerald-700" : "bg-muted text-muted-foreground")}>
                        {s.name.charAt(0)}
                      </div>
                      <p className={cn("font-bold", !s.active && "text-muted-foreground")}>{s.name}</p>
                    </div>
                    <Button variant="ghost" size="icon" onClick={() => toggleSeller(s._id, s.active)}>
                      {s.active ? <UserCheck className="h-4 w-4 text-emerald-500" /> : <UserMinus className="h-4 w-4 text-muted-foreground" />}
                    </Button>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
          <Card className="border shadow-soft rounded-[2.5rem] overflow-hidden">
            <CardHeader className="bg-rose-500 text-white pb-6">
              <CardTitle className="text-lg font-black uppercase flex items-center gap-2">
                <AlertTriangle className="h-5 w-5" /> Alertes Stock ({lowStockCount})
              </CardTitle>
            </CardHeader>
            <CardContent className="p-0">
              <div className="divide-y max-h-[250px] overflow-y-auto custom-scrollbar">
                {lowStockProducts.map((p) => (
                  <div key={p._id} className="flex items-center justify-between p-4 hover:bg-muted/50 transition-colors">
                    <div className="flex items-center gap-3">
                      <span className="text-3xl">{p.emoji}</span>
                      <p className="font-black text-sm text-foreground">{p.name}</p>
                    </div>
                    <span className={cn("font-black text-xl tabular-nums", p.stock === 0 ? 'text-rose-500' : 'text-amber-500')}>{p.stock}</span>
                  </div>
                ))}
                {lowStockCount === 0 && <div className="p-8 text-center text-xs text-muted-foreground italic">Aucune alerte</div>}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
      <Card className="border shadow-soft rounded-[2.5rem] overflow-hidden">
        <CardHeader className="bg-indigo-500 text-white pb-6 flex flex-col sm:flex-row items-center justify-between gap-4">
          <CardTitle className="text-xl font-black uppercase flex items-center gap-2">
            <Clock className="h-5 w-5" /> Transactions Récentes
          </CardTitle>
          <div className="flex items-center gap-2">
            <span className="text-[10px] font-black uppercase">Filtre :</span>
            <select
              value={selectedSellerFilter}
              onChange={(e) => setSelectedSellerFilter(e.target.value)}
              className="bg-white/20 border-none rounded-lg text-xs font-bold px-3 py-1 outline-none text-white cursor-pointer"
            >
              <option value="all" className="text-black">Tous</option>
              {sellers?.map(s => <option key={s._id} value={s._id} className="text-black">{s.name}</option>)}
            </select>
          </div>
        </CardHeader>
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead className="bg-muted/50 text-[10px] font-black uppercase tracking-widest text-muted-foreground h-12 border-b">
                <tr>
                  <th className="px-6">Date & Heure</th>
                  <th className="px-6">Vendeur</th>
                  <th className="px-6">Articles</th>
                  <th className="px-6">Paiement</th>
                  <th className="px-6 text-right">Montant</th>
                </tr>
              </thead>
              <tbody className="divide-y">
                {transactions?.map((t) => (
                  <tr key={t._id} className="hover:bg-muted/20 h-16 transition-colors">
                    <td className="px-6 text-sm font-bold text-foreground">{formatDate(t.timestamp)}</td>
                    <td className="px-6 font-bold text-xs uppercase text-muted-foreground">{t.sellerName}</td>
                    <td className="px-6 text-xs font-medium text-muted-foreground">
                      {t.items.slice(0, 3).map(i => `${i.quantity}x ${i.name}`).join(", ")}
                      {t.items.length > 3 && " ..."}
                    </td>
                    <td className="px-6">
                      <span className="px-2 py-1 rounded bg-secondary text-[9px] font-black uppercase tracking-widest border">
                        {t.method}
                      </span>
                    </td>
                    <td className="px-6 text-right font-black text-primary text-lg">{formatCurrency(t.total)}</td>
                  </tr>
                ))}
                {(!transactions || transactions.length === 0) && (
                  <tr>
                    <td colSpan={5} className="py-12 text-center text-muted-foreground italic">Aucune transaction</td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}