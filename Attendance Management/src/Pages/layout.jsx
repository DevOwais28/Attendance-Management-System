import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar"
import { AppSidebar } from "./app-sidebar"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { useNavigate } from "react-router-dom"
import { LogIn, LogOutIcon } from "lucide-react"

export default function Layout({children}) {
  const navigate = useNavigate()
  return (
    <SidebarProvider>
      <AppSidebar />
      <main className="w-full min-h-screen bg-slate-900 text-gray-100">
        <nav className="flex items-center justify-between p-4 bg-slate-800 border-b border-slate-700">
          <SidebarTrigger className="text-gray-300 hover:text-gray-100" />
          <DropdownMenu>
            <DropdownMenuTrigger className="border-none p-2 hover:bg-slate-700 rounded-lg transition-colors">
              <LogOutIcon className="w-5 h-5 text-gray-300 hover:text-gray-100" />
            </DropdownMenuTrigger>
            <DropdownMenuContent className="bg-slate-800 border-slate-700">
              <DropdownMenuItem 
                onClick={()=>{
                  localStorage.clear()
                  navigate('/login')
                }}
                className="text-gray-300 hover:bg-slate-700 hover:text-gray-100"
              >
                Logout
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </nav>
        <div className="flex-1">
          {children}
        </div>
      </main>
    </SidebarProvider>
  )
}