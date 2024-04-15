const DashboardLayout = async ({ children }: { children: React.ReactNode }) => {
  return (
    <div>
      <main className="min-h-screen flex items-center justify-center">
        {children}
      </main>
    </div>
  );
};

export default DashboardLayout;
