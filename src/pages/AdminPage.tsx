import React from "react";
import { useQuery } from "convex/react";
import { api } from "@convex/_generated/api";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell } from 'recharts';
import { formatCurrency } from "@/lib/format";
import { TrendingUp, Users, ShoppingBag, Award } from "lucide-react";
export function AdminPage() {
  const stats = useQuery(api.pos.getDashboardStats);
  const products = useQuery(api.pos.getProducts);
  if (!stats) return <div className="p-8">Chargement...</div>;
  const lowStock = products?.filter(p => p.stock <= p.minStockThreshold).length ?? 0;
  const cards = [
    { title: "CA Aujourd'hui", value: formatCurrency(stats.dailyRevenue), icon: TrendingUp, color: "text-emerald-500", bg: "bg-emerald-500/10" },
    { title: "Transactions", value: stats.dailyTransactions, icon: ShoppingBag, color: "text-indigo-500", bg: "bg-indigo-500/10" },
    { title: "Alertes Stock", value: lowStock, icon: Users, color: "text-rose-500", bg: "bg-rose-500/10" },
    { title: "Panier Moyen", value: stats.dailyTransactions > 0 ? formatCurrency(stats.dailyRevenue / stats.dailyTransactions) : "0,00 €", icon: Award, color: "text-amber-500", bg: "bg-amber-500/10" },
  ];
  const chartData = stats.topProducts.map(p => ({
    name: p.name,
    qty: p.qty
  }));
  const COLORS = ['#10b981', '#6366f1', '#f59e0b', '#f43f5e', '#8b5cf6'];
  return (
    <div className="space-y-10 animate-fade-in pb-20">
      <h1 className="text-4xl font-black tracking-tight">Tableau de Bord</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {cards.map((card, i) => (
          <Card key={i} className="border-none shadow-sm rounded-3xl overflow-hidden">
            <CardContent className="p-6 flex items-center gap-4">
              <div className={`${card.bg} p-4 rounded-2xl`}>
                <card.icon className={`h-6 w-6 ${card.color}`} />
              </div>
              <div>
                <p className="text-sm font-bold text-muted-foreground uppercase tracking-wider">{card.title}</p>
                <h3 className="text-2xl font-black tracking-tight">{card.value}</h3>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        <Card className="lg:col-span-8 border-none shadow-sm rounded-4xl bg-white dark:bg-slate-900">
          <CardHeader>
            <CardTitle className="text-xl font-bold">Top 5 des ventes (Volume)</CardTitle>
          </CardHeader>
          <CardContent className="h-[400px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={chartData} layout="vertical" margin={{ left: 40, right: 40 }}>
                <CartesianGrid strokeDasharray="3 3" horizontal={false} opacity={0.1} />
                <XAxis type="number" hide />
                <YAxis dataKey="name" type="category" axisLine={false} tickLine={false} width={100} fontSize={12} fontWeight="bold" />
                <Tooltip 
                  cursor={{ fill: 'rgba(0,0,0,0.05)' }} 
                  contentStyle={{ borderRadius: '16px', border: 'none', boxShadow: '0 10px 15px -3px rgba(0,0,0,0.1)' }}
                />
                <Bar dataKey="qty" radius={[0, 8, 8, 0]} barSize={32}>
                  {chartData.map((_, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
        <Card className="lg:col-span-4 border-none shadow-sm rounded-4xl overflow-hidden">
          <CardHeader>
            <CardTitle className="text-xl font-bold">Alertes Inventaire</CardTitle>
          </CardHeader>
          <CardContent className="p-0">
            <div className="divide-y">
              {products?.filter(p => p.stock <= p.minStockThreshold).slice(0, 6).map((p) => (
                <div key={p._id} className="flex items-center justify-between p-4 hover:bg-muted/50 transition-colors">
                  <div className="flex items-center gap-3">
                    <span className="text-2xl">{p.emoji}</span>
                    <div>
                      <p className="font-bold text-sm leading-tight">{p.name}</p>
                      <p className="text-xs text-muted-foreground">Min requis: {p.minStockThreshold}</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <span className={`font-black text-lg ${p.stock === 0 ? 'text-rose-500' : 'text-amber-500'}`}>
                      {p.stock}
                    </span>
                  </div>
                </div>
              ))}
              {lowStock === 0 && (
                <div className="p-10 text-center text-muted-foreground italic">
                  Aucune alerte de stock en cours ✨
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}