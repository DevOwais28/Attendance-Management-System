/**
 * Debugging utility for attendance data issues
 * Helps identify data inconsistencies between database and UI
 */

import { collection, query, where, getDocs } from "firebase/firestore";
import { db } from "../firebase";
import { getTodayAttendanceDateString } from "./dateUtils";

/**
 * Debug attendance data for a specific student
 * @param {string} email - Student's email address
 */
export const debugStudentAttendance = async (email) => {
  try {
    const today = getTodayAttendanceDateString();
    console.log("=== ATTENDANCE DEBUG INFO ===");
    console.log("Current date:", today);
    console.log("Searching for student:", email);
    
    const q = query(collection(db, "user"), where("email", "==", email));
    const querySnapshot = await getDocs(q);
    
    if (querySnapshot.empty) {
      console.log("❌ No student found with email:", email);
      return;
    }
    
    querySnapshot.forEach((doc) => {
      const student = doc.data();
      console.log("✅ Found student:", {
        name: student.name,
        email: student.email,
        role: student.role,
        id: doc.id
      });
      
      console.log("📊 Attendance data:", student.attendance || {});
      console.log("🎯 Today's attendance:", student.attendance?.[today] || "NOT MARKED");
      
      if (student.attendance) {
        console.log("📅 All attendance dates:", Object.keys(student.attendance));
        console.log("🔍 Exact date match:", today in student.attendance ? "✅ FOUND" : "❌ NOT FOUND");
      }
    });
    
  } catch (error) {
    console.error("Error debugging attendance:", error);
  }
};

/**
 * Debug all students' attendance for today
 */
export const debugAllStudentsAttendance = async () => {
  try {
    const today = getTodayAttendanceDateString();
    console.log("=== ALL STUDENTS ATTENDANCE DEBUG ===");
    console.log("Current date:", today);
    
    const q = query(collection(db, "user"), where("role", "==", "student"));
    const querySnapshot = await getDocs(q);
    
    console.log(`Found ${querySnapshot.size} students:`);
    
    querySnapshot.forEach((doc) => {
      const student = doc.data();
      console.log(`${student.name} (${student.email}):`, student.attendance?.[today] || "NOT MARKED");
    });
    
  } catch (error) {
    console.error("Error debugging all attendance:", error);
  }
};

/**
 * Force refresh attendance data by clearing and re-fetching
 */
export const forceRefreshAttendance = () => {
  console.log("🔄 Forcing attendance data refresh...");
  // This will trigger re-renders in components that use onSnapshot
  window.location.reload();
};
