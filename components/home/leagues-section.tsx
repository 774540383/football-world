import Link from "next/link";
import { Card } from "@/components/ui/card";
import { SectionHeader } from "@/components/shared/section-header";
import { MAJOR_LEAGUES } from "@/lib/constants";
import { Trophy } from "lucide-react";

export function LeaguesSection() {
  return (
    <section>
      <SectionHeader title="أهم الدوريات" icon={Trophy} />
      <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-7 gap-4">
        {MAJOR_LEAGUES.map((league) => (
          <Link key={league.id} href={`/league/${league.nameEn.toLowerCase().replace(/\s+/g, "-")}`}>
            <Card className="p-4 hover-lift flex flex-col items-center text-center gap-3 group">
              <div className="w-12 h-12 rounded-xl bg-muted/50 flex items-center justify-center p-2 transition-transform group-hover:scale-110">
                {league.logo && (
                  <img src={league.logo} alt={league.nameEn} className="w-full h-full object-contain" />
                )}
              </div>
              <div>
                <p className="text-xs font-medium line-clamp-2">{league.name}</p>
              </div>
            </Card>
          </Link>
        ))}
      </div>
    </section>
  );
}
