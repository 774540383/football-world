"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/button";
import { LocaleSwitcher } from "@/components/layout/locale-switcher";
import {
  Menu,
  X,
  Search,
  ChevronDown,
  Trophy,
  Newspaper,
  Radio,
  LineChart,
  Home,
  Calendar,
  Tv,
} from "lucide-react";

const navLinks = [
  { href: "/", label: "الرئيسية", labelEn: "Home", icon: Home },
  { href: "/live", label: "مباشر", labelEn: "Live", icon: Radio, badge: true },
  { href: "/live/channels", label: "القنوات", labelEn: "TV", icon: Tv, badge: false },
  { href: "/matches", label: "المباريات", labelEn: "Matches", icon: Calendar },
  { href: "/standings", label: "الترتيب", labelEn: "Standings", icon: LineChart },
  { href: "/world-cup", label: "كأس العالم", labelEn: "World Cup", icon: Trophy },
  { href: "/news", label: "الأخبار", labelEn: "News", icon: Newspaper },
];

const leaguesMenu = [
  { name: "الدوري الإنجليزي", nameEn: "Premier League", league: "premier-league" },
  { name: "الدوري الإسباني", nameEn: "La Liga", league: "la-liga" },
  { name: "الدوري الإيطالي", nameEn: "Serie A", league: "serie-a" },
  { name: "الدوري الألماني", nameEn: "Bundesliga", league: "bundesliga" },
  { name: "دوري أبطال أوروبا", nameEn: "UCL", league: "champions-league" },
  { name: "الدوري السعودي", nameEn: "SPL", league: "saudi-league" },
];

export function Navbar() {
  const pathname = usePathname();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [leaguesOpen, setLeaguesOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);

  return (
    <>
      <nav className="glass-nav fixed top-0 left-0 right-0 z-50 h-16">
        <div className="container h-full flex items-center justify-between">
          <div className="flex items-center gap-6">
            <Link href="/" className="flex items-center gap-2">
              <div className="w-9 h-9 gradient-primary rounded-xl flex items-center justify-center shadow-lg shadow-blue-500/25">
                <Trophy className="w-5 h-5 text-white" />
              </div>
              <span className="font-bold text-lg hidden sm:block">
                <span className="text-primary">Football</span>World
              </span>
            </Link>

            <div className="hidden lg:flex items-center gap-1">
              {navLinks.map((link) => {
                const isActive = pathname === link.href;
                const Icon = link.icon;
                return (
                  <Link key={link.href} href={link.href}>
                    <div
                      className={`relative flex items-center gap-1.5 px-3 py-2 rounded-xl text-sm font-medium transition-all duration-200 ${
                        isActive
                          ? "bg-primary/10 text-primary"
                          : "text-muted-foreground hover:text-foreground hover:bg-accent/50"
                      }`}
                    >
                      <Icon className="w-4 h-4" />
                      <span>{link.label}</span>
                      {link.badge && (
                        <span className="w-2 h-2 rounded-full bg-red-500 animate-pulse absolute -top-0.5 -right-0.5" />
                      )}
                    </div>
                  </Link>
                );
              })}

              <div className="relative" onMouseEnter={() => setLeaguesOpen(true)} onMouseLeave={() => setLeaguesOpen(false)}>
                <button className="flex items-center gap-1.5 px-3 py-2 rounded-xl text-sm font-medium text-muted-foreground hover:text-foreground hover:bg-accent/50 transition-all">
                  <Trophy className="w-4 h-4" />
                  <span>الدوريات</span>
                  <ChevronDown className="w-3 h-3" />
                </button>
                <AnimatePresence>
                  {leaguesOpen && (
                    <motion.div
                      initial={{ opacity: 0, y: 8 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: 8 }}
                      className="absolute top-full right-0 mt-2 w-56 glass-card p-2 shadow-2xl"
                    >
                      {leaguesMenu.map((l) => (
                        <Link key={l.league} href={`/league/${l.league}`}>
                          <div className="flex items-center gap-3 px-3 py-2.5 rounded-xl hover:bg-accent transition-all text-sm font-medium">
                            <Trophy className="w-4 h-4 text-primary" />
                            {l.name}
                          </div>
                        </Link>
                      ))}
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <LocaleSwitcher />

            <button
              onClick={() => setSearchOpen(!searchOpen)}
              className="h-10 w-10 rounded-xl flex items-center justify-center hover:bg-accent transition-all"
            >
              <Search className="w-4 h-4" />
            </button>

            <Link href="/login">
              <Button variant="ghost" size="sm" className="hidden sm:flex">
                دخول
              </Button>
            </Link>

            <Link href="/register">
              <Button variant="accent" size="sm" className="hidden sm:flex">
                اشتراك
              </Button>
            </Link>

            <button
              onClick={() => setMobileOpen(!mobileOpen)}
              className="lg:hidden h-10 w-10 rounded-xl flex items-center justify-center hover:bg-accent transition-all"
            >
              {mobileOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>
      </nav>

      <AnimatePresence>
        {searchOpen && (
          <motion.div
            initial={{ opacity: 0, y: -16 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -16 }}
            className="fixed top-16 left-0 right-0 z-40 glass-nav border-t p-4 shadow-xl"
          >
            <div className="container">
              <div className="relative max-w-2xl mx-auto">
                <Search className="absolute right-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                <input
                  type="text"
                  placeholder="ابحث عن مباراة، فريق، لاعب..."
                  className="w-full h-12 pr-12 pl-4 rounded-2xl border bg-background text-base focus:outline-none focus:ring-2 focus:ring-primary transition-all"
                  autoFocus
                />
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            initial={{ x: "100%" }}
            animate={{ x: 0 }}
            exit={{ x: "100%" }}
            transition={{ type: "spring", damping: 25, stiffness: 200 }}
            className="fixed top-16 left-0 right-0 bottom-0 z-40 bg-background border-t overflow-y-auto"
          >
            <div className="p-4 space-y-2">
              {navLinks.map((link) => {
                const isActive = pathname === link.href;
                const Icon = link.icon;
                return (
                  <Link key={link.href} href={link.href} onClick={() => setMobileOpen(false)}>
                    <div
                      className={`flex items-center gap-3 px-4 py-3 rounded-xl text-base font-medium transition-all ${
                        isActive
                          ? "bg-primary/10 text-primary"
                          : "text-muted-foreground hover:bg-accent"
                      }`}
                    >
                      <Icon className="w-5 h-5" />
                      {link.label}
                      {link.badge && <span className="w-2 h-2 rounded-full bg-red-500 animate-pulse" />}
                    </div>
                  </Link>
                );
              })}

              <div className="border-t pt-2 mt-2">
                <p className="px-4 py-2 text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                  الدوريات
                </p>
                {leaguesMenu.map((l) => (
                  <Link key={l.league} href={`/league/${l.league}`} onClick={() => setMobileOpen(false)}>
                    <div className="flex items-center gap-3 px-4 py-3 rounded-xl text-sm hover:bg-accent transition-all">
                      <Trophy className="w-4 h-4 text-primary" />
                      {l.name}
                    </div>
                  </Link>
                ))}
              </div>

              <div className="flex gap-2 pt-4 px-4">
                <Link href="/login" className="flex-1" onClick={() => setMobileOpen(false)}>
                  <Button variant="outline" className="w-full">دخول</Button>
                </Link>
                <Link href="/register" className="flex-1" onClick={() => setMobileOpen(false)}>
                  <Button variant="accent" className="w-full">اشتراك</Button>
                </Link>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
