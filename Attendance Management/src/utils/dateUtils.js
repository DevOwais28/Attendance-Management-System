/**
 * Centralized date utility for consistent date formatting across the application
 * This ensures all components use the same date format for attendance records
 */

/**
 * Returns a consistent date string format for attendance records
 * Format: "2025-08-09" (ISO format YYYY-MM-DD)
 * @param {Date} date - The date to format. Defaults to current date if not provided.
 * @returns {string} Formatted date string
 */
export const getAttendanceDateString = (date = new Date()) => {
  return date.toISOString().split('T')[0];
};

/**
 * Gets all possible date string variations for a given date
 * Useful for debugging date format mismatches
 * @param {Date} date - The date to get variations for
 * @returns {Object} Object containing different date string formats
 */
export const getDateVariations = (date = new Date()) => {
  return {
    iso: getAttendanceDateString(date),
    locale: date.toLocaleDateString(),
    utc: date.toUTCString().split(' ').slice(0, 4).join(' '),
    timestamp: date.getTime()
  };
};

/**
 * Parses a date string back to a Date object
 * @param {string} dateString - The date string in format "2025-08-09"
 * @returns {Date} Parsed date object
 */
export const parseAttendanceDateString = (dateString) => {
  return new Date(dateString);
};

/**
 * Validates if a date string matches the expected format
 * @param {string} dateString - The date string to validate
 * @returns {boolean} True if valid format
 */
export const isValidAttendanceDateString = (dateString) => {
  const date = new Date(dateString);
  const formatted = getAttendanceDateString(date);
  return formatted === dateString && !isNaN(date.getTime());
};

/**
 * Finds attendance status by matching dates flexibly
 * Handles both formatted date strings and full Date strings from database
 * @param {Object} attendance - The attendance object from database
 * @param {Date|string} targetDate - The date to check (Date object or date string in YYYY-MM-DD format)
 * @returns {string} Attendance status (Present, Absent, NOT_MARKED)
 */
export const findAttendanceStatus = (attendance, targetDate) => {
  if (!attendance) return 'NOT_MARKED';
  
  // Handle both Date objects and date strings
  let targetDateString;
  if (typeof targetDate === 'string') {
    targetDateString = targetDate; // Already in YYYY-MM-DD format
  } else if (targetDate instanceof Date) {
    // Use local date to avoid timezone issues
    const year = targetDate.getFullYear();
    const month = String(targetDate.getMonth() + 1).padStart(2, '0');
    const day = String(targetDate.getDate()).padStart(2, '0');
    targetDateString = `${year}-${month}-${day}`;
  } else {
    return 'NOT_MARKED';
  }
  
  return attendance[targetDateString] || 'NOT_MARKED';
};

/**
 * Finds attendance status and actual date from the database
 * Returns both the status and the actual date key from the attendance object
 * @param {Object} attendance - The attendance object from database
 * @param {Date|string} targetDate - The date to check (Date object or date string in YYYY-MM-DD format)
 * @returns {Object} Object with status and actual date
 */
export const findAttendanceStatusWithDate = (attendance, targetDate) => {
  if (!attendance) return { status: 'NOT_MARKED', date: null };
  
  // Handle both Date objects and date strings
  let targetDateString;
  if (typeof targetDate === 'string') {
    targetDateString = targetDate; // Already in YYYY-MM-DD format
  } else if (targetDate instanceof Date) {
    // Use local date to avoid timezone issues
    const year = targetDate.getFullYear();
    const month = String(targetDate.getMonth() + 1).padStart(2, '0');
    const day = String(targetDate.getDate()).padStart(2, '0');
    targetDateString = `${year}-${month}-${day}`;
  } else {
    return { status: 'NOT_MARKED', date: null };
  }
  
  if (attendance[targetDateString]) {
    return { 
      status: attendance[targetDateString], 
      date: targetDateString 
    };
  }
  
  return { status: 'NOT_MARKED', date: null };
};

/**
 * Gets today's attendance status for a student
 * @param {Object} attendance - The attendance object from database
 * @returns {string} Attendance status
 */
export const getTodayAttendanceStatus = (attendance) => {
  return findAttendanceStatus(attendance, new Date());
};

/**
 * Gets today's date string for attendance
 * @returns {string} Today's date in attendance format
 */
export const getTodayAttendanceDateString = () => {
  return getAttendanceDateString(new Date());
};
