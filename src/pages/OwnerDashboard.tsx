import { useLocation } from "wouter";
import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ChevronDown, LogOut, Calendar as CalendarIcon, List } from "lucide-react";
import { trpc } from "@/lib/trpc";
import AppointmentCalendar from "@/components/AppointmentCalendar";

export default function OwnerDashboard() {
  const [, setLocation] = useLocation();
  const [expandedId, setExpandedId] = useState<number | null>(null);
  const [view, setView] = useState<"list" | "calendar">("list");

  // Check if owner is logged in
  const { data: ownerSession } = trpc.admin.me.useQuery();

  // Redirect if not authenticated or not the owner
  useEffect(() => {
    if (ownerSession === null) {
      setLocation("/owner");
    }
  }, [ownerSession, setLocation]);

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
    setLocation("/owner");
  };

  if (ownerSession === null || ownerSession === undefined) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-brand-dark">
        <div className="text-center">
          <p className="text-gray-400">Loading...</p>
        </div>
      </div>
    );
  }

  const statusColors: Record<string, string> = {
    pending: "bg-yellow-500/20 text-yellow-400",
    confirmed: "bg-blue-500/20 text-blue-400",
    completed: "bg-green-500/20 text-green-400",
    cancelled: "bg-red-500/20 text-red-400",
  };

  return (
    <div className="min-h-screen bg-brand-dark text-white">
      {/* Header */}
      <div className="bg-brand-darker border-b border-brand-accent/20 p-6">
        <div className="max-w-7xl mx-auto flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold text-brand-accent">Owner Portal</h1>
            <p className="text-gray-400 mt-1">Manage your appointments</p>
          </div>
          <Button
            onClick={handleLogout}
            variant="outline"
            className="border-brand-accent/20 hover:bg-brand-accent/10"
          >
            <LogOut className="mr-2 h-4 w-4" />
            Logout
          </Button>
        </div>
      </div>

      {/* View Toggle */}
      <div className="bg-brand-darker border-b border-brand-accent/20 p-6">
        <div className="max-w-7xl mx-auto flex gap-4">
          <Button
            onClick={() => setView("list")}
            variant={view === "list" ? "default" : "outline"}
            className={view === "list" ? "bg-brand-accent text-black" : "border-brand-accent/20"}
          >
            <List className="mr-2 h-4 w-4" />
            List View
          </Button>
          <Button
            onClick={() => setView("calendar")}
            variant={view === "calendar" ? "default" : "outline"}
            className={view === "calendar" ? "bg-brand-accent text-black" : "border-brand-accent/20"}
          >
            <CalendarIcon className="mr-2 h-4 w-4" />
            Calendar View
          </Button>
        </div>
      </div>

      {/* Content */}
      <div className="p-6">
        <div className="max-w-7xl mx-auto">
          {view === "list" ? (
            // List View
            <div className="space-y-4">
              {isLoading ? (
                <p className="text-gray-400">Loading appointments...</p>
              ) : appointments && appointments.length > 0 ? (
                appointments.map((appointment: any) => (
                  <div
                    key={appointment.id}
                    className="bg-brand-darker border border-brand-accent/20 rounded-lg overflow-hidden"
                  >
                    <div
                      className="p-4 cursor-pointer hover:bg-brand-dark/50 transition-colors"
                      onClick={() =>
                        setExpandedId(expandedId === appointment.id ? null : appointment.id)
                      }
                    >
                      <div className="flex items-center justify-between">
                        <div className="flex-1">
                          <h3 className="font-semibold text-lg">{appointment.customerName}</h3>
                          <p className="text-gray-400 text-sm">
                            {appointment.preferredDate
                              ? new Date(appointment.preferredDate).toLocaleDateString()
                              : "No date set"}
                          </p>
                        </div>
                        <div className="flex items-center gap-3">
                          <Badge className={statusColors[appointment.status]}>
                            {appointment.status}
                          </Badge>
                          <ChevronDown
                            className={`h-5 w-5 transition-transform ${
                              expandedId === appointment.id ? "rotate-180" : ""
                            }`}
                          />
                        </div>
                      </div>
                    </div>

                    {expandedId === appointment.id && (
                      <div className="bg-brand-dark/50 border-t border-brand-accent/20 p-4 space-y-4">
                        <div className="grid grid-cols-2 gap-4">
                          <div>
                            <p className="text-gray-400 text-sm">Phone</p>
                            <p className="font-medium">{appointment.customerPhone}</p>
                          </div>
                          <div>
                            <p className="text-gray-400 text-sm">Email</p>
                            <p className="font-medium">{appointment.customerEmail}</p>
                          </div>
                          <div className="col-span-2">
                            <p className="text-gray-400 text-sm">Address</p>
                            <p className="font-medium">{appointment.serviceAddress}</p>
                          </div>
                          <div className="col-span-2">
                            <p className="text-gray-400 text-sm">Services</p>
                            <div className="flex flex-wrap gap-2 mt-2">
                              {appointment.services.map((service: string, idx: number) => (
                                <Badge key={idx} variant="secondary">
                                  {service}
                                </Badge>
                              ))}
                            </div>
                          </div>
                          {appointment.notes && (
                            <div className="col-span-2">
                              <p className="text-gray-400 text-sm">Notes</p>
                              <p className="font-medium">{appointment.notes}</p>
                            </div>
                          )}
                        </div>

                        <div className="flex gap-2 pt-4 border-t border-brand-accent/20">
                          <select
                            value={appointment.status}
                            onChange={(e) => handleStatusChange(appointment.id, e.target.value)}
                            className="flex-1 bg-brand-darker border border-brand-accent/20 rounded px-3 py-2 text-white"
                          >
                            <option value="pending">Pending</option>
                            <option value="confirmed">Confirmed</option>
                            <option value="completed">Completed</option>
                            <option value="cancelled">Cancelled</option>
                          </select>
                        </div>
                      </div>
                    )}
                  </div>
                ))
              ) : (
                <p className="text-gray-400">No appointments yet</p>
              )}
            </div>
          ) : (
            // Calendar View
            <AppointmentCalendar
              appointments={appointments || []}
              onSelectEvent={(appointment) => setExpandedId(appointment.id)}
            />
          )}
        </div>
      </div>
    </div>
  );
}
