import { trpc } from "@/lib/trpc";
import { useLocation } from "wouter";
import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ChevronDown, LogOut, Calendar as CalendarIcon, List } from "lucide-react";
import AppointmentCalendar from "@/components/AppointmentCalendar";

export default function AdminDashboard() {
  const [, setLocation] = useLocation();
  const [expandedId, setExpandedId] = useState<number | null>(null);
  const [view, setView] = useState<"list" | "calendar">("list");

  // Check if admin is logged in
  const { data: adminSession } = trpc.admin.me.useQuery();

  // Redirect if not authenticated
  useEffect(() => {
    if (adminSession === null) {
      setLocation("/admin");
    }
  }, [adminSession, setLocation]);

  // Fetch appointments
  const { data: appointments, isLoading, refetch } = trpc.appointments.list.useQuery({
    limit: 50,
    offset: 0,
  });

  const updateStatusMutation = trpc.appointments.updateStatus.useMutation({
    onSuccess: () => {
      refetch();
    },
  });

  const handleStatusChange = (id: number, newStatus: string) => {
    updateStatusMutation.mutate({
      id,
      status: newStatus as "pending" | "confirmed" | "completed" | "cancelled",
    });
  };

  const logoutMutation = trpc.admin.logout.useMutation();

  const handleLogout = async () => {
    await logoutMutation.mutateAsync();
    setLocation("/admin");
  };

  if (adminSession === null || adminSession === undefined) {
    return null;
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case "pending":
        return "bg-yellow-500/20 text-yellow-400";
      case "confirmed":
        return "bg-blue-500/20 text-blue-400";
      case "completed":
        return "bg-green-500/20 text-green-400";
      case "cancelled":
        return "bg-red-500/20 text-red-400";
      default:
        return "bg-gray-500/20 text-gray-400";
    }
  };

  return (
    <div className="min-h-screen bg-[#0D0D0D]">
      {/* Header */}
      <div className="bg-[#111111] border-b border-white/10 sticky top-0 z-50">
        <div className="container py-4 flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-black text-white" style={{ fontFamily: "'Barlow Condensed', sans-serif" }}>
              Appointments Dashboard
            </h1>
            <p className="text-white/50 text-sm">Logged in as {adminSession?.email}</p>
          </div>
          <Button
            onClick={handleLogout}
            variant="outline"
            className="flex items-center gap-2 border-white/20 text-white hover:bg-white/10"
          >
            <LogOut size={16} />
            Logout
          </Button>
        </div>
      </div>

      {/* View tabs */}
      <div className="bg-[#111111] border-b border-white/10 sticky top-20 z-40">
        <div className="container flex items-center gap-4 py-4">
          <button
            onClick={() => setView("list")}
            className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-all ${
              view === "list"
                ? "bg-[#B5E61D] text-[#0D0D0D]"
                : "text-white/60 hover:text-white hover:bg-white/5"
            }`}
          >
            <List size={18} />
            List View
          </button>
          <button
            onClick={() => setView("calendar")}
            className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-all ${
              view === "calendar"
                ? "bg-[#B5E61D] text-[#0D0D0D]"
                : "text-white/60 hover:text-white hover:bg-white/5"
            }`}
          >
            <CalendarIcon size={18} />
            Calendar View
          </button>
        </div>
      </div>

      {/* Content */}
      <div className="container py-8">
        {isLoading ? (
          <div className="text-center py-12">
            <p className="text-white/50">Loading appointments...</p>
          </div>
        ) : appointments && appointments.length > 0 ? (
          <>
            {view === "calendar" ? (
              <AppointmentCalendar
                appointments={appointments}
                onSelectEvent={(apt) => {
                  setExpandedId(apt.id);
                  setView("list");
                }}
              />
            ) : (
              <div className="space-y-4">
                {appointments.map((apt) => (
                  <div
                    key={apt.id}
                    className="bg-[#111111] border border-white/10 rounded-lg overflow-hidden hover:border-[#B5E61D]/40 transition-colors"
                  >
                    {/* Summary row */}
                    <button
                      onClick={() => setExpandedId(expandedId === apt.id ? null : apt.id)}
                      className="w-full p-4 flex items-center justify-between hover:bg-white/5 transition-colors"
                    >
                      <div className="flex items-center gap-4 flex-1 text-left">
                        <div className="flex-1">
                          <p className="text-white font-bold">{apt.customerName}</p>
                          <p className="text-white/50 text-sm">{apt.customerEmail}</p>
                        </div>
                        <Badge className={getStatusColor(apt.status)}>
                          {apt.status.charAt(0).toUpperCase() + apt.status.slice(1)}
                        </Badge>
                      </div>
                      <ChevronDown
                        size={20}
                        className={`text-white/50 transition-transform ${expandedId === apt.id ? "rotate-180" : ""}`}
                      />
                    </button>

                    {/* Expanded details */}
                    {expandedId === apt.id && (
                      <div className="border-t border-white/10 p-4 bg-white/5 space-y-4">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <div>
                            <p className="text-white/50 text-xs font-bold uppercase mb-1">Phone</p>
                            <p className="text-white">{apt.customerPhone}</p>
                          </div>
                          <div>
                            <p className="text-white/50 text-xs font-bold uppercase mb-1">Address</p>
                            <p className="text-white">{apt.serviceAddress}</p>
                          </div>
                          <div>
                            <p className="text-white/50 text-xs font-bold uppercase mb-1">Services</p>
                            <p className="text-white">{apt.services.join(", ")}</p>
                          </div>
                          <div>
                            <p className="text-white/50 text-xs font-bold uppercase mb-1">Preferred Time</p>
                            <p className="text-white">
                              {apt.preferredDate
                                ? new Date(apt.preferredDate).toLocaleDateString() +
                                  (apt.preferredTime ? ` at ${apt.preferredTime}` : "")
                                : "Not specified"}
                            </p>
                          </div>
                        </div>

                        {apt.notes && (
                          <div>
                            <p className="text-white/50 text-xs font-bold uppercase mb-1">Notes</p>
                            <p className="text-white/70">{apt.notes}</p>
                          </div>
                        )}

                        {/* Status update buttons */}
                        <div className="flex flex-wrap gap-2 pt-4 border-t border-white/10">
                          {["pending", "confirmed", "completed", "cancelled"].map((status) => (
                            <Button
                              key={status}
                              onClick={() => handleStatusChange(apt.id, status)}
                              variant={apt.status === status ? "default" : "outline"}
                              size="sm"
                              className={`capitalize ${
                                apt.status === status
                                  ? "bg-[#B5E61D] text-[#0D0D0D] hover:bg-[#A8D419]"
                                  : "border-white/20 text-white/70 hover:text-white"
                              }`}
                              disabled={updateStatusMutation.isPending}
                            >
                              {status}
                            </Button>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            )}
          </>
        ) : (
          <div className="text-center py-12">
            <p className="text-white/50 mb-4">No appointments yet</p>
            <p className="text-white/30 text-sm">Appointments will appear here when customers submit booking requests</p>
          </div>
        )}
      </div>
    </div>
  );
}
