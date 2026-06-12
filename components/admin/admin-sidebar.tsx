"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import {
  LayoutDashboard,
  Calendar,
  Newspaper,
  Users,
  Shield,
  Image,
  BarChart3,
  Settings,
  Megaphone,
  LogOut,
  Trophy,
  Key,
  Tv,
  Server,
  Sparkles,
} from "lucide-react";

const adminLinks = [
  { href: "/admin", label: "لوحة التحكم", icon: LayoutDashboard },
  { href: "/admin/matches", label: "المباريات", icon: Calendar },
  { href: "/admin/news", label: "الأخبار", icon: Newspaper },
  { href: "/admin/teams", label: "الفرق", icon: Shield },
  { href: "/admin/players", label: "اللاعبين", icon: Users },
  { href: "/admin/leagues", label: "الدوريات", icon: Trophy },
  { href: "/admin/ai", label: "الذكاء الاصطناعي", icon: Sparkles },
  { href: "/admin/api-keys", label: "مفاتيح API", icon: Key },
  { href: "/admin/streams", label: "القنوات", icon: Tv },
  { href: "/admin/proxy", label: "خادم البث (Proxy)", icon: Server },
  { href: "/admin/ads", label: "الإعلانات", icon: Megaphone },
  { href: "/admin/media", label: "الوسائط", icon: Image },
  { href: "/admin/analytics", label: "الإحصائيات", icon: BarChart3 },
  { href: "/admin/settings", label: "الإعدادات", icon: Settings },
];

export function AdminSidebar() {
  const pathname = usePathname();

  return (
    <aside className="w-64 border-l bg-card min-h-screen p-4 hidden lg:block">
      <div className="flex items-center gap-2 mb-8 px-2">
        <div className="w-8 h-8 gradient-primary rounded-xl flex items-center justify-center">
          <Trophy className="w-4 h-4 text-white" />
        </div>
        <div>
          <p className="font-bold text-sm">لوحة التحكم</p>
          <p className="text-xs text-muted-foreground">إدارة الموقع</p>
        </div>
      </div>

      <nav className="space-y-1">
        {adminLinks.map((link) => {
          const Icon = link.icon;
          const isActive = pathname === link.href;
          return (
            <Link key={link.href} href={link.href}>
              <div
                className={cn(
                  "flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all",
                  isActive
                    ? "bg-primary/10 text-primary"
                    : "text-muted-foreground hover:bg-accent hover:text-foreground"
                )}
              >
                <Icon className="w-4 h-4" />
                {link.label}
              </div>
            </Link>
          );
        })}
      </nav>

      <div className="border-t mt-6 pt-4">
        <Link href="/">
          <div className="flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium text-muted-foreground hover:bg-accent hover:text-foreground transition-all">
            <LogOut className="w-4 h-4" />
            العودة للموقع
          </div>
        </Link>
      </div>
    </aside>
  );
}
