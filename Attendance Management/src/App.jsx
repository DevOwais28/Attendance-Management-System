
import Layout from './Pages/layout'
import { AppSidebar } from './Pages/app-sidebar'
import StudentsAttendancePage from './Pages/StudentsAttendancePage'
import { ThemeProvider } from "@/components/theme-provider"
const App = () => {
  return (
  <>  
  {/* <ThemeProvider defaultTheme="dark" storageKey="vite-ui-theme"> */}
   <StudentsAttendancePage />     

   
  </>

  )
}

export default App