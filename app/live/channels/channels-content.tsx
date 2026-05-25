use client;

import { useState, useEffect } from react;
import { ChannelCard } from @/components/live/channel-card;
import { Button } from @/components/ui/button;
import { Input } from @/components/ui/input;
import { getChannelsWithProxy, fetchIPTVChannels, iptvToChannel, FALLBACK_CHANNELS } from @/lib/streaming;
import { Search, Monitor, Radio, Wifi, Tv, Loader2 } from lucide-react;

const categories = [
 { value: all, label: \u0627\u0644\u0643\u0644, icon: Radio },
 { value: sports, label: \u0631\u064a\u0627\u0636\u064a\u0629, icon: Monitor },
 { value: news, label: \u0623\u062e\u0628\u0627\u0631, icon: Radio },
 { value: entertainment, label: \u062a\u0631\u0641\u064a\u0647, icon: Radio },
];

export default function ChannelsContent() {
 const [channels, setChannels] = useState<(typeof FALLBACK_CHANNELS)[0][]>([]);
 const [loaded, setLoaded] = useState(false);
 const [iptvLoading, setIptvLoading] = useState(true);
 const [searchQuery, setSearchQuery] = useState();
 const [activeCategory, setActiveCategory] = useState(all);
 const [showFreeOnly, setShowFreeOnly] = useState(false);
 const [showIPTV, setShowIPTV] = useState(true);

 useEffect(() => {
 const fallback = getChannelsWithProxy();
 setChannels(fallback);

 fetchIPTVChannels().then((iptvChannels) => {
 if (iptvChannels.length > 0) {
 const converted = iptvChannels.map(iptvToChannel);
 const merged = [...converted, ...fallback];
 setChannels(merged);
 }
 setIptvLoading(false);
 setLoaded(true);
 }).catch(() => {
 setIptvLoading(false);
 setLoaded(true);
 });
 }, []);

 if (!loaded) {
 return <div className=text-center py-8><Loader2 className=w-8 h-8 animate-spin mx-auto mb-2 /><p className=text-muted-foreground>{'\u062c\u0627\u0631\u064a \u0627\u0644\u062a\u062d\u0645\u064a\u0644...'}</p></div>;
 }

 const filtered = channels.filter((ch) => {
 const matchesSearch = ch.nameAr.includes(searchQuery) || ch.name.toLowerCase().includes(searchQuery.toLowerCase());
 const matchesCategory = activeCategory === all || ch.category === activeCategory;
 const matchesFree = !showFreeOnly || ch.isFree;
 return matchesSearch && matchesCategory && matchesFree;
 });

 return (
 <div className=space-y-6>
 <div className=flex flex-col sm:flex-row gap-4>
 <div className=relative flex-1>
 <Search className=absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground />
 <Input placeholder={'\u0627\u0628\u062d\u062b \u0639\u0646 \u0642\u0646\u0627\u0629...'} className=pr-10 value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} />
 </div>
 <div className=flex gap-2 flex-wrap>
 {categories.map((cat) => {
 const Icon = cat.icon;
 return (
 <Button key={cat.value} variant={activeCategory === cat.value ? default : outline} size=sm onClick={() => setActiveCategory(cat.value)} className=gap-1.5>
 <Icon className=w-4 h-4 />
 {cat.label}
 </Button>
 );
 })}
 </div>
 <Button variant={showFreeOnly ? default : outline} size=sm onClick={() => setShowFreeOnly(!showFreeOnly)} className=gap-1.5>
 <Wifi className=w-4 h-4 />
 {'\u0627\u0644\u0645\u062c\u0627\u0646\u064a\u0629 \u0641\u0642\u0637'}
 </Button>
 <Button variant={showIPTV ? default : outline} size=sm onClick={() => setShowIPTV(!showIPTV)} className=gap-1.5>
 <Tv className=w-4 h-4 />
 {'\u0627\u0644\u0628\u062b \u0627\u0644\u0645\u0628\u0627\u0634\u0631'}
 </Button>
 </div>

 {iptvLoading && (
 <div className=flex items-center gap-3 p-4 rounded-xl bg-primary/10 border border-primary/20>
 <Loader2 className=w-5 h-5 animate-spin text-primary />
 <span className=text-sm>{'\u062c\u0627\u0631\u064a \u062a\u062d\u0645\u064a\u0644 \u0627\u0644\u0642\u0646\u0648\u0627\u062a \u0627\u0644\u0645\u0628\u0627\u0634\u0631\u0629 \u0645\u0646 \u062e\u0627\u062f\u0645 \u0627\u0644\u0628\u062b...'}</span>
 </div>
 )}

 {filtered.length === 0 ? (
 <div className=text-center py-16>
 <Radio className=w-16 h-16 mx-auto text-muted-foreground mb-4 />
 <h3 className=font-bold text-lg mb-2>{'\u0644\u0627 \u062a\u0648\u062c\u062f \u0642\u0646\u0648\u0627\u062a'}</h3>
 <p className=text-muted-foreground>{'\u0644\u0645 \u064a\u062a\u0645 \u0627\u0644\u0639\u062b\u0648\u0631 \u0639\u0644\u0649 \u0642\u0646\u0648\u0627\u062a \u062a\u0637\u0627\u0628\u0642 \u0628\u062d\u062b\u0643'}</p>
 </div>
 ) : (
 <div className=grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4>
 {filtered.map((channel) => (
 <ChannelCard key={channel.id} channel={channel} />
 ))}
 </div>
 )}

 <div className=rounded-2xl bg-accent/30 p-6 space-y-3>
 <h3 className=font-bold flex items-center gap-2><Monitor className=w-5 h-5 text-primary />{'\u0643\u064a\u0641\u064a\u0629 \u0625\u0636\u0627\u0641\u0629 \u0627\u0644\u0628\u062b \u0627\u0644\u0645\u0628\u0627\u0634\u0631'}</h3>
 <div className=grid grid-cols-1 md:grid-cols-3 gap-4 text-sm>
 <div className=p-3 rounded-xl bg-background/50>
 <p className=font-medium mb-1>1. {'\u0631\u0648\u0627\u0628\u0637 IPTV (M3U/M3U8)'}</p>
 <p className=text-muted-foreground>{'\u0623\u0636\u0641 \u0631\u0627\u0628\u0637 \u0642\u0627\u0626\u0645\u0629 IPTV \u0627\u0644\u062e\u0627\u0635\u0629 \u0628\u0643 \u0641\u064a \u0644\u0648\u062d\u0629 \u0627\u0644\u062a\u062d\u0643\u0645.'}</p>
 </div>
 <div className=p-3 rounded-xl bg-background/50>
 <p className=font-medium mb-1>2. {'\u064a\u0648\u062a\u064a\u0648\u0628 \u0645\u0628\u0627\u0634\u0631'}</p>
 <p className=text-muted-foreground>{'\u0623\u0636\u0641 \u0631\u0648\u0627\u0628\u0637 \u064a\u0648\u062a\u064a\u0648\u0628 \u0644\u0644\u0642\u0646\u0648\u0627\u062a \u0627\u0644\u062a\u064a \u062a\u0628\u062b \u0645\u0628\u0627\u0634\u0631\u0629. \u0645\u062c\u0627\u0646\u064a \u0648\u0645\u0633\u062a\u0642\u0631.'}</p>
 </div>
 <div className=p-3 rounded-xl bg-background/50>
 <p className=font-medium mb-1>3. {'\u0631\u0648\u0627\u0628\u0637 \u0645\u0628\u0627\u0634\u0631\u0629'}</p>
 <p className=text-muted-foreground>{'\u0623\u0636\u0641 \u0631\u0648\u0627\u0628\u0637 \u0645\u0628\u0627\u0634\u0631\u0629 \u0645\u0646 \u062e\u062f\u0645\u0627\u062a \u0627\u0644\u0628\u062b \u0627\u0644\u0645\u062f\u0641\u0648\u0639\u0629.'}</p>
 </div>
 </div>
 <p className=text-xs text-muted-foreground mt-2>{'* \u064a\u0645\u0643\u0646\u0643 \u0625\u062f\u0627\u0631\u0629 \u062c\u0645\u064a\u0639 \u0627\u0644\u0642\u0646\u0648\u0627\u062a \u0648\u0627\u0644\u0628\u062b\u0648\u062b \u0645\u0646 \u0644\u0648\u062d\u0629 \u0627\u0644\u062a\u062d\u0643\u0645'} &rarr; {'\u0625\u062f\u0627\u0631\u0629 \u0627\u0644\u0628\u062b \u0627\u0644\u0645\u0628\u0627\u0634\u0631'}</p>
 </div>
 </div>
 );
}
