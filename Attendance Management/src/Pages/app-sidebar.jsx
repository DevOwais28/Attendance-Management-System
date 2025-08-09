import { Calendar, Home, Inbox, Search, Settings, Users, BarChart3, UserCheck, BookOpen } from "lucide-react"
import { Link, useLocation } from "react-router-dom"
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar"
import useAppStore from "../Store"
import { useMemo } from "react"

export function AppSidebar() {
  const { userRole } = useAppStore()
  const location = useLocation()
  
  const items = useMemo(() => {
    if (userRole === 'teacher') {
      return [
        {
          title: "Students Management",
          url: "/",
          icon: Users,
          description: "Manage all students",
        },
        {
          title: "Dashboard",
          url: "/dashboard",
          icon: BarChart3,
          description: "Class analytics & insights",
        },
        {
          title: "Take Attendance",
          url: "/attendance",
          icon: Calendar,
          description: "Mark today's attendance",
        },
        {
          title: "Reports",
          url: "/report",
          icon: UserCheck,
          description: "View attendance reports",
        },
      ]
    } else {
      return [
        {
          title: "Dashboard",
          url: "/dashboard",
          icon: BarChart3,
          description: "Your monthly attendance",
        },
        {
          title: "Attendance",
          url: "/report",
          icon: BookOpen,
          description: "View your attendance records",
        },
      ]
    }
  }, [userRole])

  const isActive = (url) => location.pathname === url  

  return (
    <Sidebar className="bg-gradient-to-b from-slate-900 via-slate-800 to-slate-900 border-r border-slate-700/50 shadow-xl">
      <SidebarContent className="bg-transparent">
        <SidebarGroup className="bg-transparent px-4 py-6">
          <SidebarGroupLabel className="text-transparent bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-xl font-bold pb-6 border-b border-slate-700/50 mb-6">
            🎓 Attendance System
          </SidebarGroupLabel>
          <SidebarGroupContent className="bg-transparent">
            <SidebarMenu className="bg-transparent space-y-2">
              {items.map((item) => (
                <SidebarMenuItem key={item.title} className="bg-transparent">
                  <SidebarMenuButton 
                    asChild 
                    className={`group relative overflow-hidden rounded-xl transition-all duration-300 ${
                      isActive(item.url) 
                        ? 'bg-gradient-to-r from-blue-600/20 to-purple-600/20 text-white border-l-4 border-blue-400 shadow-lg shadow-blue-500/20' 
                        : 'hover:bg-slate-700/50 text-gray-300 hover:text-white hover:translate-x-1'
                    }`}
                  >
                    <Link to={item.url} className="flex items-start space-x-3 py-3 px-4 min-h-[60px]">
                      <div className={`p-2 rounded-lg transition-all duration-300 flex-shrink-0 ${
                        isActive(item.url) 
                          ? 'bg-gradient-to-br from-blue-500 to-purple-500 text-white shadow-lg' 
                          : 'bg-slate-800/50 text-gray-400 group-hover:text-white group-hover:bg-slate-700'
                      }`}>
                        <item.icon className="w-5 h-5" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <span className="font-medium text-sm block truncate">{item.title}</span>
                        <p className="text-xs text-gray-400 group-hover:text-gray-300 transition-colors leading-tight">
                          {item.description}
                        </p>
                      </div>
                      {isActive(item.url) && (
                        <div className="absolute inset-0 bg-gradient-to-r from-blue-500/10 to-purple-500/10 rounded-xl" />
                      )}
                    </Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
            
            {/* User Role Badge */}
            <div className="mt-8 p-4 bg-slate-800/30 rounded-xl border border-slate-700/50">
              <div className="flex items-center space-x-3">
                <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-purple-500 rounded-full flex items-center justify-center">
                  <span className="text-white text-xs font-bold">
                    {userRole === 'teacher' ? 'T' : 'S'}
                  </span>
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-200 capitalize">{userRole}</p>
                  <p className="text-xs text-gray-400">
                    {userRole === 'teacher' ? 'Admin Access' : 'Student Portal'}
                  </p>
                </div>
              </div>
            </div>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
    </Sidebar>
  )
}