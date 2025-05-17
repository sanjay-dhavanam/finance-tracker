import { useState } from "react";
import Sidebar from "./Sidebar";
import Header from "./Header";
import { Button } from "@/components/ui/button";
import { Menu } from "lucide-react";

interface LayoutProps {
  children: React.ReactNode;
}

export default function Layout({ children }: LayoutProps) {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const toggleSidebar = () => {
    setSidebarOpen(!sidebarOpen);
  };

  return (
    <div className="flex flex-col md:flex-row min-h-screen bg-neutral-100">
      {/* Mobile sidebar overlay */}
      {sidebarOpen && (
        <div 
          className="fixed inset-0 bg-black bg-opacity-50 z-40 md:hidden"
          onClick={toggleSidebar}
        ></div>
      )}
      
      {/* Mobile sidebar - absolute positioned with fixed position */}
      <div className={`fixed top-0 left-0 h-full md:relative md:block ${sidebarOpen ? 'block' : 'hidden'} z-50`}>
        <Sidebar open={sidebarOpen} toggleSidebar={toggleSidebar} />
      </div>
      
      {/* Main content */}
      <div className="flex-1 flex flex-col">
        <div className="bg-white border-b border-neutral-200 shadow-sm flex items-center md:hidden">
          <Button
            variant="ghost"
            size="icon"
            onClick={toggleSidebar}
            className="m-2 text-neutral-500 hover:text-neutral-700"
          >
            <Menu className="h-6 w-6" />
            <span className="sr-only">Open sidebar</span>
          </Button>
          <span className="font-bold">Finance Manager</span>
        </div>

        <Header />
        
        <main className="flex-1 p-4 md:p-6">
          <div className="max-w-7xl mx-auto">
            {children}
          </div>
        </main>
      </div>
    </div>
  );
}
