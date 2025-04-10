import { useNavigate } from "react-router-dom";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { LogOut, UserCircle } from "lucide-react";
import Logo from "../assets/logo.png"

export default function Header() {
  const navigate = useNavigate();

  const handleLogout = async () => {
    try {
      const response = await fetch("http://localhost:3000/api/auth/logout", {
        method: "POST",
        credentials: "include", // This is good, keeps cookies
        headers: {
          "Authorization": `Bearer ${localStorage.getItem("authToken")}` // Add this if your API expects a token in headers
        }
      });
  
      if (response.ok) {
        localStorage.removeItem("authToken");
        navigate("/"); // You might want to redirect to login instead of dashboard
      } else {
        console.error("Logout failed");
      }
    } catch (error) {
      console.error("Error logging out:", error);
    }
  };

  return (
    <header className="bg-white shadow-md px-6 py-4 flex justify-between items-center w-full">
      {/* Logo on the left */}
      <div className="flex items-center">
        <img src={Logo} alt="Logo" className="w-10 h-10 mr-3" />
        <span className="text-2xl font-bold text-gray-800">CodeFolio</span>
      </div>

      {/* Profile Dropdown on the right */}
      <div className="relative">
        <DropdownMenu>
          <DropdownMenuTrigger className="outline-none">
            <Avatar className="w-10 h-10 cursor-pointer hover:ring-2 hover:ring-gray-200 transition-all">
              <AvatarImage src="/profile.jpg" alt="Profile" />
              <AvatarFallback><UserCircle className="w-4 h-4 mr-2" /></AvatarFallback>
            </Avatar>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" side="bottom" sideOffset={5} className="w-48 mt-1">
            <DropdownMenuItem onClick={() => navigate("/dashboard")} className="cursor-pointer text-base">
              <UserCircle className="w-8 h-8 mr-2" />
              <span> Profile</span>
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => navigate("/settings")} className="cursor-pointer text-base">
            <span>⚙️</span>
            Settings
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem onClick={handleLogout} className="cursor-pointer text-red-500 focus:text-red-500 text-base">
              <LogOut className="w-4 h-4 mr-2" />
              <span>Logout</span>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </header>
  );
}
