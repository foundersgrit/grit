import { SidebarNav } from "@/components/layout/SidebarNav";

export default function AccountLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex-1 bg-dark-slate text-white pt-24 pb-32">
      <div className="container mx-auto px-4 max-w-6xl">
        <div className="flex flex-col md:flex-row gap-12 lg:gap-24">
          <SidebarNav />
          <div className="flex-1">
            {children}
          </div>
        </div>
      </div>
    </div>
  );
}
