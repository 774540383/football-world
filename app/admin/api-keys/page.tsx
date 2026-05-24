"use client";

import { useState, useEffect } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { loadApiKeys, saveApiKeys, addApiKey, deleteApiKey, updateApiKey, AVAILABLE_SERVICES } from "@/lib/api-manager";
import type { ApiKeyEntry } from "@/lib/api-manager";
import { Key, Plus, Trash2, Eye, EyeOff, Check, X, Wifi, ExternalLink } from "lucide-react";

export default function AdminApiKeysPage() {
  const [keys, setKeys] = useState<ApiKeyEntry[]>([]);
  const [showForm, setShowForm] = useState(false);
  const [visibleKeys, setVisibleKeys] = useState<Set<string>>(new Set());
  const [formData, setFormData] = useState({ service: "", name: "", key: "" });

  useEffect(() => {
    setKeys(loadApiKeys());
  }, []);

  function handleAdd() {
    if (!formData.service || !formData.key) return;
    const serviceDef = AVAILABLE_SERVICES.find((s) => s.id === formData.service);
    const newKeys = addApiKey({
      service: formData.service,
      name: formData.name || serviceDef?.name || formData.service,
      key: formData.key,
      baseUrl: serviceDef?.baseUrl,
      active: true,
    });
    setKeys(newKeys);
    setFormData({ service: "", name: "", key: "" });
    setShowForm(false);
  }

  function handleDelete(id: string) {
    setKeys(deleteApiKey(id));
  }

  function toggleVisibility(id: string) {
    const next = new Set(visibleKeys);
    if (next.has(id)) next.delete(id);
    else next.add(id);
    setVisibleKeys(next);
  }

  function toggleActive(id: string) {
    const entry = keys.find((k) => k.id === id);
    if (!entry) return;
    const updated = updateApiKey(id, { active: !entry.active });
    setKeys(updated);
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold flex items-center gap-2">
            <Key className="w-6 h-6 text-primary" />
            إدارة مفاتيح API
          </h1>
          <p className="text-muted-foreground">أضف وأدر مفاتيح API للخدمات المختلفة (مشفر بالكامل)</p>
        </div>
        <Button onClick={() => setShowForm(!showForm)}>
          <Plus className="w-4 h-4 ml-2" />
          إضافة مفتاح
        </Button>
      </div>

      {showForm && (
        <Card className="p-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="text-sm font-medium mb-1 block">الخدمة</label>
              <select
                className="w-full h-10 rounded-lg border border-input bg-background px-3 text-sm"
                value={formData.service}
                onChange={(e) => {
                  const svc = AVAILABLE_SERVICES.find((s) => s.id === e.target.value);
                  setFormData({ ...formData, service: e.target.value, name: svc?.name || "" });
                }}
              >
                <option value="">اختر خدمة...</option>
                {AVAILABLE_SERVICES.map((s) => (
                  <option key={s.id} value={s.id}>{s.name} - {s.nameAr}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="text-sm font-medium mb-1 block">اسم مخصص (اختياري)</label>
              <Input
                placeholder="اسم المفتاح"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              />
            </div>
            <div>
              <label className="text-sm font-medium mb-1 block">المفتاح</label>
              <Input
                type="password"
                placeholder="أدخل مفتاح API"
                value={formData.key}
                onChange={(e) => setFormData({ ...formData, key: e.target.value })}
              />
            </div>
          </div>
          <div className="flex gap-2 mt-4">
            <Button onClick={handleAdd} size="sm">
              <Check className="w-4 h-4 ml-1" />
              حفظ
            </Button>
            <Button onClick={() => setShowForm(false)} variant="outline" size="sm">
              <X className="w-4 h-4 ml-1" />
              إلغاء
            </Button>
          </div>
          {formData.service && (
            <p className="text-xs text-muted-foreground mt-2">
              {AVAILABLE_SERVICES.find((s) => s.id === formData.service)?.descriptionAr}
            </p>
          )}
        </Card>
      )}

      <div className="grid gap-4">
        {keys.length === 0 ? (
          <Card className="p-8 text-center">
            <Key className="w-12 h-12 mx-auto text-muted-foreground mb-3" />
            <p className="text-muted-foreground">لا توجد مفاتيح API مضافة بعد</p>
            <p className="text-sm text-muted-foreground/60 mt-1">أضف مفتاح API للبدء في جلب البيانات الحقيقية</p>
          </Card>
        ) : (
          keys.map((entry) => {
            const svc = AVAILABLE_SERVICES.find((s) => s.id === entry.service);
            const isVisible = visibleKeys.has(entry.id);
            return (
              <Card key={entry.id} className="p-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center">
                      <Wifi className="w-5 h-5 text-primary" />
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <h3 className="font-bold">{entry.name}</h3>
                        <Badge variant={entry.active ? "default" : "secondary"} className="text-xs">
                          {entry.active ? "نشط" : "غير نشط"}
                        </Badge>
                        <Badge variant="outline" className="text-xs text-muted-foreground">
                          مشفر
                        </Badge>
                      </div>
                      <p className="text-xs text-muted-foreground">{svc?.nameAr || entry.service}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="relative">
                      <code className="text-xs bg-muted px-2 py-1 rounded font-mono max-w-[200px] truncate block">
                        {isVisible ? entry.key : "••••••••" + entry.key.slice(-4)}
                      </code>
                    </div>
                    <button onClick={() => toggleVisibility(entry.id)} className="text-muted-foreground hover:text-foreground">
                      {isVisible ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </button>
                    <button onClick={() => toggleActive(entry.id)} className={`${entry.active ? "text-green-500" : "text-muted-foreground"} hover:text-foreground`}>
                      {entry.active ? <Check className="w-4 h-4" /> : <X className="w-4 h-4" />}
                    </button>
                    <button onClick={() => handleDelete(entry.id)} className="text-destructive hover:text-destructive/80">
                      <Trash2 className="w-4 h-4" />
                    </button>
                    {svc?.baseUrl && (
                      <a href={svc.baseUrl} target="_blank" rel="noopener noreferrer" className="text-muted-foreground hover:text-primary">
                        <ExternalLink className="w-4 h-4" />
                      </a>
                    )}
                  </div>
                </div>
                <div className="flex items-center gap-4 mt-2 text-xs text-muted-foreground">
                  <span>أنشئ: {new Date(entry.createdAt).toLocaleDateString("ar-EG")}</span>
                  {entry.lastUsed && <span>آخر استخدام: {new Date(entry.lastUsed).toLocaleDateString("ar-EG")}</span>}
                </div>
              </Card>
            );
          })
        )}
      </div>

      <Card className="p-4">
        <h3 className="font-bold mb-2">الخدمات المتاحة</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          {AVAILABLE_SERVICES.map((svc) => (
            <div key={svc.id} className="flex items-start gap-3 p-3 rounded-xl bg-accent/30">
              <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center shrink-0">
                <Key className="w-4 h-4 text-primary" />
              </div>
              <div>
                <p className="font-medium text-sm">{svc.name} / {svc.nameAr}</p>
                <p className="text-xs text-muted-foreground">{svc.descriptionAr}</p>
                <p className="text-xs text-muted-foreground/60 mt-1">{svc.baseUrl}</p>
              </div>
            </div>
          ))}
        </div>
      </Card>
    </div>
  );
}
