import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { prisma } from "@/lib/prisma";
import { Plus } from "lucide-react";

export const dynamic = "force-dynamic";

export default async function AdminPlayersPage() {
  const players = await prisma.player.findMany({
    orderBy: { name: "asc" },
    take: 50,
    include: { team: { select: { name: true } } },
  });

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">إدارة اللاعبين</h1>
        <Button variant="accent">
          <Plus className="w-4 h-4 ml-2" />
          إضافة لاعب
        </Button>
      </div>

      <Card className="overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-muted/50">
              <tr className="text-xs text-muted-foreground">
                <th className="text-right p-3 font-medium">اللاعب</th>
                <th className="text-right p-3 font-medium">المركز</th>
                <th className="text-right p-3 font-medium">الفريق</th>
                <th className="text-center p-3 font-medium">الرقم</th>
                <th className="text-center p-3 font-medium">العمر</th>
                <th className="text-center p-3 font-medium">الجنسية</th>
                <th className="text-center p-3 font-medium">الإجراءات</th>
              </tr>
            </thead>
            <tbody>
              {players.map((p) => (
                <tr key={p.id} className="border-b border-muted/50 hover:bg-accent/30 text-sm">
                  <td className="p-3 font-medium">{p.name}</td>
                  <td className="p-3 text-muted-foreground">{p.position || "—"}</td>
                  <td className="p-3 text-muted-foreground">{p.team?.name || "—"}</td>
                  <td className="p-3 text-center">{p.number || "—"}</td>
                  <td className="p-3 text-center">{p.age || "—"}</td>
                  <td className="p-3 text-center">{p.nationality || "—"}</td>
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
