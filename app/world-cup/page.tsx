import { WorldCupHero } from "@/components/world-cup/world-cup-hero";
import { WorldCupGroups } from "@/components/world-cup/world-cup-groups";
import { WorldCupBracket } from "@/components/world-cup/world-cup-bracket";
import { WorldCupStats } from "@/components/world-cup/world-cup-stats";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

export const dynamic = "force-dynamic";

export default function WorldCupPage() {
  return (
    <div className="space-y-8">
      <WorldCupHero />

      <Tabs defaultValue="groups" className="w-full">
        <TabsList className="w-full justify-start overflow-x-auto">
          <TabsTrigger value="groups">المجموعات</TabsTrigger>
          <TabsTrigger value="bracket">الأدوار النهائية</TabsTrigger>
          <TabsTrigger value="stats">الإحصائيات</TabsTrigger>
        </TabsList>

        <TabsContent value="groups" className="mt-6">
          <WorldCupGroups />
        </TabsContent>

        <TabsContent value="bracket" className="mt-6">
          <WorldCupBracket />
        </TabsContent>

        <TabsContent value="stats" className="mt-6">
          <WorldCupStats />
        </TabsContent>
      </Tabs>
    </div>
  );
}
