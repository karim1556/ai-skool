"use client"

import { useEffect, useMemo, useState } from "react";
import { RoleLayout } from "@/components/layout/role-layout";
import { CoordinatorSidebar } from "@/components/layout/coordinator-sidebar";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import Image from "next/image";

export default function CoordinatorLevelsPage() {
  const [levels, setLevels] = useState<any[]>([]);
  const [trainers, setTrainers] = useState<any[]>([]);
  const [batches, setBatches] = useState<any[]>([]);
  const [q, setQ] = useState("");
  const [loading, setLoading] = useState(true);
  const [err, setErr] = useState<string | null>(null);
  const [trainerTarget, setTrainerTarget] = useState<string>("");
  const [batchTarget, setBatchTarget] = useState<string>("");
  const [mode, setMode] = useState<'trainer'|'batch'>('trainer');
  const [trainerAssigned, setTrainerAssigned] = useState<Set<number>>(new Set());
  const [batchAssigned, setBatchAssigned] = useState<Set<number>>(new Set());
  const [notice, setNotice] = useState<{type:'success'|'error', text:string}|null>(null);

  useEffect(() => {
    let active = true;
    (async () => {
      setLoading(true); setErr(null);
      try {
        // hydrate school context
        try { await fetch('/api/sync/me', { method: 'POST', cache: 'no-store' }) } catch {}
        const schoolRes = await fetch('/api/me/school', { cache: 'no-store' });
        const school = schoolRes.ok ? await schoolRes.json() : null;
        // parallel fetch
        const [lvlRes, trRes, btRes] = await Promise.all([
          fetch('/api/levels', { cache: 'no-store' }),
          fetch(`/api/trainers${school?.schoolId ? `?schoolId=${school.schoolId}` : ''}`, { cache: 'no-store' }),
          fetch(`/api/batches${school?.schoolId ? `?schoolId=${school.schoolId}` : ''}`, { cache: 'no-store' }),
        ]);
        const [lvl, tr, bt] = await Promise.all([lvlRes.json(), trRes.json(), btRes.json()]);
        if (!lvlRes.ok) throw new Error(lvl?.error || 'Failed to load levels');
        if (!trRes.ok) throw new Error(tr?.error || 'Failed to load trainers');
        if (!btRes.ok) throw new Error(bt?.error || 'Failed to load batches');
        if (!active) return;
        const list = Array.isArray(lvl) ? lvl : [];
        list.sort((a:any,b:any)=>{
          const ka = Number(a.order ?? a.level_order ?? a.levelOrder ?? a.position ?? 0)
          const kb = Number(b.order ?? b.level_order ?? b.levelOrder ?? b.position ?? 0)
          if (!Number.isNaN(ka) && !Number.isNaN(kb) && (ka !== kb)) return ka - kb
          return String(a.name || '').localeCompare(String(b.name || ''))
        })
        setLevels(list);
        setTrainers(Array.isArray(tr) ? tr : []);
        setBatches(Array.isArray(bt) ? bt : []);
      } catch (e:any) {
        if (active) setErr(e?.message || 'Load failed');
      } finally { if (active) setLoading(false); }
    })();
    return () => { active = false };
  }, []);

  // Load assigned levels when targets change
  useEffect(() => {
    let active = true;
    (async () => {
      try {
        if (trainerTarget) {
          const res = await fetch(`/api/trainers/${trainerTarget}/levels`, { cache: 'no-store' });
          const js = await res.json();
          if (res.ok && Array.isArray(js)) {
            if (!active) return;
            setTrainerAssigned(new Set(js.map((l:any)=> Number(l.id))));
          }
        } else {
          setTrainerAssigned(new Set());
        }
      } catch {}
    })();
    return () => { active = false };
  }, [trainerTarget]);

  useEffect(() => {
    let active = true;
    (async () => {
      try {
        if (batchTarget) {
          const res = await fetch(`/api/batches/${batchTarget}/levels`, { cache: 'no-store' });
          const js = await res.json();
          if (res.ok && Array.isArray(js)) {
            if (!active) return;
            setBatchAssigned(new Set(js.map((l:any)=> Number(l.id))));
          }
        } else {
          setBatchAssigned(new Set());
        }
      } catch {}
    })();
    return () => { active = false };
  }, [batchTarget]);

  const filtered = useMemo(() => {
    if (!q.trim()) return levels;
    const qq = q.toLowerCase();
    return levels.filter((l:any) => `${l.name} ${l.category} ${l.subtitle}`.toLowerCase().includes(qq));
  }, [levels, q]);

  const assignToTrainer = async (levelId: number) => {
    if (!trainerTarget) return alert('Pick a trainer first');
    const res = await fetch(`/api/trainers/${trainerTarget}/levels`, {
      method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ level_id: levelId })
    });
    const js = await res.json().catch(()=>null);
    if (!res.ok) {
      setNotice({ type:'error', text: js?.error || 'Failed to assign to trainer' });
      return;
    }
    setNotice({ type:'success', text: 'Assigned to trainer' });
    setTrainerAssigned(prev => new Set(prev).add(Number(levelId)));
  };
  const unassignFromTrainer = async (levelId: number) => {
    if (!trainerTarget) return alert('Pick a trainer first');
    const res = await fetch(`/api/trainers/${trainerTarget}/levels?level_id=${levelId}`, { method: 'DELETE' });
    const js = await res.json().catch(()=>null);
    if (!res.ok) {
      setNotice({ type:'error', text: js?.error || 'Failed to unassign from trainer' });
      return;
    }
    setNotice({ type:'success', text: 'Unassigned from trainer' });
    setTrainerAssigned(prev => { const n = new Set(prev); n.delete(Number(levelId)); return n; });
  };

  const assignToBatch = async (levelId: number) => {
    if (!batchTarget) return alert('Pick a batch first');
    const res = await fetch(`/api/batches/${batchTarget}/levels`, {
      method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ level_id: levelId })
    });
    const js = await res.json().catch(()=>null);
    if (!res.ok) {
      setNotice({ type:'error', text: js?.error || 'Failed to assign to batch' });
      return;
    }
    setNotice({ type:'success', text: 'Assigned to batch' });
    setBatchAssigned(prev => new Set(prev).add(Number(levelId)));
  };
  const unassignFromBatch = async (levelId: number) => {
    if (!batchTarget) return alert('Pick a batch first');
    const res = await fetch(`/api/batches/${batchTarget}/levels?level_id=${levelId}`, { method: 'DELETE' });
    const js = await res.json().catch(()=>null);
    if (!res.ok) {
      setNotice({ type:'error', text: js?.error || 'Failed to unassign from batch' });
      return;
    }
    setNotice({ type:'success', text: 'Unassigned from batch' });
    setBatchAssigned(prev => { const n = new Set(prev); n.delete(Number(levelId)); return n; });
  };

  return (
    <RoleLayout title="Aiskool LMS" subtitle="Levels" Sidebar={CoordinatorSidebar}>
      <div className="space-y-6">
        <Card>
          <CardHeader>
            <CardTitle>Assign Levels</CardTitle>
            <CardDescription>Select a Trainer or Batch, then assign/unassign levels from the list.</CardDescription>
          </CardHeader>
          <CardContent>
            {err && <div className="text-sm text-destructive mb-2">{err}</div>}
            <div className="grid md:grid-cols-4 gap-3 mb-4">
              <div>
                <div className="text-sm text-muted-foreground mb-1">Search levels</div>
                <Input placeholder="Search by name, subtitle, category" value={q} onChange={(e)=>setQ(e.target.value)} />
              </div>
              <div>
                <div className="text-sm text-muted-foreground mb-1">Mode</div>
                <div className="flex rounded-md border overflow-hidden">
                  <button className={`px-3 py-1.5 text-sm ${mode==='trainer'?'bg-primary text-primary-foreground':'bg-background'}`} onClick={()=>setMode('trainer')}>Trainer</button>
                  <button className={`px-3 py-1.5 text-sm border-l ${mode==='batch'?'bg-primary text-primary-foreground':'bg-background'}`} onClick={()=>setMode('batch')}>Batch</button>
                </div>
              </div>
              <div>
                <div className="text-sm text-muted-foreground mb-1">Trainer target</div>
                <Select value={trainerTarget} onValueChange={setTrainerTarget}>
                  <SelectTrigger><SelectValue placeholder="Pick trainer" /></SelectTrigger>
                  <SelectContent>
                    {trainers.map((t:any)=> (
                      <SelectItem key={t.id} value={t.id}>{`${t.first_name||''} ${t.last_name||''}`.trim() || t.email || t.id}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div>
                <div className="text-sm text-muted-foreground mb-1">Batch target</div>
                <Select value={batchTarget} onValueChange={setBatchTarget}>
                  <SelectTrigger><SelectValue placeholder="Pick batch" /></SelectTrigger>
                  <SelectContent>
                    {batches.map((b:any)=> (
                      <SelectItem key={b.id} value={b.id}>{b.name || b.title || b.id}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>

            {notice && (
              <div className={`mb-3 text-sm ${notice.type==='success'?'text-green-700':'text-destructive'}`}>{notice.text}</div>
            )}

            {loading ? 'Loading...' : (
              <div className="grid gap-3">
                {filtered.map((l:any)=> {
                  const isAssignedTrainer = trainerTarget ? trainerAssigned.has(Number(l.id)) : false;
                  const isAssignedBatch = batchTarget ? batchAssigned.has(Number(l.id)) : false;
                  const showAssigned = mode==='trainer' ? isAssignedTrainer : isAssignedBatch;
                  const handleToggle = async () => {
                    if (mode==='trainer') {
                      return isAssignedTrainer ? unassignFromTrainer(l.id) : assignToTrainer(l.id);
                    } else {
                      return isAssignedBatch ? unassignFromBatch(l.id) : assignToBatch(l.id);
                    }
                  }
                  return (
                  <div key={l.id} className="flex items-center gap-4 p-3 border rounded-lg">
                    <Image src={l.thumbnail || '/placeholder.svg'} alt={l.name} width={72} height={48} className="w-[88px] h-[56px] object-cover rounded" />
                    <div className="min-w-0 flex-1">
                      <div className="font-semibold truncate">{l.name}</div>
                      <div className="text-sm text-muted-foreground truncate">{l.subtitle || l.category}</div>
                      {(trainerTarget || batchTarget) && (
                        <div className="mt-1">
                          {mode==='trainer' && trainerTarget && (
                            showAssigned ? <Badge variant="default">Assigned to Trainer</Badge> : <Badge variant="secondary">Not assigned</Badge>
                          )}
                          {mode==='batch' && batchTarget && (
                            showAssigned ? <Badge variant="default">Assigned to Batch</Badge> : <Badge variant="secondary">Not assigned</Badge>
                          )}
                        </div>
                      )}
                    </div>
                    <div className="flex gap-2">
                      <Button
                        variant={showAssigned ? 'outline' : 'secondary'}
                        onClick={handleToggle}
                        disabled={mode==='trainer' ? !trainerTarget : !batchTarget}
                      >
                        {mode==='trainer' ? (showAssigned ? 'Unassign from Trainer' : 'Assign to Trainer') : (showAssigned ? 'Unassign from Batch' : 'Assign to Batch')}
                      </Button>
                    </div>
                  </div>
                  )
                })}
                {filtered.length === 0 && <div className="text-sm text-muted-foreground">No levels found.</div>}
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </RoleLayout>
  )
}
