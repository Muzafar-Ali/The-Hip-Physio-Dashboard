// app/dashboard/page.tsx
'use client';
import { useEffect } from 'react';
import { useDashboardStore } from '@/stores/useDashboardStore';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Users, User, ShieldAlert, UserX } from 'lucide-react';
import { Skeleton } from '@/components/ui/skeleton';
// ... other imports for charts and tables

export default function DashboardPage() {
  const { analytics, loading, fetchAnalytics } = useDashboardStore();

  useEffect(() => {
    fetchAnalytics();
  }, [fetchAnalytics]);

  const kpiIcons = { "Total Users": Users, "Active Users (Week)": User, "Highest Irritability": ShieldAlert, "Least Compliant": UserX };

  if (loading || !analytics) {
    return <DashboardSkeleton />; // A skeleton loading component
  }

  const kpis = [
      { title: "Total Users", value: analytics.kpi.totalUsers, change: "+12%" },
      { title: "Active Users (Week)", value: analytics.kpi.activeUsers, change: "+5%" },
      { title: "Highest Irritability", value: analytics.kpi.highestIrritability.value, change: analytics.kpi.highestIrritability.user },
      { title: "Least Compliant", value: analytics.kpi.leastCompliant.value, change: analytics.kpi.leastCompliant.user },
  ];

  return (
    <div className="space-y-6">
      {/* KPI Cards */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {kpis.map((kpi) => {
            const Icon = kpiIcons[kpi.title as keyof typeof kpiIcons];
            return (
              <Card key={kpi.title}>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">{kpi.title}</CardTitle>
                  <Icon className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{kpi.value}</div>
                  <p className="text-xs text-muted-foreground">{kpi.change}</p>
                </CardContent>
              </Card>
            )
        })}
      </div>
      {/* Charts and Tables would go here, using analytics.charts and analytics.tables */}
    </div>
  );
}

const DashboardSkeleton = () => (
    <div className="space-y-6">
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
            {Array.from({length: 4}).map((_, i) => <Skeleton key={i} className="h-28" />)}
        </div>
        <div className="grid gap-4 md:grid-cols-2">
            <Skeleton className="h-80" />
            <Skeleton className="h-80" />
        </div>
    </div>
)