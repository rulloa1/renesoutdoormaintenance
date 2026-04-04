import { Calendar, dateFnsLocalizer } from "react-big-calendar";
import { format, parse, startOfWeek, getDay } from "date-fns";
import { enUS } from "date-fns/locale/en-US";
import "react-big-calendar/lib/css/react-big-calendar.css";
import { useState } from "react";
import { Badge } from "@/components/ui/badge";

const locales = {
  "en-US": enUS,
};

const localizer = dateFnsLocalizer({
  format,
  parse,
  startOfWeek,
  getDay,
  locales,
});

interface Appointment {
  id: number;
  customerName: string;
  customerEmail: string;
  customerPhone: string;
  serviceAddress: string;
  services: string[];
  preferredDate?: Date | null;
  preferredTime?: string | null;
  status: string;
  notes?: string | null;
  createdAt: Date;
  updatedAt: Date;
}

interface CalendarEvent {
  id: number;
  title: string;
  start: Date;
  end: Date;
  resource: Appointment;
}

interface AppointmentCalendarProps {
  appointments: Appointment[];
  onSelectEvent: (appointment: Appointment) => void;
}

export default function AppointmentCalendar({ appointments, onSelectEvent }: AppointmentCalendarProps) {
  const [view, setView] = useState<"month" | "week" | "day" | "agenda">("month");

  // Convert appointments to calendar events
  const events: CalendarEvent[] = appointments
    .filter((apt) => apt.preferredDate)
    .map((apt) => {
      const date = new Date(apt.preferredDate!);
      const [hours = 9, minutes = 0] = apt.preferredTime?.split(":").map(Number) || [];
      date.setHours(hours, minutes, 0);

      const endDate = new Date(date);
      endDate.setHours(endDate.getHours() + 1);

      return {
        id: apt.id,
        title: `${apt.customerName} - ${apt.services.join(", ")}`,
        start: date,
        end: endDate,
        resource: apt,
      };
    });

  const getEventStyle = (event: CalendarEvent) => {
    const statusColors: Record<string, string> = {
      pending: "#EAB308",
      confirmed: "#3B82F6",
      completed: "#22C55E",
      cancelled: "#EF4444",
    };

    return {
      style: {
        backgroundColor: statusColors[event.resource.status] || "#6B7280",
        borderRadius: "4px",
        opacity: 0.9,
        color: "white",
        border: "1px solid rgba(255,255,255,0.2)",
        display: "block",
      } as React.CSSProperties,
    };
  };

  const EventComponent = ({ event }: { event: CalendarEvent }) => (
    <div className="p-1 text-xs font-semibold truncate">
      <p className="truncate">{event.resource.customerName}</p>
      <p className="text-white/80 text-xs truncate">{event.resource.services[0]}</p>
    </div>
  );

  return (
    <div className="bg-[#111111] border border-white/10 rounded-lg overflow-hidden">
      <style>{`
        .rbc-calendar {
          font-family: 'DM Sans', sans-serif;
          color: white;
        }
        .rbc-header {
          background-color: #1a1a1a;
          color: white;
          padding: 12px 4px;
          font-weight: 600;
          border-color: rgba(255,255,255,0.1);
        }
        .rbc-today {
          background-color: rgba(181, 230, 29, 0.1);
        }
        .rbc-off-range-bg {
          background-color: rgba(0,0,0,0.2);
        }
        .rbc-date-cell {
          padding: 4px;
        }
        .rbc-date-cell > a {
          color: #B5E61D;
        }
        .rbc-day-bg {
          background-color: #0d0d0d;
        }
        .rbc-day-bg + .rbc-day-bg {
          border-left: 1px solid rgba(255,255,255,0.1);
        }
        .rbc-month-row {
          border-top: 1px solid rgba(255,255,255,0.1);
        }
        .rbc-event {
          padding: 2px 4px;
          background-color: rgba(181, 230, 29, 0.8);
          border: none;
          color: #0d0d0d;
        }
        .rbc-event:hover {
          background-color: rgba(181, 230, 29, 1);
        }
        .rbc-toolbar {
          padding: 12px;
          background-color: #1a1a1a;
          border-bottom: 1px solid rgba(255,255,255,0.1);
          flex-wrap: wrap;
          gap: 8px;
        }
        .rbc-toolbar button {
          background-color: transparent;
          border: 1px solid rgba(255,255,255,0.2);
          color: white;
          padding: 6px 12px;
          border-radius: 4px;
          cursor: pointer;
          font-size: 12px;
          transition: all 0.2s;
        }
        .rbc-toolbar button:hover {
          background-color: rgba(181, 230, 29, 0.2);
          border-color: #B5E61D;
        }
        .rbc-toolbar button.rbc-active {
          background-color: #B5E61D;
          color: #0d0d0d;
          border-color: #B5E61D;
        }
        .rbc-toolbar-label {
          color: white;
          font-weight: 600;
          font-size: 16px;
        }
        .rbc-time-view {
          background-color: #0d0d0d;
        }
        .rbc-time-header-content {
          border-left: 1px solid rgba(255,255,255,0.1);
        }
        .rbc-time-header-gutter {
          background-color: #1a1a1a;
        }
        .rbc-time-slot {
          background-color: #0d0d0d;
        }
        .rbc-current-time-indicator {
          background-color: #B5E61D;
          height: 2px;
        }
        .rbc-time-content {
          border-top: 1px solid rgba(255,255,255,0.1);
        }
      `}</style>

      <div style={{ height: "600px" }}>
        <Calendar
          localizer={localizer}
          events={events}
          startAccessor="start"
          endAccessor="end"
          style={{ height: "100%" }}
          view={view}
          onView={(newView: any) => setView(newView as any)}
          views={["month", "week", "day", "agenda"]}
          onSelectEvent={(event: any) => onSelectEvent(event.resource)}
          eventPropGetter={getEventStyle}
          components={{
            event: EventComponent,
          }}
          popup
          selectable
        />
      </div>
    </div>
  );
}
