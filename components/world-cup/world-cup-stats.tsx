"use client";

import { Card } from "@/components/ui/card";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, ResponsiveContainer, Tooltip } from "recharts";

const topScorers = [
  { name: "كيليان مبابي", goals: 8, team: "فرنسا" },
  { name: "ليونيل ميسي", goals: 7, team: "الأرجنتين" },
  { name: "جوليان ألفاريز", goals: 4, team: "الأرجنتين" },
  { name: "أوليفيه جيرو", goals: 4, team: "فرنسا" },
  { name: "ماركوس راشفورد", goals: 3, team: "إنجلترا" },
];

const topAssists = [
  { name: "ليونيل ميسي", assists: 5, team: "الأرجنتين" },
  { name: "أنطوان غريزمان", assists: 4, team: "فرنسا" },
  { name: "كيليان مبابي", assists: 3, team: "فرنسا" },
  { name: "هاري كين", assists: 3, team: "إنجلترا" },
  { name: "فينيسيوس جونيور", assists: 3, team: "البرازيل" },
];

export function WorldCupStats() {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      <Card className="p-6">
        <h3 className="font-bold text-lg mb-4">🏆 أفضل الهدافين</h3>
        <div className="space-y-3">
          {topScorers.map((p, i) => (
            <div key={p.name} className="flex items-center gap-3 p-2 rounded-xl hover:bg-accent/50 transition-all">
              <span className="text-sm font-bold text-primary w-6">{i + 1}</span>
              <div className="flex-1">
                <p className="text-sm font-medium">{p.name}</p>
                <p className="text-xs text-muted-foreground">{p.team}</p>
              </div>
              <span className="text-lg font-bold">{p.goals}</span>
            </div>
          ))}
        </div>
      </Card>

      <Card className="p-6">
        <h3 className="font-bold text-lg mb-4">🎯 أفضل صانعي الأهداف</h3>
        <div className="space-y-3">
          {topAssists.map((p, i) => (
            <div key={p.name} className="flex items-center gap-3 p-2 rounded-xl hover:bg-accent/50 transition-all">
              <span className="text-sm font-bold text-primary w-6">{i + 1}</span>
              <div className="flex-1">
                <p className="text-sm font-medium">{p.name}</p>
                <p className="text-xs text-muted-foreground">{p.team}</p>
              </div>
              <span className="text-lg font-bold">{p.assists}</span>
            </div>
          ))}
        </div>
      </Card>
    </div>
  );
}
