import React from "react";
import { useQuery } from "convex/react";
import { api } from "@convex/_generated/api";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell } from 'recharts';
import { formatCurrency, formatDate } from "@/lib/format";
import { TrendingUp, ShoppingBag, AlertTriangle, PieChart, Clock } from "lucide-react";
import { cn } from "@/lib/utils";
export function AdminPage() {
  const stats = useQuery(api.pos.getDashboardStats);
  const products = useQuery(api.pos.getProducts);
  const transactions = useQuery(api.pos.getTransactions, { limit: 10 });
  if (!stats) return <div className="max-w-7xl mx-auto p-12">Chargement de l'analytics...</div>;
  const lowStockProducts = products?.filter(p => p.stock <= p.minStockThreshold) ?? [];
  const lowStockCount = lowStockProducts.length;
  const cards = [
    { title: "CA Aujourd'hui", value: formatCurrency(stats.dailyRevenue), icon: TrendingUp, color: "text-emerald-500", bg: "bg-emerald-500/10" },
    { title: "Transactions", value: stats.dailyTransactions, icon: ShoppingBag, color: "text-indigo-500", bg: "bg-indigo-500/10" },
    { title: "Alertes Stock", value: lowStockCount, icon: AlertTriangle, color: "text-rose-500", bg: "bg-rose-500/10" },
    { title: "Moyen / Panier", value: stats.dailyTransactions > 0 ? formatCurrency(stats.dailyRevenue / stats.dailyTransactions) : "0,00 DH", icon: PieChart, color: "text-amber-500", bg: "bg-amber-500/10" },
  ];
  const chartData = stats.topProducts.map(p => ({
    name: p.name,
    qty: p.qty
  }));
  const COLORS = ['#10b981', '#6366f1', '#f59e0b', '#f43f5e', '#8b5cf6'];
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 md:py-10 lg:py-12 animate-fade-in space-y-10 pb-20">
      <div>
        <h1 className="text-5xl font-black tracking-tighter uppercase text-foreground">Dashboard</h1>
        <p className="text-muted-foreground font-medium">Vue d'ensemble de la performance de votre point de vente.</p>
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
          <CardHeader className="bg-muted/30 pb-6 border-b">
            <CardTitle className="text-xl font-black uppercase tracking-tight flex items-center gap-2">
              <TrendingUp className="h-5 w-5 text-primary" /> Top 5 des volumes de vente
            </CardTitle>
          </CardHeader>
          <CardContent className="h-[450px] w-full pt-10">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={chartData} layout="vertical" margin={{ left: 30, right: 60 }}>
                <CartesianGrid strokeDasharray="3 3" horizontal={false} strokeOpacity={0.1} />
                <XAxis type="number" hide />
                <YAxis dataKey="name" type="category" axisLine={false} tickLine={false} width={120} fontSize={12} fontWeight="bold" />
                <Tooltip 
                  cursor={{ fill: 'rgba(0,0,0,0.02)' }}
                  contentStyle={{ borderRadius: '16px', border: 'none', boxShadow: '0 20px 25px -5px rgba(0,0,0,0.1)', fontWeight: 'bold' }}
                />
                <Bar dataKey="qty" radius={[0, 12, 12, 0]} barSize={40} animationDuration={1500}>
                  {chartData.map((_, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
        <div className="lg:col-span-4 space-y-8">
          <Card className="border shadow-soft rounded-[2.5rem] overflow-hidden h-full">
            <CardHeader className="bg-rose-500 text-white pb-6">
              <CardTitle className="text-lg font-black uppercase flex items-center gap-2">
                <AlertTriangle className="h-5 w-5" /> Alertes Stock ({lowStockCount})
              </CardTitle>
            </CardHeader>
            <CardContent className="p-0">
              <div className="divide-y max-h-[350px] overflow-y-auto">
                {lowStockProducts.slice(0, 8).map((p) => (
                  <div key={p._id} className="flex items-center justify-between p-4 hover:bg-muted/50 transition-colors">
                    <div className="flex items-center gap-3">
                      <span className="text-3xl select-none">{p.emoji}</span>
                      <div>
                        <p className="font-black text-sm leading-tight text-foreground">{p.name}</p>
                        <p className="text-[10px] uppercase font-bold text-muted-foreground tracking-widest">Min: {p.minStockThreshold}</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <span className={cn(
                        "font-black text-xl tabular-nums",
                        p.stock === 0 ? 'text-rose-500' : 'text-amber-500'
                      )}>
                        {p.stock}
                      </span>
                    </div>
                  </div>
                ))}
                {lowStockCount === 0 && (
                  <div className="p-16 text-center text-muted-foreground italic flex flex-col items-center gap-3">
                    <div className="h-12 w-12 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center">✨</div>
                    <p className="font-bold">Stock impeccable !</p>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
      <Card className="border shadow-soft rounded-[2.5rem] overflow-hidden">
        <CardHeader className="bg-indigo-500 text-white pb-6">
          <CardTitle className="text-xl font-black uppercase flex items-center gap-2">
            <Clock className="h-5 w-5" /> Transactions Récentes
          </CardTitle>
        </CardHeader>
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead className="bg-muted/50 text-[10px] font-black uppercase tracking-widest text-muted-foreground h-12 border-b">
                <tr>
                  <th className="px-6">Date & Heure</th>
                  <th className="px-6">Articles</th>
                  <th className="px-6">Paiement</th>
                  <th className="px-6 text-right">Montant</th>
                </tr>
              </thead>
              <tbody className="divide-y">
                {transactions?.map((t) => (
                  <tr key={t._id} className="hover:bg-muted/20 h-16 transition-colors">
                    <td className="px-6 text-sm font-bold text-foreground">{formatDate(t.timestamp)}</td>
                    <td className="px-6 text-xs font-medium text-muted-foreground">
                      {t.items.map(i => `${i.quantity}x ${i.name}`).join(", ")}
                    </td>
                    <td className="px-6">
                      <Badge variant="outline" className="font-black uppercase text-[9px] tracking-widest">
                        {t.method}
                      </Badge>
                    </td>
                    <td className="px-6 text-right font-black text-primary text-lg">{formatCurrency(t.total)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}