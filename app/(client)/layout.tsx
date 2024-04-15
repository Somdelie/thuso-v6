import Navbar from "@/components/client/common/Navbar";


const DashboardLayout = async ({ children }: { children: React.ReactNode }) => {
  return (
    <main className="min-h-screen ">
      <Navbar />
      {children}
      {/* <Footer /> */}
    </main>
  );
};

export default DashboardLayout;