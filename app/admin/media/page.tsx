import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { prisma } from "@/lib/prisma";
import { Plus, Image as ImageIcon } from "lucide-react";

export const dynamic = "force-dynamic";

export default async function AdminMediaPage() {
  const media = await prisma.media.findMany({ orderBy: { createdAt: "desc" } });

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">مكتبة الوسائط</h1>
        <Button variant="accent">
          <Plus className="w-4 h-4 ml-2" />
          رفع وسائط
        </Button>
      </div>

      {media.length > 0 ? (
        <div className="grid grid-cols-4 md:grid-cols-6 lg:grid-cols-8 gap-4">
          {media.map((m) => (
            <div key={m.id} className="aspect-square rounded-2xl bg-muted overflow-hidden relative group">
              {m.type === "image" ? (
                <img src={m.url} alt={m.alt || ""} className="w-full h-full object-cover" />
              ) : (
                <div className="w-full h-full flex items-center justify-center">
                  <ImageIcon className="w-8 h-8 text-muted-foreground" />
                </div>
              )}
              <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
                <Button variant="ghost" size="sm" className="text-white">تعديل</Button>
                <Button variant="destructive" size="sm">حذف</Button>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="text-center py-12 text-muted-foreground">
          لا توجد وسائط مرفوعة
        </div>
      )}
    </div>
  );
}
