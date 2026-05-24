import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { prisma } from "@/lib/prisma";
import { Plus } from "lucide-react";

export const dynamic = "force-dynamic";

export default async function AdminTeamsPage() {
  const teams = await prisma.team.findMany({
    orderBy: { name: "asc" },
    include: { league: { select: { name: true } }, _count: { select: { players: true } } },
  });

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">إدارة الفرق</h1>
        <Button variant="accent">
          <Plus className="w-4 h-4 ml-2" />
          إضافة فريق
        </Button>
      </div>

      <Card className="overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-muted/50">
              <tr className="text-xs text-muted-foreground">
                <th className="text-right p-3 font-medium">الفريق</th>
                <th className="text-right p-3 font-medium">الدوري</th>
                <th className="text-center p-3 font-medium">اللاعبين</th>
                <th className="text-center p-3 font-medium">التقييم</th>
                <th className="text-center p-3 font-medium">الإجراءات</th>
              </tr>
            </thead>
            <tbody>
              {teams.map((team) => (
                <tr key={team.id} className="border-b border-muted/50 hover:bg-accent/30 text-sm">
                  <td className="p-3 font-medium">{team.nameAr || team.name}</td>
                  <td className="p-3 text-muted-foreground">{team.league?.name || "—"}</td>
                  <td className="p-3 text-center">{team._count.players}</td>
                  <td className="p-3 text-center">{team.rating.toFixed(1)}</td>
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
