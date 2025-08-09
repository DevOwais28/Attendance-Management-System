import { Button } from "@/components/ui/button"
import {
  Card,
  CardAction,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import {auth } from '../firebase.js'
import {sendPasswordResetEmail } from "firebase/auth";
// import { useNavigate } from "react-router-dom"
import {useFormik} from "formik"
import * as Yup from 'yup';
import { toast } from "sonner"
import { Link } from 'react-router-dom'
// import { useState } from "react"

function Forgetpassword() {
  //  const navigate = useNavigate()


   const loginSchema = Yup.object().shape({
   email: Yup.string().email('Invalid email').required('Required'),
 });



  const formik = useFormik({
    initialValues: {
      email:"",
    },
    validationSchema:loginSchema,
   onSubmit: async (values) => {
  try {
    try {
      await sendPasswordResetEmail(auth, values.email);
      toast("Password reset email sent! Check your inbox.");
      formik.resetForm();
    } catch (error) {
      toast(error.message);
    }
  } catch (err) {
      toast(err.message || 'Failed to send reset email. Please try again.')
  }
}
});

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-gray-900 to-slate-800 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br from-orange-500 to-red-600 rounded-2xl mb-4">
            <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
            </svg>
          </div>
          <h1 className="text-4xl font-bold text-white mb-2">Reset Password</h1>
          <p className="text-gray-400">We'll send you an email to reset your password</p>
        </div>

        {/* Forget Password Card */}
        <div className="bg-gray-800/50 backdrop-blur-sm border border-gray-700 rounded-2xl shadow-2xl p-6 md:p-8">
          <form onSubmit={formik.handleSubmit} className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="email" className="text-gray-300 font-medium">Email Address</Label>
              <Input
                id="email"
                type="email"
                name="email"
                placeholder="Enter your email address"
                value={formik.values.email}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                required
                className={`w-full px-4 py-3 bg-gray-700/50 border ${
                  formik.touched.email && formik.errors.email 
                    ? 'border-red-500 focus:border-red-500' 
                    : 'border-gray-600 focus:border-orange-500'
                } rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-orange-500/20 transition-all`}
              />
              {formik.touched.email && formik.errors.email && (
                <p className="text-red-400 text-sm mt-1">{formik.errors.email}</p>
              )}
            </div>

            <Button
              type="submit"
              disabled={formik.isSubmitting}
              className="w-full py-3 bg-gradient-to-r from-orange-600 to-red-600 hover:from-orange-700 hover:to-red-700 text-white font-semibold rounded-lg shadow-lg hover:shadow-xl transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {formik.isSubmitting ? (
                <div className="flex items-center justify-center">
                  <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin mr-2"></div>
                  Sending reset link...
                </div>
              ) : (
                'Send Reset Link'
              )}
            </Button>
          </form>

          <div className="mt-6 text-center">
            <Link 
              to="/login" 
              className="text-sm text-orange-400 hover:text-orange-300 transition-colors inline-flex items-center"
            >
              <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
              </svg>
              Back to login
            </Link>
          </div>

          <div className="mt-6 text-center text-sm text-gray-400">
            <p>Remember your password?{' '}
              <Link to="/login" className="text-orange-400 hover:text-orange-300 font-medium transition-colors">
                Sign in
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Forgetpassword