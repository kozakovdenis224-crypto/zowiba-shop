import AdminSidebarWrapper from "@/components/admin/AdminSidebarWrapper";

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex min-h-dvh">
      <AdminSidebarWrapper />
      <div className="flex-1 p-6 sm:p-8">{children}</div>
    </div>
  );
}
