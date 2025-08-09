import { collection, onSnapshot, query, where } from "firebase/firestore";
import { db } from "../firebase";
import { useEffect, useState } from "react";
import Layout from "./layout";
import { Users, Calendar, CheckCircle, XCircle, Clock, AlertCircle, TrendingUp } from "lucide-react";
import useAppStore from "../Store";
import { getTodayAttendanceDateString } from "../utils/dateUtils";
// import { debugAllStudentsAttendance } from "../utils/attendanceDebug";



export default function Dashboard() {
  const [myPresentCount, setMyPresentCount] = useState(0);
  const [myAbsentCount, setMyAbsentCount] = useState(0);
  const [myAttendanceRate, setMyAttendanceRate] = useState(0);
  const [myTotalDays, setMyTotalDays] = useState(0);
  const [studentsCount, setStudentsCount] = useState(0);
  const [presentCount, setPresentCount] = useState(0);
  const [absentCount, setAbsentCount] = useState(0);
  const [totalAttendance, setTotalAttendance] = useState(0);

  const { userId, userRole } = useAppStore();

  useEffect(() => {
    console.log("=== Dashboard Debug: Initial State ===");
    console.log("User role:", userRole);
    console.log("User ID:", userId);
    console.log("User ID is empty:", !userId || userId === "");
    
    if (!userId || userId === "") {
      console.log("No userId found - dashboard will remain empty. Please ensure user is logged in.");
      return;
    }

    if (userRole === 'student') {
      // Listen to only the logged-in student's data
      // Query by email field - using userId which appears to be the email
      if (!userId) {
        console.log("No user ID found - cannot fetch student data");
        return;
      }
      
      const unsubscribeStudent = onSnapshot(
        query(collection(db, "user"), where("uid", "==", userId)),
        (querySnapshot) => {
          console.log("Query result:", querySnapshot.size, "documents found");
          if (querySnapshot.empty) {
            console.log("No student found with UID:", userId);
            console.log("Note: Existing users may need to have their documents updated with uid field");
            return;
          }
          const student = querySnapshot.docs[0].data();
          console.log("Student document found:", querySnapshot.docs[0].id);
          console.log("Student data:", student);
          console.log("Student attendance:", student.attendance);
          
          // Calculate monthly attendance for this student
          const attendance = student.attendance || {};
          if (Object.keys(attendance).length === 0) {
            console.log("No attendance data found for student");
            setMyPresentCount(0);
            setMyAbsentCount(0);
            setMyTotalDays(0);
            setMyAttendanceRate(0);
            return;
          }
          
          const currentDate = new Date();
          const currentMonth = currentDate.getMonth();
          const currentYear = currentDate.getFullYear();
          
          console.log("=== Dashboard Debug ===");
          console.log("Student attendance data:", attendance);
          console.log("Current month:", currentMonth, "Year:", currentYear);
          
          // Parse dates using the same format as other components
          const monthlyAttendance = Object.entries(attendance).filter(([date, status]) => {
            try {
              // All components use formatDate() which produces "8 August 2025"
              const attendanceDate = new Date(date);
              const isCurrentMonth = attendanceDate.getMonth() === currentMonth && attendanceDate.getFullYear() === currentYear;
              console.log("Date:", date, "Status:", status, "-> Month:", attendanceDate.getMonth(), "Year:", attendanceDate.getFullYear(), "Match:", isCurrentMonth);
              return isCurrentMonth;
            } catch (error) {
              console.log("Failed to parse date:", date, "Error:", error);
              return false;
            }
          });
          
          console.log("Monthly attendance filtered:", monthlyAttendance);
          const presentDays = monthlyAttendance.filter(([, status]) => status === "Present").length;
          const absentDays = monthlyAttendance.filter(([, status]) => status === "Absent").length;
          const totalDays = monthlyAttendance.length;
          console.log("Stats -> Present:", presentDays, "Absent:", absentDays, "Total:", totalDays);
          
          setMyPresentCount(presentDays);
          setMyAbsentCount(absentDays);
          setMyTotalDays(totalDays);
          setMyAttendanceRate(totalDays > 0 ? Math.round((presentDays / totalDays) * 100) : 0);
        });
      return () => unsubscribeStudent();
    } else {
      // Teacher view - show class-wide statistics
      const unsubscribeTeacher = onSnapshot(
        query(collection(db, "user"), where("role", "==", "student")),
        (snapshot) => {
          const students = snapshot.docs.map(doc => doc.data());
          const totalStudents = students.length;
          
          // Calculate today's attendance
          const today = getTodayAttendanceDateString();
          let presentToday = 0;
          let absentToday = 0;
          console.log(today)
          students.forEach(student => {
            const attendance = student.attendance || {};
            if (attendance[today] === "Present") {
              presentToday++;
            } else if (attendance[today] === "Absent") {
              absentToday++;
            }
          });
          
          setStudentsCount(totalStudents);
          setPresentCount(presentToday);
          setAbsentCount(absentToday);
          setTotalAttendance(totalStudents > 0 ? Math.round(((presentToday + absentToday) / totalStudents) * 100) : 0);
        });
      return () => unsubscribeTeacher();
    }
  }, [userId, userRole]);

  const stats = userRole === 'student' ? [
    {
      title: "This Month",
      value: myTotalDays,
      icon: Calendar,
      color: "blue",
      bgColor: "bg-blue-900",
      textColor: "text-blue-400",
      borderColor: "border-blue-700"
    },
    {
      title: "Present Days",
      value: myPresentCount,
      icon: CheckCircle,
      color: "green",
      bgColor: "bg-green-900",
      textColor: "text-green-400",
      borderColor: "border-green-700"
    },
    {
      title: "Absent Days",
      value: myAbsentCount,
      icon: XCircle,
      color: "red",
      bgColor: "bg-red-900",
      textColor: "text-red-400",
      borderColor: "border-red-700"
    },
    {
      title: "Monthly Rate",
      value: `${myAttendanceRate}%`,
      icon: TrendingUp,
      color: "purple",
      bgColor: "bg-purple-900",
      textColor: "text-purple-400",
      borderColor: "border-purple-700"
    }
  ] : [
    {
      title: "Total Students",
      value: studentsCount,
      icon: Users,
      color: "blue",
      bgColor: "bg-blue-900",
      textColor: "text-blue-400",
      borderColor: "border-blue-700"
    },
    {
      title: "Present Today",
      value: presentCount,
      icon: CheckCircle,
      color: "green",
      bgColor: "bg-green-900",
      textColor: "text-green-400",
      borderColor: "border-green-700"
    },
    {
      title: "Absent Today",
      value: absentCount,
      icon: XCircle,
      color: "red",
      bgColor: "bg-red-900",
      textColor: "text-red-400",
      borderColor: "border-red-700"
    },
    {
      title: "Attendance Rate",
      value: `${totalAttendance}%`,
      icon: TrendingUp,
      color: "purple",
      bgColor: "bg-purple-900",
      textColor: "text-purple-400",
      borderColor: "border-purple-700"
    }
  ];
  return (
    <Layout>
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-gray-900 to-slate-800 p-6">
        {/* Header */}
        <div className="mb-8">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div>
              <h1 className="text-3xl sm:text-4xl font-bold bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
                Dashboard
              </h1>
              <div className="flex flex-col sm:flex-row sm:items-center gap-2 mt-2">
                <p className="text-gray-400 text-base sm:text-lg">
                  Welcome back! Here's your attendance overview
                </p>
                <span className="px-3 py-1 bg-blue-900/50 text-blue-400 rounded-full text-sm whitespace-nowrap">
                  Role: {userRole || 'Unknown'}
                </span>
              </div>
            </div>
            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-2 text-sm text-gray-400">
                <Calendar className="w-4 h-4" />
                <span className="whitespace-nowrap">{getTodayAttendanceDateString()}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {stats.map((stat, index) => (
            <div
              key={index}
              className={`${stat.bgColor} ${stat.borderColor} border rounded-2xl p-6 shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105`}
            >
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-400 mb-1">{stat.title}</p>
                  <p className={`text-3xl font-bold ${stat.textColor}`}>{stat.value}</p>
                </div>
                <div className={`p-3 rounded-xl ${stat.bgColor} border ${stat.borderColor}`}>
                  <stat.icon className={`w-6 h-6 ${stat.textColor}`} />
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Quick Actions - Only show for non-students */}
        {userRole !== 'student' && (
          <div className="bg-gray-800 rounded-2xl shadow-xl border border-gray-700 p-6">
            <h2 className="text-xl font-semibold text-gray-100 mb-4">Quick Actions</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="text-center p-4 bg-blue-900 rounded-xl border border-blue-700">
                <Users className="w-8 h-8 text-blue-400 mx-auto mb-2" />
                <h3 className="font-semibold text-blue-200">Manage Students</h3>
                <p className="text-sm text-blue-400 mt-1">View and manage all student records</p>
              </div>
              <div className="text-center p-4 bg-green-900 rounded-xl border border-green-700">
                <CheckCircle className="w-8 h-8 text-green-400 mx-auto mb-2" />
                <h3 className="font-semibold text-green-200">Mark Attendance</h3>
                <p className="text-sm text-green-400 mt-1">Record today's attendance</p>
              </div>
              <div className="text-center p-4 bg-purple-900 rounded-xl border border-purple-700">
                <TrendingUp className="w-8 h-8 text-purple-400 mx-auto mb-2" />
                <h3 className="font-semibold text-purple-200">View Reports</h3>
                <p className="text-sm text-purple-400 mt-1">Detailed attendance analytics</p>
              </div>
            </div>
          </div>
        )}
      </div>
    </Layout>
  );
}
