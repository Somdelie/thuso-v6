import Navbar from "@/components/admin/Navbar";
import { Sidebar } from "@/components/admin/Sidebar";

export const metadata = {
  title: "Admin@Thuso.com",
  description: "This content is for admin only",
};

const DashboardLayout = async ({ children }: { children: React.ReactNode }) => {
  return (
    <div className="grid min-h-screen w-full md:grid-cols-[220px_1fr] lg:grid-cols-[280px_1fr]">
      <Sidebar />
      <div className="flex flex-col">
        <Navbar />
        <main className="flex flex-1 flex-col gap-4 p-4 lg:gap-6 lg:p-6">
          {children}
        </main>
      </div>
    </div>
  );
};

export default DashboardLayout;
