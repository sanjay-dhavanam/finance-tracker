import { Link, useLocation } from "wouter";
import { cn } from "@/lib/utils";
import { 
  BarChart4, 
  Home, 
  CreditCard, 
  Wallet, 
  Tag, 
  LineChart, 
  Settings, 
  DollarSign,
  Menu,
  X
} from "lucide-react";
import { Button } from "@/components/ui/button";

interface SidebarProps {
  open: boolean;
  toggleSidebar: () => void;
}

export default function Sidebar({ open, toggleSidebar }: SidebarProps) {
  const [location] = useLocation();

  const sidebarLinks = [
    { path: "/", label: "Dashboard", icon: <Home className="h-5 w-5 mr-3" /> },
    { path: "/transactions", label: "Transactions", icon: <CreditCard className="h-5 w-5 mr-3" /> },
    { path: "/budgets", label: "Budgets", icon: <Wallet className="h-5 w-5 mr-3" /> },
    { path: "/categories", label: "Categories", icon: <Tag className="h-5 w-5 mr-3" /> },
    { path: "/reports", label: "Reports", icon: <LineChart className="h-5 w-5 mr-3" /> },
    { path: "/settings", label: "Settings", icon: <Settings className="h-5 w-5 mr-3" /> },
  ];

  return (
    <aside className="bg-white shadow-md w-64 h-screen">
      <div className="flex flex-col h-full">
        <div className="p-4 border-b border-neutral-200 flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <span className="h-8 w-8 bg-primary rounded-md flex items-center justify-center">
              <DollarSign className="h-5 w-5 text-white" />
            </span>
            <h1 className="text-lg font-bold text-neutral-800">Finance Manager</h1>
          </div>
          
          {/* Mobile hamburger menu button */}
          <Button
            variant="ghost"
            size="icon"
            onClick={toggleSidebar}
            className="md:hidden text-neutral-500 hover:text-neutral-700"
          >
            <X className="h-6 w-6" />
            <span className="sr-only">Close sidebar</span>
          </Button>
        </div>
        
        <nav className="flex-1 py-4 overflow-y-auto">
          <ul className="px-2 space-y-1">
            {sidebarLinks.map((link) => (
              <li key={link.path}>
                <Link href={link.path}>
                  <div 
                    className={cn(
                      "sidebar-link flex items-center px-4 py-3 text-sm font-medium rounded-md",
                      location === link.path 
                        ? "bg-primary text-white" 
                        : "text-neutral-600 hover:bg-neutral-100"
                    )}
                  >
                    {link.icon}
                    {link.label}
                  </div>
                </Link>
              </li>
            ))}
          </ul>
        </nav>
        
        <div className="p-4 border-t border-neutral-200">
          <div className="flex items-center p-2 text-sm font-medium text-neutral-600 rounded-md hover:bg-neutral-100">
            <span className="h-8 w-8 bg-neutral-200 rounded-full mr-3 flex items-center justify-center">
              <span className="text-sm font-medium text-neutral-700">JS</span>
            </span>
            <span>John Smith</span>
          </div>
        </div>
      </div>
    </aside>
  );
}
