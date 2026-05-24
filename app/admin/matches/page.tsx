import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { prisma } from "@/lib/prisma";
import { Plus } from "lucide-react";
import Link from "next/link";

export const dynamic = "force-dynamic";

export default async function AdminMatchesPage() {
  const matches = await prisma.match.findMany({
    orderBy: { date: "desc" },
    take: 20,
    include: { homeTeam: true, awayTeam: true, league: true },
  });

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">إدارة المباريات</h1>
        <Button variant="accent">
          <Plus className="w-4 h-4 ml-2" />
          إضافة مباراة
        </Button>
      </div>

      <Card className="overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-muted/50">
              <tr className="text-xs text-muted-foreground">
                <th className="text-right p-3 font-medium">الفريقين</th>
                <th className="text-right p-3 font-medium">البطولة</th>
                <th className="text-center p-3 font-medium">النتيجة</th>
                <th className="text-center p-3 font-medium">الحالة</th>
                <th className="text-center p-3 font-medium">التاريخ</th>
                <th className="text-center p-3 font-medium">الإجراءات</th>
              </tr>
            </thead>
            <tbody>
              {matches.map((m) => (
                <tr key={m.id} className="border-b border-muted/50 hover:bg-accent/30 text-sm">
                  <td className="p-3">{m.homeTeam.name} vs {m.awayTeam.name}</td>
                  <td className="p-3 text-muted-foreground">{m.league?.name || "—"}</td>
                  <td className="p-3 text-center font-bold">{m.homeScore ?? "-"}:{m.awayScore ?? "-"}</td>
                  <td className="p-3 text-center">{m.status}</td>
                  <td className="p-3 text-center text-muted-foreground">
                    {new Date(m.date).toLocaleDateString("ar-EG")}
                  </td>
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
