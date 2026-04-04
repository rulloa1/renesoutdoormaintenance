import { Toaster as SonnerToaster } from "sonner";

export function Toaster() {
  return (
    <SonnerToaster
      theme="dark"
      className="toaster group"
      toastOptions={{
        classNames: {
          toast: "group toast bg-[#1A1A1A] border border-white/10 text-white",
          description: "text-white/60",
          actionButton: "bg-[#B5E61D] text-[#0D0D0D]",
          cancelButton: "bg-white/10 text-white",
        },
      }}
    />
  );
}
