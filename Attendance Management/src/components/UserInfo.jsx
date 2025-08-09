import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { useState } from "react"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import {useFormik} from "formik"
import * as Yup from 'yup';
import { toast } from "sonner"
// import { Link, useNavigate } from 'react-router-dom'
import { db } from '../firebase.js'
import { collection, addDoc ,doc ,getDoc, Timestamp } from "firebase/firestore";
import { User } from 'lucide-react';



export function UserInfo() {
const [loading,setloading] = useState(false)
//  const navigate = useNavigate()

  const LoginSchema = Yup.object().shape({
     email: Yup.string().email('Invalid email').required('Required'),
     name:Yup.string().required('Required')
   });
    const formik = useFormik({
      initialValues: {
        email:"",
        name:"",
      },
      onSubmit: async(values)=>{
        try{
          setloading(true)
           const docRef = doc(db, "user", values.email);
           const docSnap = await getDoc(docRef);
           if (!docSnap.exists()){
           let docRef = await addDoc(collection(db, "user"),{
            name: values.name,
            email: values.email,
            role: 'student',
            time: Timestamp.now(),
            attendance: {}
            });
            console.log("User doc created with ID:", docRef.id);
            toast.success("Student created successfully");
       }else{
           toast.error('Student with this email already exists')
        }
        }catch(err){
            toast(err)
        }finally{
          setloading(false)
        }
      },
      validationSchema:LoginSchema
    });

 
  return (
    <Dialog>
      <form>
        <DialogTrigger asChild>
          <Button className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white font-semibold rounded-xl px-6 py-2.5 shadow-lg hover:shadow-xl transition-all duration-300">
            <User className="w-4 h-4 mr-2" />
            Add New Student
          </Button>
        </DialogTrigger>
        <DialogContent className="sm:max-w-md bg-gradient-to-br from-gray-800 to-gray-900 border border-gray-700 rounded-2xl">
          <DialogHeader>
            <DialogTitle className="text-2xl font-bold bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
              Add New Student
            </DialogTitle>
            <DialogDescription className="text-gray-400">
              Enter student details to add them to the attendance system
            </DialogDescription>
          </DialogHeader>
          <form onSubmit={formik.handleSubmit}>
            <div className="space-y-6 py-4">
              <div className="space-y-2">
                <Label htmlFor="name" className="text-sm font-medium text-gray-300">
                  Full Name
                </Label>
                <Input
                  id="name"
                  name="name"
                  placeholder="Enter student name"
                  value={formik.values.name}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  className="bg-gray-800 border border-gray-600 rounded-lg text-gray-100 placeholder-gray-500 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                />
                {formik.touched.name && formik.errors.name && (
                  <p className="text-sm text-red-400">{formik.errors.name}</p>
                )}
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="email" className="text-sm font-medium text-gray-300">
                  Email Address
                </Label>
                <Input
                  id="email"
                  name="email"
                  type="email"
                  placeholder="student@example.com"
                  value={formik.values.email}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  className="bg-gray-800 border border-gray-600 rounded-lg text-gray-100 placeholder-gray-500 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                />
                {formik.touched.email && formik.errors.email && (
                  <p className="text-sm text-red-400">{formik.errors.email}</p>
                )}
              </div>
            </div>
            <DialogFooter className="gap-3">
              <DialogClose asChild>
                <Button variant="outline" className="border-gray-600 text-gray-300 hover:bg-gray-700 hover:text-gray-100 rounded-lg">
                  Cancel
                </Button>
              </DialogClose>
              <Button 
                disabled={loading} 
                type="submit" 
                className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white font-semibold rounded-lg px-6 py-2.5 transition-all duration-300 disabled:opacity-50"
              >
                {loading ? 'Adding...' : 'Add Student'}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </form>
    </Dialog>
  )
}
