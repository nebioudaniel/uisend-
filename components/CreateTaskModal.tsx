"use client";

import { useState, useEffect } from "react";
import { format, addMinutes, isBefore, differenceInMinutes } from "date-fns";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Separator } from "@/components/ui/separator";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Calendar } from "@/components/ui/calendar";
import { toast } from "sonner";
import { createTask, updateTask } from "@/app/actions";
import { CalendarIcon, Clock, Tag, Repeat, AlignLeft, BotMessageSquare, Pencil, Zap, AlertTriangle } from "lucide-react";
import { cn } from "@/lib/utils";

export default function CreateTaskModal({
  open,
  onOpenChange,
  telegramId,
  onCreated,
  editTask,
}: {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  telegramId: string;
  onCreated: () => void;
  editTask?: any;
}) {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [category, setCategory] = useState("work");
  const [frequency, setFrequency] = useState("once");
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(undefined);
  const [time, setTime] = useState("09:00");
  const [duration, setDuration] = useState("30");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (editTask) {
      setTitle(editTask.title || "");
      setDescription(editTask.description || "");
      setCategory(editTask.category || "work");
      setFrequency(editTask.frequency || "once");
      const d = new Date(editTask.date);
      setSelectedDate(d);
      setTime(format(d, "HH:mm"));
      setDuration(String(editTask.duration || "30"));
    } else {
      setTitle("");
      setDescription("");
      setCategory("work");
      setFrequency("once");
      setSelectedDate(new Date()); 
      setTime(format(new Date(Date.now() + 60000), "HH:mm")); // Default to 1m from now
      setDuration("30");
    }
  }, [editTask, open]);

  const getCombinedDate = () => {
    if (!selectedDate) return null;
    const [hours, minutes] = time.split(":").map(Number);
    return new Date(
      selectedDate.getFullYear(),
      selectedDate.getMonth(),
      selectedDate.getDate(),
      hours,
      minutes,
      0
    );
  };

  const combined = getCombinedDate();
  const diff = combined ? differenceInMinutes(combined, new Date()) : 0;
  const isPast = combined ? isBefore(combined, new Date()) : false;

  const handleSubmit = async () => {
    if (!title.trim()) return toast.error("Task title is required");
    if (!selectedDate) return toast.error("Please select a date");
    if (!time) return toast.error("Please select a start time");
    if (!duration || Number(duration) < 1) return toast.error("Duration must be at least 1 minute");

    const finalDate = getCombinedDate();
    if (!finalDate) return;

    setLoading(true);
    const taskData = { 
      title, 
      description, 
      category, 
      frequency, 
      timestamp: finalDate.getTime(), 
      duration 
    };

    const res = editTask 
      ? await updateTask(editTask.id, taskData)
      : await createTask(taskData, telegramId);

    if (res.success) {
      toast.success(editTask ? "Plan updated!" : "Plan created — reminders will start in time.");
      onCreated();
      onOpenChange(false);
    } else {
      toast.error((res as any).error || "Failed to save task");
    }
    setLoading(false);
  };

  const startNow = () => {
    const now = new Date(Date.now() + 60000); // 1 minute from now
    setSelectedDate(now);
    setTime(format(now, "HH:mm"));
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[520px] p-0 gap-0 bg-white rounded-2xl overflow-hidden border border-gray-100 shadow-xl">
        <div className="flex items-center gap-4 px-6 pt-6 pb-5">
          <div className="flex items-center justify-center w-9 h-9 rounded-xl bg-gray-900 shrink-0">
            {editTask ? <Pencil size={16} className="text-white" /> : <BotMessageSquare size={16} className="text-white" />}
          </div>
          <DialogHeader>
            <DialogTitle className="text-base font-semibold text-gray-900">
              {editTask ? "Edit Your Plan" : "Create a New Plan"}
            </DialogTitle>
            <p className="text-xs text-gray-400 mt-0.5 leading-relaxed">
              Bot Reminders every 30 seconds starting from the time you pick.
            </p>
          </DialogHeader>
        </div>

        <Separator />

        <div className="px-6 py-5 flex flex-col gap-5">
          <div className="flex items-center justify-between">
            <Label className="text-[11px] text-gray-500 font-medium uppercase tracking-wider flex items-center gap-1.5">
              <AlignLeft size={11} />Task Title
            </Label>
            {!editTask && (
              <button 
                onClick={startNow}
                className="text-[10px] flex items-center gap-1 px-2 py-1 rounded-lg bg-indigo-50 text-indigo-600 hover:bg-indigo-100 transition-colors font-semibold"
              >
                <Zap size={10} /> Set to NOW
              </button>
            )}
          </div>
          <Input
            placeholder="e.g. Morning workout, Code review"
            className="h-10 text-sm rounded-xl border-gray-200 bg-gray-50 px-4 font-normal"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
          />

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <Label className="text-[11px] text-gray-500 font-medium uppercase tracking-wider flex items-center gap-1.5">
                <Tag size={11} />Category
              </Label>
              <Select value={category} onValueChange={setCategory}>
                <SelectTrigger className="h-10 w-full rounded-xl border-gray-200 bg-gray-50 text-sm font-normal">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="work">Work</SelectItem>
                  <SelectItem value="fitness">Fitness</SelectItem>
                  <SelectItem value="learning">Learning</SelectItem>
                  <SelectItem value="personal">Personal</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-1.5">
              <Label className="text-[11px] text-gray-500 font-medium uppercase tracking-wider flex items-center gap-1.5">
                <Repeat size={11} />Frequency
              </Label>
              <Select value={frequency} onValueChange={setFrequency}>
                <SelectTrigger className="h-10 w-full rounded-xl border-gray-200 bg-gray-50 text-sm font-normal">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="once">Once</SelectItem>
                  <SelectItem value="daily">Daily</SelectItem>
                  <SelectItem value="weekly">Weekly</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="grid grid-cols-3 gap-4">
            <div className="space-y-1.5 col-span-1">
              <Label className="text-[11px] text-gray-500 font-medium uppercase tracking-wider flex items-center gap-1.5">
                <CalendarIcon size={11} />Date
              </Label>
              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    variant="outline"
                    className={cn(
                      "w-full h-10 justify-start text-left font-normal rounded-xl border-gray-200 bg-gray-50 text-sm px-3",
                      !selectedDate && "text-gray-400"
                    )}
                  >
                    <CalendarIcon size={14} className="mr-2 text-gray-400 shrink-0" />
                    {selectedDate ? format(selectedDate, "MMM d") : "Pick date"}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0 rounded-xl border-gray-200 shadow-lg" align="start">
                  <Calendar
                    mode="single"
                    selected={selectedDate}
                    onSelect={setSelectedDate}
                    disabled={(date) => date < new Date(new Date().setHours(0,0,0,0))}
                    initialFocus
                  />
                </PopoverContent>
              </Popover>
            </div>

            <div className="space-y-1.5">
              <Label className="text-[11px] text-gray-500 font-medium uppercase tracking-wider flex items-center gap-1.5">
                <Clock size={11} />Time
              </Label>
              <Input
                type="time"
                className="h-10 text-sm rounded-xl border-gray-200 bg-gray-50 px-3 font-normal"
                value={time}
                onChange={(e) => setTime(e.target.value)}
              />
            </div>

            <div className="space-y-1.5">
              <Label className="text-[11px] text-gray-500 font-medium uppercase tracking-wider flex items-center gap-1.5">
                <Clock size={11} />Duration
              </Label>
              <div className="relative">
                <Input
                  type="number"
                  min="1"
                  className="h-10 text-sm rounded-xl border-gray-200 bg-gray-50 px-3 font-normal pr-10"
                  value={duration}
                  onChange={(e) => setDuration(e.target.value)}
                />
                <span className="absolute right-3 top-1/2 -translate-y-1/2 text-[10px] text-gray-400 font-medium">min</span>
              </div>
            </div>
          </div>

          {combined && (
            <div className={cn(
              "px-4 py-3 rounded-xl border flex items-center gap-3",
              isPast ? "bg-amber-50 border-amber-100 text-amber-700" : "bg-green-50 border-green-100 text-green-700"
            )}>
              {isPast ? <AlertTriangle size={14} /> : <Clock size={14} />}
              <span className="text-[11px] font-semibold">
                {isPast 
                  ? "Note: This time has already passed! Change it to start now." 
                  : `Perfect! Bot will send the first reminder in roughly ${diff} minute${diff === 1 ? "" : "s"}.`}
              </span>
            </div>
          )}

          <div className="space-y-1.5">
            <Label className="text-[11px] text-gray-500 font-medium uppercase tracking-wider flex items-center gap-1.5">
              <AlignLeft size={11} />Notes <span className="normal-case text-gray-400 font-normal capitalize">(optional)</span>
            </Label>
            <Textarea
              placeholder="Any details to keep in mind..."
              className="min-h-[80px] text-sm rounded-xl border-gray-200 bg-gray-50 px-4 py-3 font-normal resize-none"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
            />
          </div>
        </div>

        <Separator />

        <div className="px-6 py-5">
          <Button
            onClick={handleSubmit}
            disabled={loading}
            className="w-full h-10 rounded-xl text-sm font-medium"
          >
            {loading ? "Saving..." : (editTask ? "Update Plan" : "Create Plan")}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
