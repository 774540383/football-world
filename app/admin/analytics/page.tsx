import { Card } from "@/components/ui/card";
import { prisma } from "@/lib/prisma";
import { BarChart3, TrendingUp, Users, Eye } from "lucide-react";

export const dynamic = "force-dynamic";

export default async function AdminAnalyticsPage() {
  const [totalViews, totalUsers, totalMatches, newsCount] = await Promise.all([
    prisma.news.aggregate({ _sum: { views: true } }),
    prisma.user.count(),
    prisma.match.count(),
    prisma.news.count(),
  ]);

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold">الإحصائيات والتحليلات</h1>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          { label: "إجمالي المشاهدات", value: totalViews._sum.views || 0, icon: Eye, color: "text-blue-500", bg: "bg-blue-500/10" },
          { label: "إجمالي المستخدمين", value: totalUsers, icon: Users, color: "text-purple-500", bg: "bg-purple-500/10" },
          { label: "إجمالي المباريات", value: totalMatches, icon: TrendingUp, color: "text-emerald-500", bg: "bg-emerald-500/10" },
          { label: "إجمالي الأخبار", value: newsCount, icon: BarChart3, color: "text-orange-500", bg: "bg-orange-500/10" },
        ].map((stat) => {
          const Icon = stat.icon;
          return (
            <Card key={stat.label} className="p-5">
              <div className="flex items-center gap-4">
                <div className={`w-12 h-12 rounded-2xl ${stat.bg} flex items-center justify-center`}>
                  <Icon className={`w-6 h-6 ${stat.color}`} />
                </div>
                <div>
                  <p className="text-2xl font-bold">{stat.value.toLocaleString()}</p>
                  <p className="text-xs text-muted-foreground">{stat.label}</p>
                </div>
              </div>
            </Card>
          );
        })}
      </div>

      <Card className="p-6">
        <h3 className="font-bold mb-4">تحليلات الموقع</h3>
        <p className="text-sm text-muted-foreground">
          يتم جمع بيانات التحليلات بشكل تلقائي. قم بربط Google Analytics لمزيد من التفاصيل.
        </p>
      </Card>
    </div>
  );
}
