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
import { useEffect } from "react"
import { collection, query, where, onSnapshot, doc, updateDoc, deleteDoc } from "firebase/firestore";
import { useState } from "react";
import { db } from "../firebase";
import Layout from "./layout";
import { UserInfo } from "../components/UserInfo";
import { DeleteIcon, Edit3Icon } from "lucide-react";
import { Users, User, CheckCircle } from "lucide-react";

export default function StudentsAttendancePage() {
  const [Studentsdata, setStudentsdata] = useState([])
  const [editingStudent, setEditingStudent] = useState(null)
  const [showEditModal, setShowEditModal] = useState(false)
  const [showDeleteModal, setShowDeleteModal] = useState(false)
  const [studentToDelete, setStudentToDelete] = useState(null)
  const [editForm, setEditForm] = useState({ name: '', email: '' })
  const [toast, setToast] = useState({ show: false, message: '', type: 'error' })

  useEffect(() => {
    const q = query(collection(db, "user"), where("role", "==", "student"));
    const unsubscribe = onSnapshot(q, (querySnapshot) => {
      const list = querySnapshot.docs.map((doc) => ({
        ...doc.data(),
        id: doc.id,
      }));
      setStudentsdata(list);
    });

    return () => unsubscribe(); // ✅ Cleanup listener
  }, []);

  const handleEdit = (student) => {
    setEditingStudent(student)
    setEditForm({ name: student.name, email: student.email })
    setShowEditModal(true)
  }

  const showToastMessage = (message, type = 'error') => {
    setToast({ show: true, message, type })
    setTimeout(() => {
      setToast({ show: false, message: '', type: 'error' })
    }, 3000)
  }

  const handleUpdate = async () => {
    if (!editingStudent) return
    
    try {
      const studentRef = doc(db, "user", editingStudent.id)
      await updateDoc(studentRef, {
        name: editForm.name
      })
      setShowEditModal(false)
      setEditingStudent(null)
      setEditForm({ name: '', email: '' })
      showToastMessage('Student updated successfully', 'success')
    } catch (error) {
      console.error("Error updating student:", error)
      showToastMessage('Failed to update student. Please try again.', 'error')
    }
  }

  const handleDelete = (studentId, studentName) => {
    setStudentToDelete({ id: studentId, name: studentName })
    setShowDeleteModal(true)
  }

  const confirmDelete = async () => {
    if (!studentToDelete) return
    
    try {
      await deleteDoc(doc(db, "user", studentToDelete.id))
      showToastMessage('Student deleted successfully', 'success')
      setShowDeleteModal(false)
      setStudentToDelete(null)
    } catch (error) {
      console.error("Error deleting student:", error)
      showToastMessage('Failed to delete student. Please try again.', 'error')
    }
  }

  return (
    <Layout>
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-gray-900 to-slate-800 p-6">
        <div className="max-w-7xl mx-auto">
          {/* Header Section */}
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-8 gap-4">
            <div>
              <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent mb-2">
                Student Management
              </h1>
              <p className="text-gray-400 text-lg">Manage and organize all student records</p>
            </div>
            <UserInfo />
          </div>

          {/* Stats Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            <div className="bg-gradient-to-br from-blue-900/50 to-purple-900/50 rounded-2xl p-6 border border-gray-700">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-400 mb-1">Total Students</p>
                  <p className="text-3xl font-bold text-blue-400">{Studentsdata.length}</p>
                </div>
                <div className="h-12 w-12 bg-blue-500/20 rounded-xl flex items-center justify-center">
                  <Users className="w-6 h-6 text-blue-400" />
                </div>
              </div>
            </div>
            
            <div className="bg-gradient-to-br from-green-900/50 to-emerald-900/50 rounded-2xl p-6 border border-gray-700">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-400 mb-1">Active Students</p>
                  <p className="text-3xl font-bold text-green-400">
                    {Studentsdata.filter(s => s.role === 'student').length}
                  </p>
                </div>
                <div className="h-12 w-12 bg-green-500/20 rounded-xl flex items-center justify-center">
                  <CheckCircle className="w-6 h-6 text-green-400" />
                </div>
              </div>
            </div>
            
            <div className="bg-gradient-to-br from-purple-900/50 to-pink-900/50 rounded-2xl p-6 border border-gray-700">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-400 mb-1">Teachers</p>
                  <p className="text-3xl font-bold text-purple-400">
                    {Studentsdata.filter(s => s.role === 'teacher').length}
                  </p>
                </div>
                <div className="h-12 w-12 bg-purple-500/20 rounded-xl flex items-center justify-center">
                  <User className="w-6 h-6 text-purple-400" />
                </div>
              </div>
            </div>
          </div>

          {/* Students Table */}
          <div className="bg-gradient-to-br from-gray-800/80 to-gray-900/80 rounded-2xl shadow-2xl border border-gray-700 overflow-hidden">
            <div className="px-6 py-4 border-b border-gray-700">
              <h2 className="text-xl font-semibold text-gray-100">All Students</h2>
            </div>
            
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-900/50">
                  <tr>
                    <th className="px-6 py-4 text-left text-sm font-semibold text-gray-300">Student</th>
                    <th className="px-6 py-4 text-left text-sm font-semibold text-gray-300">Email</th>
                    <th className="px-6 py-4 text-left text-sm font-semibold text-gray-300">Role</th>
                    <th className="px-6 py-4 text-left text-sm font-semibold text-gray-300">Status</th>
                    <th className="px-6 py-4 text-left text-sm font-semibold text-gray-300">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-700">
                  {Studentsdata.map((data) => (
                    <tr key={data.id} className="hover:bg-gray-800/50 transition-colors">
                      <td className="px-6 py-4">
                        <div className="flex items-center">
                          <div className="h-10 w-10 bg-gradient-to-br from-blue-500 to-purple-500 rounded-full flex items-center justify-center text-white font-semibold">
                            {data.name?.charAt(0).toUpperCase() || '?'}
                          </div>
                          <div className="ml-4">
                            <div className="text-sm font-medium text-gray-100">{data.name}</div>
                            <div className="text-sm text-gray-400">{data.email}</div>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-300">{data.email}</td>
                      <td className="px-6 py-4">
                        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold ${
                          data.role === 'teacher' 
                            ? 'bg-purple-100 text-purple-800' 
                            : 'bg-blue-100 text-blue-800'
                        }`}>
                          {data.role || 'student'}
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold bg-green-100 text-green-800">
                          Active
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex gap-2">
                          <button 
                            onClick={() => handleEdit(data)}
                            className="p-2 text-blue-400 hover:text-blue-300 hover:bg-blue-500/10 rounded-lg transition-colors"
                          >
                            <Edit3Icon className="w-4 h-4" />
                          </button>
                          <button 
                            onClick={() => handleDelete(data.id, data.name)}
                            className="p-2 text-red-400 hover:text-red-300 hover:bg-red-500/10 rounded-lg transition-colors"
                          >
                            <DeleteIcon className="w-4 h-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
              
              {Studentsdata.length === 0 && (
                <div className="text-center py-12">
                  <Users className="w-12 h-12 text-gray-500 mx-auto mb-4" />
                  <p className="text-gray-400 text-lg">No students found</p>
                  <p className="text-gray-500 text-sm mt-2">Add your first student to get started</p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Toast Notification */}
      {toast.show && (
        <div className={`fixed top-4 right-4 z-50 px-4 py-3 rounded-lg shadow-lg transition-all duration-300 transform translate-y-0 ${
          toast.type === 'success' 
            ? 'bg-green-600 text-white' 
            : 'bg-red-600 text-white'
        }`}>
          <div className="flex items-center">
            <span className="text-sm font-medium">{toast.message}</span>
            <button 
              onClick={() => setToast({ show: false, message: '', type: 'error' })}
              className="ml-3 text-white hover:text-gray-200"
            >
              ×
            </button>
          </div>
        </div>
      )}

      {/* Edit Modal */}
      {showEditModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-40">
          <div className="bg-gray-800 rounded-2xl p-6 border border-gray-700 w-full max-w-md mx-4">
            <h3 className="text-xl font-semibold text-gray-100 mb-4">Edit Student</h3>
            
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Name
                </label>
                <input
                  type="text"
                  value={editForm.name}
                  onChange={(e) => setEditForm({ ...editForm, name: e.target.value })}
                  className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-lg text-gray-100 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="Enter student name"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Email (cannot be changed)
                </label>
                <input
                  type="email"
                  value={editForm.email}
                  disabled
                  className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-lg text-gray-500 cursor-not-allowed"
                />
              </div>
            </div>
            
            <div className="flex gap-3 mt-6">
              <button
                onClick={handleUpdate}
                className="flex-1 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors font-medium"
              >
                Update Student
              </button>
              <button
                onClick={() => {
                  setShowEditModal(false)
                  setEditingStudent(null)
                  setEditForm({ name: '', email: '' })
                }}
                className="flex-1 px-4 py-2 bg-gray-600 hover:bg-gray-700 text-gray-100 rounded-lg transition-colors font-medium"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {showDeleteModal && studentToDelete && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-40">
          <div className="bg-gray-800 rounded-2xl p-6 border border-gray-700 w-full max-w-md mx-4">
            <div className="text-center">
              <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-red-900/50 mb-4">
                <DeleteIcon className="h-6 w-6 text-red-400" />
              </div>
              <h3 className="text-lg font-semibold text-gray-100 mb-2">
                Delete Student
              </h3>
              <p className="text-sm text-gray-400 mb-6">
                Are you sure you want to delete <span className="font-semibold text-gray-200">{studentToDelete.name}</span>? 
                This action cannot be undone and all attendance records will be lost.
              </p>
            </div>
            
            <div className="flex gap-3">
              <button
                onClick={confirmDelete}
                className="flex-1 px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg transition-colors font-medium"
              >
                Delete Student
              </button>
              <button
                onClick={() => {
                  setShowDeleteModal(false)
                  setStudentToDelete(null)
                }}
                className="flex-1 px-4 py-2 bg-gray-600 hover:bg-gray-700 text-gray-100 rounded-lg transition-colors font-medium"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </Layout>
  )
}
