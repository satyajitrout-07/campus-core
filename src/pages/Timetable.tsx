import React, { useState } from 'react';
import { useData } from '../context/DataContext';
import { Badge } from '../components/ui/Badge';
import { Calendar, Clock, MapPin, GraduationCap, BookOpen } from 'lucide-react';

export const Timetable: React.FC = () => {
  const { timetable } = useData();
  const [selectedDay, setSelectedDay] = useState<string>('Monday');

  const days = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'];

  const daySlots = timetable.filter((slot) => slot.dayOfWeek === selectedDay);

  return (
    <div className="space-y-6 animate-fade-in pb-10">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-extrabold text-slate-900 dark:text-slate-50">Weekly Class Timetable</h1>
        <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
          Scheduled lecture slots, classroom hall numbers, and professor session times
        </p>
      </div>

      {/* Day Selector Tabs */}
      <div className="flex items-center gap-1.5 p-1 bg-slate-100 dark:bg-slate-800/80 rounded-2xl max-w-2xl">
        {days.map((day) => {
          const isActive = selectedDay === day;
          const count = timetable.filter((t) => t.dayOfWeek === day).length;
          return (
            <button
              key={day}
              onClick={() => setSelectedDay(day)}
              className={`flex-1 py-2.5 px-3 rounded-xl text-xs font-semibold transition-all flex items-center justify-center gap-1.5 ${
                isActive
                  ? 'bg-white dark:bg-slate-900 text-brand-600 dark:text-brand-400 shadow-soft-sm font-bold'
                  : 'text-slate-500 hover:text-slate-900 dark:text-slate-400 dark:hover:text-white'
              }`}
            >
              <span>{day}</span>
              <span className={`text-[10px] px-1.5 py-0.2 rounded-full ${isActive ? 'bg-brand-100 dark:bg-brand-950 text-brand-700' : 'bg-slate-200 dark:bg-slate-700 text-slate-600'}`}>
                {count}
              </span>
            </button>
          );
        })}
      </div>

      {/* Day Slots List */}
      <div className="space-y-4">
        {daySlots.length === 0 ? (
          <div className="glass-card p-12 text-center text-slate-400">
            <Calendar className="w-10 h-10 mx-auto mb-3 opacity-40" />
            <p className="text-sm font-semibold">No scheduled lectures for {selectedDay}.</p>
            <p className="text-xs mt-1">Enjoy your study break or lab preparation.</p>
          </div>
        ) : (
          daySlots.map((slot) => (
            <div
              key={slot.id}
              className="glass-card p-5 flex flex-col md:flex-row md:items-center justify-between gap-4 hover:border-brand-500/40 transition-all"
            >
              <div className="flex items-start gap-4">
                <div className="p-3 bg-brand-50 dark:bg-brand-950/60 text-brand-600 dark:text-brand-400 rounded-2xl flex flex-col items-center justify-center min-w-[110px]">
                  <Clock className="w-4 h-4 mb-1" />
                  <span className="text-xs font-bold">{slot.startTime}</span>
                  <span className="text-[10px] text-slate-400 font-medium">to {slot.endTime}</span>
                </div>

                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <span className="font-mono text-xs font-extrabold px-2 py-0.5 bg-brand-100 dark:bg-brand-950 text-brand-700 dark:text-brand-300 rounded-md">
                      {slot.courseCode}
                    </span>
                    <h3 className="text-base font-bold text-slate-900 dark:text-slate-100">{slot.courseName}</h3>
                  </div>

                  <div className="flex items-center gap-4 text-xs text-slate-500 dark:text-slate-400 pt-1">
                    <span className="flex items-center gap-1">
                      <GraduationCap className="w-3.5 h-3.5 text-slate-400" />
                      {slot.teacherName}
                    </span>
                    <span className="flex items-center gap-1 font-semibold text-slate-700 dark:text-slate-300">
                      <MapPin className="w-3.5 h-3.5 text-brand-500" />
                      {slot.roomNumber}
                    </span>
                  </div>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <Badge variant="success">Confirmed Slot</Badge>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};
