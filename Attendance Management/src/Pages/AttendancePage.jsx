import {
  Table,
  TableBody,
  TableFooter,
  TableHead,
  TableHeader,
  TableRow,
  TableCell,
  TableCaption
} from "@/components/ui/table"
import { useEffect } from "react"
import { collection, query, where, doc, getDoc, updateDoc, onSnapshot } from "firebase/firestore";
import { useState } from "react";
import { db } from "../firebase";
import Layout from "./layout";
import { Button } from "@/components/ui/button"
import { Datepicker } from "../components/Datepicker";
import { Calendar, Users } from 'lucide-react';
import { findAttendanceStatus } from "../utils/dateUtils";
export function TypographyH2({children}) {
  return (
    <h2 className="scroll-m-20  pb-2 text-3xl font-semibold tracking-tight first:mt-0 w-auto">
      {children}
    </h2>
  )
}


export default function AttendancePage() {
  const [Studentsdata, setStudentsdata] = useState([]);
  const [date] = useState(new Date().toISOString().split('T')[0]); // Fixed to today's date

  useEffect(() => {
    const q = query(collection(db, "user"), where("role", "==", "student"));
    const unsubscribe = onSnapshot(q, (querySnapshot) => {
      const list = querySnapshot.docs.map((doc) => ({
        ...doc.data(),
        id: doc.id,
      }));
      setStudentsdata(list);
    });

    return () => unsubscribe();
  }, []);

  
 async function markAttendance(studentId, status) {
    try {
      const studentRef = doc(db, "user", studentId);
      console.log("Marking attendance:", { studentId, date, status });
      
      await updateDoc(studentRef, {
        [`attendance.${date}`]: status // Nested field update
      });

      console.log(`Successfully marked ${status} for ${studentId} on ${date}`);
      
      // Verify the update by reading back
      const docSnap = await getDoc(studentRef);
      console.log("Updated attendance data:", docSnap.data()?.attendance);
    } catch (error) {
      console.error("Error updating attendance:", error);
    }
  }

 

  return (
    <Layout>
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-gray-900 to-slate-800 p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-5xl font-bold bg-gradient-to-r from-blue-400 via-purple-400 to-pink-400 bg-clip-text text-transparent mb-3">
            Attendance Portal
          </h1>
          <p className="text-gray-400 text-xl mb-4">Mark daily attendance for your students</p>
          
          <div className="flex items-center justify-center space-x-2 text-gray-300">
            <Calendar className="w-5 h-5" />
            <span className="font-medium">
              {new Date(date).toLocaleDateString('en-US', { 
                weekday: 'long', 
                year: 'numeric', 
                month: 'long', 
                day: 'numeric' 
              })}
            </span>
          </div>
          
          <div className="mt-2 flex items-center justify-center space-x-1 text-sm text-gray-500">
            <Users className="w-4 h-4" />
            <span>{Studentsdata.length} Students</span>
          </div>
        </div>

        {/* Date Section */}
        <div className="bg-gradient-to-br from-gray-800 to-gray-900 rounded-2xl shadow-xl border border-gray-700 mb-8">
          <div className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-2xl font-semibold text-gray-100 mb-2">Current Date</h2>
                <p className="text-gray-400 text-lg">{date instanceof Date ? date.toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' }) : 'Loading...'}</p>
              </div>
              <div className="bg-gray-800 rounded-xl p-3 border border-gray-600">
                <Datepicker value={date} isdisabled={true} />
              </div>
            </div>
          </div>
        </div>

        {/* Students Table */}
        <div className="bg-gray-800 rounded-2xl shadow-lg border border-gray-700 overflow-hidden">
          <Table>
            <TableHeader className="bg-gray-900">
              <TableRow>
                <TableHead className="px-6 py-4 text-left text-sm font-semibold text-gray-300">Student ID</TableHead>
                <TableHead className="px-6 py-4 text-left text-sm font-semibold text-gray-300">Name</TableHead>
                <TableHead className="px-6 py-4 text-left text-sm font-semibold text-gray-300">Email</TableHead>
                <TableHead className="px-6 py-4 text-left text-sm font-semibold text-gray-300">Status</TableHead>
                <TableHead className="px-6 py-4 text-left text-sm font-semibold text-gray-300">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody className="divide-y divide-gray-700">
              {Studentsdata.length > 0 ? (
                Studentsdata.map((data) => (
                  <TableRow key={data.id} className="hover:bg-gray-700 transition-colors">
                    <TableCell className="px-6 py-4 text-sm text-gray-100 font-mono">{data.id.substring(0, 8)}...</TableCell>
                    <TableCell className="px-6 py-4 text-sm text-gray-100 font-medium">{data.name}</TableCell>
                    <TableCell className="px-6 py-4 text-sm text-gray-400">{data.email}</TableCell>
                    <TableCell className="px-6 py-4">
                      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold ${
                        findAttendanceStatus(data.attendance, new Date(date)) === 'Present' 
                          ? 'bg-green-900 text-green-300 ring-1 ring-green-800' 
                          : 'bg-red-900 text-red-300 ring-1 ring-red-800'
                      }`}>
                        {findAttendanceStatus(data.attendance, new Date(date))}
                      </span>
                    </TableCell>
                    <TableCell className="px-6 py-4">
                      <div className="flex gap-2">
                        <Button 
                          variant="default" 
                          size="sm"
                          onClick={() => markAttendance(data.id, 'Present')}
                          disabled={findAttendanceStatus(data.attendance, new Date(date)) === 'Present'}
                          className="bg-green-600 hover:bg-green-700 disabled:bg-green-800 disabled:cursor-not-allowed transition-colors"
                        >
                          Present
                        </Button>
                        <Button 
                          variant="destructive" 
                          size="sm"
                          onClick={() => markAttendance(data.id, 'Absent')}
                          disabled={findAttendanceStatus(data.attendance, new Date(date)) === 'Absent'}
                          className="bg-red-600 hover:bg-red-700 disabled:bg-red-800 disabled:cursor-not-allowed transition-colors"
                        >
                          Absent
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell colSpan={5} className="text-center py-12">
                    <div className="flex flex-col items-center">
                      <Users className="w-12 h-12 text-gray-500 mb-4" />
                      <p className="text-gray-400 text-lg">No students found</p>
                      <p className="text-gray-500 text-sm mt-2">Add students to start marking attendance</p>
                    </div>
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </div>
        </div>
      </div>
    {/* </div> */}
    </Layout>
  )
}
