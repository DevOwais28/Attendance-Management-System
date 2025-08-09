import { create } from 'zustand'
import { persist } from 'zustand/middleware'

const useAppStore = create()(
  persist(
    (set) => ({
        userId:"",
        userRole:"",
        setUserId:(Id) => set({userId : Id }),
        setUserRole:(role) => set({userRole : role })
    }),
    {
      name: 'app-storage',
    },
  ),
)
export default useAppStore