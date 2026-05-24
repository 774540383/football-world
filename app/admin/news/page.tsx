import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { prisma } from "@/lib/prisma";
import { Plus, Eye } from "lucide-react";
import Link from "next/link";

export const dynamic = "force-dynamic";

export default async function AdminNewsPage() {
  const news = await prisma.news.findMany({
    orderBy: { createdAt: "desc" },
    take: 20,
    select: {
      id: true, title: true, category: true, views: true,
      published: true, createdAt: true, author: { select: { name: true } },
    },
  });

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">إدارة الأخبار</h1>
        <Button variant="accent">
          <Plus className="w-4 h-4 ml-2" />
          إضافة خبر
        </Button>
      </div>

      <Card className="overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-muted/50">
              <tr className="text-xs text-muted-foreground">
                <th className="text-right p-3 font-medium">العنوان</th>
                <th className="text-right p-3 font-medium">القسم</th>
                <th className="text-center p-3 font-medium">المشاهدات</th>
                <th className="text-center p-3 font-medium">الحالة</th>
                <th className="text-center p-3 font-medium">التاريخ</th>
                <th className="text-center p-3 font-medium">الإجراءات</th>
              </tr>
            </thead>
            <tbody>
              {news.map((n) => (
                <tr key={n.id} className="border-b border-muted/50 hover:bg-accent/30 text-sm">
                  <td className="p-3 truncate max-w-[250px]">{n.title}</td>
                  <td className="p-3 text-muted-foreground">{n.category}</td>
                  <td className="p-3 text-center">
                    <div className="flex items-center justify-center gap-1">
                      <Eye className="w-3 h-3" />
                      {n.views}
                    </div>
                  </td>
                  <td className="p-3 text-center">
                    <span className={`text-xs font-medium ${n.published ? "text-emerald-500" : "text-red-500"}`}>
                      {n.published ? "منشور" : "مسودة"}
                    </span>
                  </td>
                  <td className="p-3 text-center text-muted-foreground">
                    {new Date(n.createdAt).toLocaleDateString("ar-EG")}
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
