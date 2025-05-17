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
  DollarSign 
} from "lucide-react";

interface SidebarProps {
  open: boolean;
}

export default function Sidebar({ open }: SidebarProps) {
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
    <aside 
      className={cn(
        "sidebar bg-white w-64 transform transition-transform shadow-md h-auto",
        open ? "open" : ""
      )}
    >
      <div className="flex flex-col h-full">
        <div className="p-4 border-b border-neutral-200">
          <div className="flex items-center space-x-3">
            <span className="h-8 w-8 bg-primary rounded-md flex items-center justify-center">
              <DollarSign className="h-5 w-5 text-white" />
            </span>
            <h1 className="text-lg font-bold text-neutral-800">Finance Manager</h1>
          </div>
        </div>
        
        <nav className="flex-1 py-4 overflow-y-auto">
          <ul className="px-2 space-y-1">
            {sidebarLinks.map((link) => (
              <li key={link.path}>
                <Link href={link.path}>
                  <a 
                    className={cn(
                      "sidebar-link flex items-center px-4 py-3 text-sm font-medium rounded-md",
                      location === link.path 
                        ? "active" 
                        : "text-neutral-600 hover:bg-neutral-100"
                    )}
                  >
                    {link.icon}
                    {link.label}
                  </a>
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
