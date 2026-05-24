"use client";

import dynamic from "next/dynamic";
import { Tv } from "lucide-react";

const ChannelsContent = dynamic(() => import("./channels-content"), { ssr: false });

export default function ChannelsPage() {
  return (
    <div className="space-y-6">
      <div className="relative overflow-hidden rounded-3xl gradient-primary p-8 text-white">
        <div className="relative z-10">
          <div className="flex items-center gap-3 mb-2">
            <Tv className="w-8 h-8" />
            <h1 className="text-3xl font-black">القنوات الرياضية</h1>
          </div>
          <p className="text-white/70 text-lg">شاهد البث المباشر للقنوات والمباريات الرياضية</p>
        </div>
      </div>
      <ChannelsContent />
    </div>
  );
}
