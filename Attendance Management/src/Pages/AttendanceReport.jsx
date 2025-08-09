import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { useEffect } from "react"
import { collection, query, where, onSnapshot} from "firebase/firestore";
import { useState } from "react";
import { db } from "../firebase";
import Layout from "./layout";
import { Datepicker } from "../components/Datepicker";
import { Users, CheckCircle, XCircle, Calendar } from 'lucide-react';
import { findAttendanceStatusWithDate } from "../utils/dateUtils";
import useAppStore from "../Store";
export function TypographyH2({children}) {
  return (
    <h2 className="scroll-m-20  pb-2 text-3xl font-semibold tracking-tight first:mt-0 w-auto">
      {children}
    </h2>
  )
}

const formatDate = (dateString) => {
  return new Date(dateString).toLocaleDateString('en-US', {
    weekday: 'short',
    year: 'numeric',
    month: 'short',
    day: 'numeric'
  });
};


export default function AttendanceReport() {
  // const [studentsData, setStudentsData] = useState([])
  const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split('T')[0]);
  const [students, setStudents] = useState([]);
  const [filteredStudents, setFilteredStudents] = useState([]);
  const [totalPresent, setTotalPresent] = useState(0)
  const [totalAbsent, setTotalAbsent] = useState(0)
  const [userRole, setUserRole] = useState('')
  const [minDate, setMinDate] = useState(null)
  let [count, setCount] = useState(0)

  useEffect(() => {
    const userId = useAppStore.getState().userId;
    const userRole = useAppStore.getState().userRole;

    setUserRole(userRole);
    
    if (!userId) return;
    

    // Set minimum date for students (account creation date - August 8, 2025)
    if (userRole === 'student' || userRole === 'teacher') {
      setMinDate('2025-08-08');
      // Ensure selected date is not before min date
      if (selectedDate < '2025-08-08') {
        setSelectedDate('2025-08-08');
      }
    }
    
    let unsubscribe;

    if (userRole === 'student') {
      // Students see only their own data from user collection
      unsubscribe = onSnapshot(
        query(collection(db, "user"), where("uid", "==", userId)),
        (snapshot) => {
          const studentsData = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
          setStudents(studentsData);
          setCount(count++)
        }
      );
    } else {
      // Teachers/admins see all students
      unsubscribe = onSnapshot(
        query(collection(db, "user"), where("role", "==", "student")),
        (snapshot) => {
          const studentsData = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
          setStudents(studentsData);
          setCount(count++)
        }
      );
    }

    return () => unsubscribe();
  }, []);

  // console.log(students)

  useEffect(() => {
    console.log('Selected date changed to:', selectedDate);
    
    // Show all students with their actual attendance status and date from database
    const studentsWithStatus = students.map(student => {
      const { status, date } = findAttendanceStatusWithDate(student.attendance, selectedDate);
      console.log(`Student ${student.name} (${student.id}):`, {
        selectedDate,
        attendanceData: student.attendance,
        foundStatus: status,
        foundDate: date
      });
      return {
        ...student,
        status,
        date: date || selectedDate // Use actual date from DB if available, otherwise selected date
      };
    });
    
    setFilteredStudents(studentsWithStatus);
  }, [students, selectedDate]);

  useEffect(() => {
    if (userRole === 'student') {
      // For students: calculate lifetime attendance from account creation to today
      const accountCreationDate = '2025-08-08'
      const today = new Date().toISOString().split('T')[0]
      
      // For students, we need to extract attendance from their attendance array
      if (students.length > 0 && students[0].attendance) {
        const student = students[0]; // Students see only their own data
        const attendanceData = student.attendance || {};
        
        let present = 0;
        let absent = 0;
        
        // Handle both object and array formats
        let attendanceRecords = [];
        
        if (Array.isArray(attendanceData)) {
          attendanceRecords = attendanceData;
        } else if (typeof attendanceData === 'object' && attendanceData !== null) {
          // Convert object format to array format
          attendanceRecords = Object.entries(attendanceData).map(([date, status]) => ({
            date,
            status
          }));
        }
        
        attendanceRecords.forEach(record => {
          if (record.date) {
            const recordDate = record.date;
            if (recordDate >= accountCreationDate && recordDate <= today) {
              if (record.status === 'Present') present++;
              else if (record.status === 'Absent') absent++;
            }
          }
        });
        
        console.log('Student lifetime attendance:', {
          studentName: student.name,
          totalRecords: attendanceRecords.length,
          validRecords: present + absent,
          present,
          absent,
          percentage: totalRecords > 0 ? Math.round((present / (present + absent)) * 100) : 0
        });
        
        setTotalPresent(present);
        setTotalAbsent(absent);
      } else {
        console.log('No attendance data found for student');
        setTotalPresent(0);
        setTotalAbsent(0);
      }
    } else {
      // For teachers: calculate stats for selected date only
      let present = 0
      let absent = 0
      
      // For teachers, we need to process all students and their attendance
      students.forEach(student => {
        if (student.attendance && Array.isArray(student.attendance)) {
          const record = student.attendance.find(att => att.date === selectedDate);
          if (record) {
            if (record.status === 'Present') present++;
            else if (record.status === 'Absent') absent++;
          }
        }
      });
      
      console.log('Teacher daily attendance:', {
        selectedDate,
        totalStudents: students.length,
        present,
        absent,
        percentage: students.length > 0 ? Math.round((present / (present + absent)) * 100) : 0
      });
      
      setTotalPresent(present);
      setTotalAbsent(absent);
    }
  }, [filteredStudents, userRole, students, selectedDate])
  const totalRecords = totalPresent + totalAbsent
  console.log(Math.round((totalPresent / totalRecords) * 100),totalRecords)

  return (
    <Layout>  
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-gray-900 to-slate-800 p-6">
        {/* Header */}
        <div className="mb-8">
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
            <div>
              <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
                {userRole === 'student' ? 'My Attendance' : 'Attendance Report'}
              </h1>
              <p className="text-gray-400 mt-1 sm:mt-2 text-sm sm:text-base lg:text-lg">
                {userRole === 'student' ? 'View your attendance records' : 'View attendance records for any date'}
              </p>
            </div>
            <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3 sm:gap-4">
              <Datepicker value={selectedDate} isdisabled={false} onChangeDate={setSelectedDate} minDate={userRole === 'student' ? minDate : undefined} />
              <div className="flex items-center space-x-2 text-sm text-gray-400">
                <Calendar className="w-4 h-4 flex-shrink-0" />
                <span className="whitespace-nowrap">{selectedDate}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Stats Cards */}
        {userRole !== 'student' && (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 mb-6 sm:mb-8">
            <div className="bg-gray-800 rounded-xl sm:rounded-2xl shadow-lg p-4 sm:p-6 border border-gray-700">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-xs sm:text-sm font-medium text-gray-400">Total Students</p>
                  <p className="text-2xl sm:text-3xl font-bold text-white">{students.length}</p>
                </div>
                <div className="h-10 w-10 sm:h-12 sm:w-12 bg-blue-900 rounded-lg sm:rounded-xl flex items-center justify-center flex-shrink-0">
                  <Users className="h-5 w-5 sm:h-6 sm:w-6 text-blue-400" />
                </div>
              </div>
            </div>

            <div className="bg-gray-800 rounded-xl sm:rounded-2xl shadow-lg p-4 sm:p-6 border border-gray-700">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-xs sm:text-sm font-medium text-gray-400">Present Today</p>
                  <p className="text-2xl sm:text-3xl font-bold text-green-400">{totalPresent}</p>
                </div>
                <div className="h-10 w-10 sm:h-12 sm:w-12 bg-green-900 rounded-lg sm:rounded-xl flex items-center justify-center flex-shrink-0">
                  <CheckCircle className="h-5 w-5 sm:h-6 sm:w-6 text-green-400" />
                </div>
              </div>
            </div>

            <div className="bg-gray-800 rounded-xl sm:rounded-2xl shadow-lg p-4 sm:p-6 border border-gray-700">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-xs sm:text-sm font-medium text-gray-400">Absent Today</p>
                  <p className="text-2xl sm:text-3xl font-bold text-red-400">{totalAbsent}</p>
                </div>
                <div className="h-10 w-10 sm:h-12 sm:w-12 bg-red-900 rounded-lg sm:rounded-xl flex items-center justify-center flex-shrink-0">
                  <XCircle className="h-5 w-5 sm:h-6 sm:w-6 text-red-400" />
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Attendance Table */}
        <div className="bg-gray-800 rounded-xl sm:rounded-2xl shadow-xl border border-gray-700 overflow-hidden">
          <div className="px-4 sm:px-6 py-3 sm:py-4 border-b border-gray-700">
            <h2 className="text-lg sm:text-xl font-semibold text-gray-100">
              {userRole === 'student' ? 'Your Attendance' : 'Attendance Records'} for {selectedDate}
            </h2>
          </div>
          
          <div className="overflow-x-auto">
            <table className="w-full min-w-[600px]">
              <thead className="bg-gray-900">
                <tr>
                  <th className="px-4 sm:px-6 py-3 sm:py-4 text-left text-xs sm:text-sm font-semibold text-gray-300">Student ID</th>
                  <th className="px-4 sm:px-6 py-3 sm:py-4 text-left text-xs sm:text-sm font-semibold text-gray-300">Name</th>
                  <th className="px-4 sm:px-6 py-3 sm:py-4 text-left text-xs sm:text-sm font-semibold text-gray-300 hidden md:table-cell">Email</th>
                  <th className="px-4 sm:px-6 py-3 sm:py-4 text-left text-xs sm:text-sm font-semibold text-gray-300 hidden lg:table-cell">Date</th>
                  <th className="px-4 sm:px-6 py-3 sm:py-4 text-left text-xs sm:text-sm font-semibold text-gray-300">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-700">
                {filteredStudents.length > 0 ? (
                  filteredStudents.map((student) => (
                    <tr key={`${student.id}-${selectedDate}`} className="hover:bg-gray-700 transition-colors">
                      <td className="px-4 sm:px-6 py-3 sm:py-4 text-xs sm:text-sm text-gray-100 font-medium">{student.id}</td>
                      <td className="px-4 sm:px-6 py-3 sm:py-4 text-xs sm:text-sm text-gray-100">{student.name}</td>
                      <td className="px-4 sm:px-6 py-3 sm:py-4 text-xs sm:text-sm text-gray-400 hidden md:table-cell">{student.email}</td>
                      <td className="px-4 sm:px-6 py-3 sm:py-4 text-xs sm:text-sm text-gray-400 hidden lg:table-cell">
                        {student.date ? formatDate(student.date) : "—"}
                      </td>
                      <td className="px-4 sm:px-6 py-3 sm:py-4">
                        <span className={`inline-flex items-center px-2 sm:px-3 py-1 rounded-full text-xs font-semibold ${
                          student.status === 'Present' 
                            ? 'bg-green-900 text-green-300 ring-1 ring-green-800' 
                            : student.status === 'Absent' 
                            ? 'bg-red-900 text-red-300 ring-1 ring-red-800'
                            : 'bg-gray-800 text-gray-300 ring-1 ring-gray-700'
                        }`}>
                          {student.status === 'Present' ? (
                            <CheckCircle className="w-3 h-3 mr-1" />
                          ) : student.status === 'Absent' ? (
                            <XCircle className="w-3 h-3 mr-1" />
                          ) : (
                            <span className="w-3 h-3 mr-1 rounded-full bg-gray-500"></span>
                          )}
                          {student.status}
                        </span>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan={userRole === 'student' ? 3 : 5} className="px-4 sm:px-6 py-8 sm:py-12 text-center">
                      <div className="text-gray-400">
                        <Calendar className="w-10 h-10 sm:w-12 sm:h-12 mx-auto mb-3 sm:mb-4 text-gray-600" />
                        <p className="text-base sm:text-lg font-medium">
                          {userRole === 'student' ? 'No attendance records found' : 'No students found'}
                        </p>
                        <p className="text-xs sm:text-sm mt-1 sm:mt-2">
                          {userRole === 'student' 
                            ? 'No attendance has been recorded for you yet' 
                            : 'No students are registered in the system'}
                        </p>
                      </div>
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </Layout>
  ); 
}
