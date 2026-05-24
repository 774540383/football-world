import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { prisma } from "@/lib/prisma";
import { Plus } from "lucide-react";

export const dynamic = "force-dynamic";

export default async function AdminAdsPage() {
  const ads = await prisma.ad.findMany({ orderBy: { createdAt: "desc" } });

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">إدارة الإعلانات</h1>
        <Button variant="accent">
          <Plus className="w-4 h-4 ml-2" />
          إضافة إعلان
        </Button>
      </div>

      <Card className="overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-muted/50">
              <tr className="text-xs text-muted-foreground">
                <th className="text-right p-3 font-medium">الاسم</th>
                <th className="text-right p-3 font-medium">النوع</th>
                <th className="text-right p-3 font-medium">الموضع</th>
                <th className="text-center p-3 font-medium">الحالة</th>
                <th className="text-center p-3 font-medium">النقرات</th>
                <th className="text-center p-3 font-medium">المشاهدات</th>
                <th className="text-center p-3 font-medium">الإجراءات</th>
              </tr>
            </thead>
            <tbody>
              {ads.map((ad) => (
                <tr key={ad.id} className="border-b border-muted/50 hover:bg-accent/30 text-sm">
                  <td className="p-3 font-medium">{ad.name}</td>
                  <td className="p-3 text-muted-foreground">{ad.type}</td>
                  <td className="p-3 text-muted-foreground">{ad.position}</td>
                  <td className="p-3 text-center">
                    <span className={`text-xs font-medium ${ad.active ? "text-emerald-500" : "text-red-500"}`}>
                      {ad.active ? "نشط" : "متوقف"}
                    </span>
                  </td>
                  <td className="p-3 text-center">{ad.clicks}</td>
                  <td className="p-3 text-center">{ad.views}</td>
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
