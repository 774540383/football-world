import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { prisma } from "@/lib/prisma";
import { Plus } from "lucide-react";

export const dynamic = "force-dynamic";

export default async function AdminLeaguesPage() {
  const leagues = await prisma.league.findMany({
    orderBy: { name: "asc" },
    include: { _count: { select: { teams: true, matches: true } } },
  });

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">إدارة الدوريات</h1>
        <Button variant="accent">
          <Plus className="w-4 h-4 ml-2" />
          إضافة دوري
        </Button>
      </div>

      <Card className="overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-muted/50">
              <tr className="text-xs text-muted-foreground">
                <th className="text-right p-3 font-medium">الدوري</th>
                <th className="text-right p-3 font-medium">الدولة</th>
                <th className="text-center p-3 font-medium">الموسم</th>
                <th className="text-center p-3 font-medium">الفرق</th>
                <th className="text-center p-3 font-medium">المباريات</th>
                <th className="text-center p-3 font-medium">الإجراءات</th>
              </tr>
            </thead>
            <tbody>
              {leagues.map((l) => (
                <tr key={l.id} className="border-b border-muted/50 hover:bg-accent/30 text-sm">
                  <td className="p-3 font-medium">{l.nameAr || l.name}</td>
                  <td className="p-3 text-muted-foreground">{l.country || "—"}</td>
                  <td className="p-3 text-center">{l.season}</td>
                  <td className="p-3 text-center">{l._count.teams}</td>
                  <td className="p-3 text-center">{l._count.matches}</td>
                  <td className="p-3 text-center">
                    <div className="flex justify-center gap-2">
                      <Button variant="ghost" size="sm">تعديل</Button>
                      <Button variant="destructive" size="sm">حذف</Button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>
    </div>
  );
}
