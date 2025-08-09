/**
 * Test utility to verify attendance status is correctly displayed
 * This helps verify the date format fix is working correctly
 */

import { findAttendanceStatus } from "./dateUtils";

/**
 * Test the attendance status lookup with sample data
 * @param {Object} sampleAttendance - Sample attendance object from database
 * @param {string} studentName - Name of student for logging
 */
export const testAttendanceStatus = (sampleAttendance, studentName) => {
  console.log(`=== Testing attendance status for ${studentName} ===`);
  console.log("Attendance data:", sampleAttendance);
  
  const today = new Date();
  const status = findAttendanceStatus(sampleAttendance, today);
  
  console.log(`Today's date: ${today.toDateString()}`);
  console.log(`Found status: ${status}`);
  console.log("=== End test ===\n");
  
  return status;
};

/**
 * Sample test cases for different date formats
 */
export const runAttendanceTests = () => {
  console.log("Running attendance status tests...\n");
  
  // Test case 1: Full Date string format (like in database)
  const testCase1 = {
    "Fri Aug 08 2025 06:38:10 GMT+0500 (Pakistan Standard Time)": "Present"
  };
  testAttendanceStatus(testCase1, "Owais Ahmed (full date string)");
  
  // Test case 2: Formatted date string (old format)
  const testCase2 = {
    "August 8, 2025": "Present"
  };
  testAttendanceStatus(testCase2, "Test Student (formatted date)");
  
  // Test case 3: Multiple entries
  const testCase3 = {
    "Fri Aug 08 2025 06:38:10 GMT+0500 (Pakistan Standard Time)": "Present",
    "Thu Aug 07 2025 08:15:30 GMT+0500 (Pakistan Standard Time)": "Absent"
  };
  testAttendanceStatus(testCase3, "Multi-day Student");
  
  // Test case 4: Empty attendance
  const testCase4 = {};
  testAttendanceStatus(testCase4, "No attendance");
  
  console.log("All tests completed!");
};

// Run tests if this file is imported
// runAttendanceTests();
