import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableFooter,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { useEffect, useState } from "react"
import { collection, query, where, onSnapshot } from "firebase/firestore";
import { db } from "../firebase";
import Layout from "./layout";
import useAppStore from "../Store";
import { Calendar, CheckCircle, XCircle, TrendingUp, User } from 'lucide-react';

export function TypographyH2({children}) {
  return (
    <h2 className="scroll-m-20 pb-2 text-3xl font-semibold tracking-tight first:mt-0 w-auto">
      {children}
    </h2>
  )
}

export default function StudentAttendancePage() {
  const [attendanceData, setAttendanceData] = useState([]);
  const [studentInfo, setStudentInfo] = useState(null);
  const { userId } = useAppStore();

  useEffect(() => {
    if (!userId) return;

    const q = query(collection(db, "user"), where("uid", "==", userId));
    const unsubscribe = onSnapshot(q, (querySnapshot) => {
      if (!querySnapshot.empty) {
        const studentDoc = querySnapshot.docs[0];
        const studentData = studentDoc.data();
        setStudentInfo(studentData);
        
        if (studentData.attendance) {
          // Add today's attendance if not marked (auto-absent after 12am)
          const today = new Date().toISOString().split('T')[0];
          const updatedAttendance = { ...studentData.attendance };
          
          // Only add auto-absent if teacher hasn't marked today
          if (!updatedAttendance[today]) {
            updatedAttendance[today] = "Absent";
          }
          
          const attendanceEntries = Object.entries(updatedAttendance).map(([date, status]) => ({
            date,
            status,
            formattedDate: new Date(date).toLocaleDateString("en-US", {
              day: "numeric",
              month: "long",
              year: "numeric"
            })
          })).sort((a, b) => new Date(b.date) - new Date(a.date));
          
          setAttendanceData(attendanceEntries);
        } else {
          // If no attendance data, add today's as absent
          const today = new Date().toISOString().split('T')[0];
          const attendanceEntries = [{
            date: today,
            status: "Absent",
            formattedDate: new Date(today).toLocaleDateString("en-US", {
              day: "numeric",
              month: "long",
              year: "numeric"
            })
          }];
          setAttendanceData(attendanceEntries);
        }
      }
    });

    return () => unsubscribe();
  }, [userId]);

  const calculateAttendanceStats = () => {
    const totalDays = attendanceData.length;
    const presentDays = attendanceData.filter(entry => entry.status === "Present").length;
    const absentDays = attendanceData.filter(entry => entry.status === "Absent").length;
    const attendancePercentage = totalDays > 0 ? Math.round((presentDays / totalDays) * 100) : 0;

    return { totalDays, presentDays, absentDays, attendancePercentage };
  };

  const stats = calculateAttendanceStats();

  if (!studentInfo) {
    return (
      <Layout>
        <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 flex items-center justify-center">
          <div className="text-center">
            <div className="w-16 h-16 border-4 border-blue-200 border-t-blue-600 rounded-full animate-spin mx-auto mb-4"></div>
            <p className="text-slate-600 text-lg">Loading your attendance...</p>
          </div>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-gray-900 to-slate-800 p-6">
        <div className="max-w-7xl mx-auto">
          {/* Header */}
          <div className="mb-10">
            <h1 className="text-5xl font-bold bg-gradient-to-r from-blue-400 via-purple-400 to-pink-400 bg-clip-text text-transparent mb-3">
              My Attendance
            </h1>
            <p className="text-gray-400 text-xl">Track your academic journey with detailed attendance insights</p>
            <div className="flex items-center space-x-2 text-sm text-slate-500">
              <Calendar className="w-4 h-4" />
              <span>{new Date().toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}</span>
            </div>
          </div>

          {/* Stats Cards */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-10">
            <div className="bg-gradient-to-br from-gray-800 to-gray-900 rounded-2xl shadow-xl p-6 border border-gray-700 hover:border-gray-600 transition-all duration-300">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-400 mb-1">Total Days</p>
                  <p className="text-4xl font-bold text-gray-100">{stats.totalDays}</p>
                </div>
                <div className="h-14 w-14 bg-gradient-to-br from-blue-900 to-blue-800 rounded-2xl flex items-center justify-center shadow-lg">
                  <Calendar className="h-7 w-7 text-blue-300" />
                </div>
              </div>
            </div>

            <div className="bg-gradient-to-br from-gray-800 to-gray-900 rounded-2xl shadow-xl p-6 border border-gray-700 hover:border-gray-600 transition-all duration-300">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-400 mb-1">Present Days</p>
                  <p className="text-4xl font-bold text-green-400">{stats.presentDays}</p>
                </div>
                <div className="h-14 w-14 bg-gradient-to-br from-green-900 to-green-800 rounded-2xl flex items-center justify-center shadow-lg">
                  <CheckCircle className="h-7 w-7 text-green-300" />
                </div>
              </div>
            </div>

            <div className="bg-gradient-to-br from-gray-800 to-gray-900 rounded-2xl shadow-xl p-6 border border-gray-700 hover:border-gray-600 transition-all duration-300">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-400 mb-1">Absent Days</p>
                  <p className="text-4xl font-bold text-red-400">{stats.absentDays}</p>
                </div>
                <div className="h-14 w-14 bg-gradient-to-br from-red-900 to-red-800 rounded-2xl flex items-center justify-center shadow-lg">
                  <XCircle className="h-7 w-7 text-red-300" />
                </div>
              </div>
            </div>

            <div className="bg-gradient-to-br from-gray-800 to-gray-900 rounded-2xl shadow-xl p-6 border border-gray-700 hover:border-gray-600 transition-all duration-300">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-400 mb-1">Attendance Rate</p>
                  <p className="text-4xl font-bold text-purple-400">{stats.attendancePercentage}%</p>
                </div>
                <div className="h-14 w-14 bg-gradient-to-br from-purple-900 to-purple-800 rounded-2xl flex items-center justify-center shadow-lg">
                  <TrendingUp className="h-7 w-7 text-purple-300" />
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Student Profile Card */}
        <div className="bg-gray-800 rounded-2xl shadow-lg p-6 mb-8 border border-gray-700">
          <div className="flex items-center space-x-4">
            <div className="h-16 w-16 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full flex items-center justify-center text-white font-bold text-xl">
              {studentInfo.name?.charAt(0).toUpperCase()}
            </div>
            <div>
              <h2 className="text-xl font-semibold text-gray-100">{studentInfo.name}</h2>
              <p className="text-gray-400">{studentInfo.email}</p>
              <p className="text-sm text-gray-500 mt-1">Student ID: {studentInfo.id || 'N/A'}</p>
            </div>
          </div>
        </div>

        {/* Attendance List */}
        <div className="bg-gray-800 rounded-2xl shadow-lg border border-gray-700 overflow-hidden">
          <div className="px-6 py-4 border-b border-gray-700">
            <h3 className="text-lg font-semibold text-gray-100">Attendance Record</h3>
            <p className="text-sm text-gray-400 mt-1">Your daily attendance status</p>
          </div>
          
          {attendanceData.length > 0 ? (
            <div className="divide-y divide-gray-700">
              {attendanceData.map((entry, index) => (
                <div key={entry.date} className="px-6 py-4 flex items-center justify-between hover:bg-gray-700/30 transition-colors">
                  <div className="flex items-center space-x-4">
                    <div className="h-10 w-10 bg-gray-700 rounded-full flex items-center justify-center">
                      <span className="text-sm font-bold text-gray-300">{index + 1}</span>
                    </div>
                    <div>
                      <p className="font-medium text-gray-100">{entry.formattedDate}</p>
                      <p className="text-sm text-gray-400">{entry.date}</p>
                    </div>
                  </div>
                  <div className={`px-3 py-1 rounded-full text-sm font-semibold ${
                    entry.status === 'Present' 
                      ? 'bg-green-900/50 text-green-400 border border-green-700' 
                      : entry.status === 'Absent'
                      ? 'bg-red-900/50 text-red-400 border border-red-700'
                      : 'bg-yellow-900/50 text-yellow-400 border border-yellow-700'
                  }`}>
                    {entry.status}
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="px-6 py-8 text-center">
              <Calendar className="w-12 h-12 text-gray-500 mx-auto mb-4" />
              <p className="text-gray-400">No attendance records found</p>
              <p className="text-sm text-gray-500 mt-2">Your attendance will appear here once marked by your teacher</p>
            </div>
          )}
        </div>
      </div>
    </Layout>
  )
}
