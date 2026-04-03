"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import CreateTaskModal from "@/components/CreateTaskModal";
import {
  getTasks, startTask, confirmMiddle, finishTask, deleteTask, testTelegram
} from "@/app/actions";
import { toast } from "sonner";
import { format } from "date-fns";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import {
  Plus, LogOut, RefreshCw, Inbox, Wifi,
  CalendarDays, Clock, Timer, Tag, Repeat,
  Play, CheckCircle, Flag, Trash2, CheckCircle2,
  Bell, Pencil,
} from "lucide-react";

const STATUS_CFG: Record<string, { label: string; pill: string }> = {
  pending:     { label: "Pending",     pill: "bg-amber-50 text-amber-600 border border-amber-100" },
  in_progress: { label: "In Progress", pill: "bg-blue-50 text-blue-600 border border-blue-100" },
  completed:   { label: "Done",        pill: "bg-green-50 text-green-600 border border-green-100" },
};
const CAT_CFG: Record<string, string> = {
  work:     "bg-violet-50 text-violet-600",
  fitness:  "bg-rose-50 text-rose-600",
  learning: "bg-sky-50 text-sky-600",
  personal: "bg-orange-50 text-orange-600",
};

function getPhaseAction(task: any): "start" | "middle" | "finish" | null {
  if (task.status === "completed") return null;
  const now = Date.now();
  const startMs = new Date(task.date).getTime();
  const endMs   = startMs + task.duration * 60000;
  const midMs   = startMs + (task.duration / 2) * 60000;
  if (now < startMs) return null;
  if (!task.startedAt) return "start";
  if (task.startedAt && !task.middleConfirmedAt && now >= midMs && now < endMs) return "middle";
  if (task.startedAt && now >= endMs && !task.finishedAt) return "finish";
  return null;
}

export default function Dashboard() {
  const router = useRouter();
  const [telegramId, setTelegramId] = useState<string | null>(null);
  const [tasks, setTasks] = useState<any[]>([]);
  const [showModal, setShowModal] = useState(false);
  const [editTask, setEditTask] = useState<any>(null);
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [busyId, setBusyId] = useState<string | null>(null);
  const [filter, setFilter] = useState<string>("all");

  useEffect(() => {
    const savedId = localStorage.getItem("telegramId");
    if (!savedId) router.push("/login");
    else { setTelegramId(savedId); setLoading(false); }
  }, [router]);

  useEffect(() => { if (telegramId) loadTasks(); }, [telegramId]);

  useEffect(() => {
    if (!telegramId) return;
    const runPing = () => {
      fetch("/api/planner/ping").catch(() => {});
      loadTasks(); 
    };
    runPing();
    const interval = setInterval(runPing, 10 * 1000);
    return () => clearInterval(interval);
  }, [telegramId]);

  const loadTasks = async () => {
    if (!telegramId) return;
    setRefreshing(true);
    const res = await getTasks(telegramId);
    if (res.tasks) setTasks(res.tasks as any[]);
    setRefreshing(false);
  };

  const handle = async (fn: () => Promise<any>, id: string, msg: string) => {
    setBusyId(id);
    const res = await fn();
    if (res.success) { toast.success(msg); loadTasks(); }
    else toast.error("Something went wrong");
    setBusyId(null);
  };

  const confirmDelete = async () => {
    if (deleteId) {
      await handle(() => deleteTask(deleteId), deleteId, "Task removed");
      setDeleteId(null);
    }
  };

  if (loading) return null;

  const active    = tasks.filter(t => t.status !== "completed");
  const completed = tasks.filter(t => t.status === "completed");

  return (
    <div className="min-h-screen flex flex-col bg-[#f9f9f9] font-sans text-gray-900">
      <nav className="border-b border-gray-100 bg-white sticky top-0 z-20">
        <div className="max-w-2xl mx-auto flex items-center justify-between px-6 h-13 py-3.5">
          <div className="flex items-center gap-2 cursor-pointer" onClick={() => router.push("/")}>
            <div className="w-2 h-2 rounded-full bg-green-500" />
            <span className="text-sm font-semibold tracking-tight">UniSend</span>
          </div>
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-1.5 text-[10px] font-semibold rounded-full px-2.5 py-1 bg-green-50 text-green-700 border border-green-100">
              <Wifi size={10} />Active
            </div>
            <Separator orientation="vertical" className="h-4" />
            <button
              onClick={() => { localStorage.clear(); router.push("/"); }}
              className="flex items-center gap-1.5 text-[11px] text-gray-400 hover:text-red-500 transition-colors font-medium"
            >
              <LogOut size={13} />Exit
            </button>
          </div>
        </div>
      </nav>

      <main className="flex-1 max-w-2xl w-full mx-auto px-6 py-10">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-xl font-semibold tracking-tight">My Plans</h1>
            <p className="text-xs text-gray-400 mt-1 flex items-center gap-1.5 font-medium">
              <CalendarDays size={11} /> {format(new Date(), "EEEE, MMMM d")}
            </p>
          </div>
          <div className="flex items-center gap-2">
            <button onClick={() => fetch("/api/planner/ping").then(loadTasks)} title="Ping Server" className="flex items-center justify-center w-9 h-9 rounded-xl border border-gray-100 bg-white text-gray-400 hover:text-gray-900 hover:border-gray-200 transition-all">
              <RefreshCw size={14} className={refreshing ? "animate-spin" : ""} />
            </button>
            <button 
              onClick={async () => {
                const res = await testTelegram(telegramId!);
                if (res.success) toast.success("Test message sent! Check Telegram.");
                else toast.error(res.error || "Failed to send test");
              }} 
              title="Test Bot Connection"
              className="flex items-center justify-center w-9 h-9 rounded-xl border border-blue-100 bg-blue-50 text-blue-500 hover:bg-blue-100 transition-all"
            >
              <Bell size={14} />
            </button>
            <Button size="sm" className="h-9 px-4 rounded-xl text-xs font-medium gap-1.5" onClick={() => { setEditTask(null); setShowModal(true); }}>
              <Plus size={14} />New Plan
            </Button>
          </div>
        </div>

        <div className="grid grid-cols-3 gap-3 mb-8">
          {[
            { label: "Total", value: tasks.length },
            { label: "Active", value: active.length },
            { label: "Done", value: completed.length },
          ].map(s => (
            <div key={s.label} className="bg-white border border-gray-100 rounded-2xl px-4 py-4 shadow-sm">
              <p className="text-[10px] text-gray-400 font-medium uppercase tracking-widest mb-2">{s.label}</p>
              <p className="text-2xl font-semibold tabular-nums">{s.value}</p>
            </div>
          ))}
        </div>

        <div className="flex items-center gap-2 mb-6 overflow-x-auto pb-1 hide-scrollbar">
          {["all", "pending", "in_progress", "completed"].map(f => (
            <button
              key={f}
              onClick={() => setFilter(f)}
              className={`px-4 py-1.5 rounded-full text-xs font-semibold capitalize whitespace-nowrap transition-all ${
                filter === f
                  ? "bg-gray-900 text-white shadow-sm"
                  : "bg-white border border-gray-200 text-gray-500 hover:bg-gray-50"
              }`}
            >
              {f.replace("_", " ")}
            </button>
          ))}
        </div>

        {tasks.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-24 bg-white border border-dashed border-gray-200 rounded-2xl gap-4 text-center">
            <div className="w-11 h-11 rounded-2xl bg-gray-50 flex items-center justify-center"><Inbox size={18} className="text-gray-300" /></div>
            <div>
              <p className="text-sm font-medium text-gray-500">No plans yet</p>
              <p className="text-xs text-gray-400 mt-1">Create your first plan to get started.</p>
            </div>
            <Button size="sm" className="h-8 px-4 rounded-xl text-xs gap-1.5 font-medium" onClick={() => setShowModal(true)}><Plus size={13} />Create plan</Button>
          </div>
        ) : (
          <div className="flex flex-col gap-8">
            {["in_progress", "pending", "completed"].map(groupStatus => {
              if (filter !== "all" && filter !== groupStatus) return null;
              const groupTasks = tasks.filter(t => t.status === groupStatus);
              if (groupTasks.length === 0) return null;
              return (
                <div key={groupStatus} className="flex flex-col gap-3">
                  <h2 className="text-sm font-semibold text-gray-500 uppercase tracking-wider flex items-center gap-2">
                    {groupStatus === "in_progress" && <span className="w-2 h-2 rounded-full bg-blue-500 animate-pulse" />}
                    {groupStatus === "pending" && <span className="w-2 h-2 rounded-full bg-amber-500" />}
                    {groupStatus === "completed" && <span className="w-2 h-2 rounded-full bg-green-500" />}
                    {groupStatus.replace('_', ' ')} ({groupTasks.length})
                  </h2>
                  {groupTasks.map(task => {
              const status = STATUS_CFG[task.status] ?? STATUS_CFG.pending;
              const catCls = CAT_CFG[task.category ?? "work"] ?? CAT_CFG.work;
              const phase  = getPhaseAction(task);
              const endTime = new Date(new Date(task.date).getTime() + task.duration * 60000);
              const isBusy  = busyId === task.id;

              return (
                <div key={task.id} className="bg-white border border-gray-100 rounded-2xl p-5 hover:border-gray-200 hover:shadow-md transition-all">
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex flex-wrap items-center gap-2">
                      <span className="flex items-center gap-1 text-[10px] font-medium text-gray-400">
                        <Clock size={10} /> {format(new Date(task.date), "HH:mm")} – {format(endTime, "HH:mm")}
                      </span>
                      <span className={`text-[10px] font-medium px-2 py-0.5 rounded-md capitalize ${catCls}`}>{task.category ?? "work"}</span>
                      <span className="text-[10px] font-medium px-2 py-0.5 rounded-md bg-gray-50 text-gray-500 capitalize flex items-center gap-1"><Repeat size={9} />{task.frequency}</span>
                    </div>
                    <span className={`text-[10px] font-medium px-2.5 py-1 rounded-lg ${status.pill}`}>{status.label}</span>
                  </div>

                  <p className={`text-sm font-medium tracking-tight mb-1 ${task.status === "completed" ? "text-gray-300 line-through" : ""}`}>{task.title}</p>
                  {task.description && <p className="text-[11px] text-gray-400 leading-relaxed line-clamp-2">{task.description}</p>}

                  <Separator className="my-4 bg-gray-50" />

                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      {phase === "start" && <Button size="sm" className="h-8 px-4 rounded-xl text-xs gap-1.5 bg-gray-900 hover:bg-black" disabled={isBusy} onClick={() => handle(() => startTask(task.id), task.id, "Task started!")}><Play size={12} />Start</Button>}
                      {phase === "middle" && <Button size="sm" variant="outline" className="h-8 px-4 rounded-xl text-xs gap-1.5 border-blue-200 text-blue-600 hover:bg-blue-50" disabled={isBusy} onClick={() => handle(() => confirmMiddle(task.id), task.id, "Mid-check confirmed!")}><CheckCircle size={12} />Mid-Check</Button>}
                      {phase === "finish" && <Button size="sm" className="h-8 px-4 rounded-xl text-xs gap-1.5 bg-green-600 hover:bg-green-700 text-white" disabled={isBusy} onClick={() => handle(() => finishTask(task.id), task.id, "Task completed!")}><Flag size={12} />Finish</Button>}
                      {task.status === "completed" && <span className="flex items-center gap-1.5 text-xs text-green-500 font-medium"><CheckCircle2 size={14} />Completed</span>}

                      <div className="flex items-center gap-3 ml-2 border-l border-gray-100 pl-3">
                        <button onClick={() => { setEditTask(task); setShowModal(true); }} className="flex items-center gap-1 text-[11px] text-gray-400 hover:text-blue-500 transition-colors">
                          <Pencil size={12} />Edit
                        </button>
                        <button onClick={() => setDeleteId(task.id)} className="flex items-center gap-1 text-[11px] text-gray-400 hover:text-red-500 transition-colors">
                          <Trash2 size={12} />Delete
                        </button>
                      </div>
                    </div>
                    <span className="flex items-center gap-1 text-[10px] text-gray-400 font-medium"><Timer size={11} />{task.duration}m</span>
                  </div>
                </div>
              );
            })}
                </div>
              );
            })}
          </div>
        )}
      </main>

      <footer className="border-t border-gray-100 bg-white mt-auto py-5"><div className="max-w-2xl mx-auto px-6 flex items-center justify-between"><span className="text-[10px] text-gray-400 font-medium">UniSend © 2026</span></div></footer>

      <CreateTaskModal open={showModal} onOpenChange={setShowModal} telegramId={telegramId!} onCreated={loadTasks} editTask={editTask} />

      <AlertDialog open={!!deleteId} onOpenChange={(o) => !o && setDeleteId(null)}>
        <AlertDialogContent className="rounded-2xl border-gray-100 shadow-xl">
          <AlertDialogHeader>
            <AlertDialogTitle className="text-base font-semibold">Remove this task?</AlertDialogTitle>
            <AlertDialogDescription className="text-xs">
              This action cannot be undone. This task and its Telegram reminder schedule will be deleted.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel className="rounded-xl h-9 text-xs">Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={confirmDelete} className="rounded-xl h-9 text-xs bg-red-600 hover:bg-red-700">Delete</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
