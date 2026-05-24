import Link from "next/link";
import { Trophy, Github, Twitter, Youtube, Mail } from "lucide-react";

export function Footer() {
  return (
    <footer className="border-t bg-gradient-to-b from-background to-muted/30">
      <div className="container py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          <div className="space-y-4">
            <div className="flex items-center gap-2">
              <div className="w-9 h-9 gradient-primary rounded-xl flex items-center justify-center shadow-lg shadow-blue-500/25">
                <Trophy className="w-5 h-5 text-white" />
              </div>
              <span className="font-bold text-lg">
                <span className="text-primary">Football</span>World
              </span>
            </div>
            <p className="text-sm text-muted-foreground leading-relaxed">
              منصة كرة القدم العالمية الأولى. تابع المباريات المباشرة، الأخبار، الإحصائيات وكل ما يخص كرة القدم العالمية.
            </p>
            <div className="flex gap-2">
              {[Github, Twitter, Youtube, Mail].map((Icon, i) => (
                <div key={i} className="w-9 h-9 rounded-xl bg-accent/50 flex items-center justify-center hover:bg-accent transition-all cursor-pointer">
                  <Icon className="w-4 h-4" />
                </div>
              ))}
            </div>
          </div>

          <div className="space-y-4">
            <h4 className="font-semibold text-sm">الدوريات</h4>
            <ul className="space-y-2">
              {[
                "الدوري الإنجليزي",
                "الدوري الإسباني",
                "الدوري الإيطالي",
                "الدوري الألماني",
                "دوري أبطال أوروبا",
              ].map((l) => (
                <li key={l}>
                  <Link href="#" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
                    {l}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div className="space-y-4">
            <h4 className="font-semibold text-sm">روابط سريعة</h4>
            <ul className="space-y-2">
              {[
                { label: "المباريات المباشرة", href: "/live" },
                { label: "جدول المباريات", href: "/matches" },
                { label: "الترتيب", href: "/standings" },
                { label: "كأس العالم", href: "/world-cup" },
                { label: "الأخبار", href: "/news" },
              ].map((l) => (
                <li key={l.href}>
                  <Link href={l.href} className="text-sm text-muted-foreground hover:text-foreground transition-colors">
                    {l.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div className="space-y-4">
            <h4 className="font-semibold text-sm">عن الموقع</h4>
            <ul className="space-y-2">
              {[
                "من نحن",
                "سياسة الخصوصية",
                "شروط الاستخدام",
                "اتصل بنا",
                "إعلن معنا",
              ].map((l) => (
                <li key={l}>
                  <Link href="#" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
                    {l}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>

        <div className="border-t mt-8 pt-6 flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="text-xs text-muted-foreground">
            © {new Date().getFullYear()} Football World. جميع الحقوق محفوظة.
          </p>
          <p className="text-xs text-muted-foreground">
            مدعوم بأحدث تقنيات الويب - Next.js 15 + TypeScript + Tailwind CSS
          </p>
        </div>
      </div>
    </footer>
  );
}
