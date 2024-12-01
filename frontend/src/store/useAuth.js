import {create} from 'zustand'
import axios from 'axios'
import { axiosInstance } from '../lib/axios'
import toast from 'react-hot-toast';
export const useAuth = create((set)=>({
    authUser: null,
    isCheckingAuth: true,
    isSigningUp: false,
    isLoggingIn: false,
    isUpdatingProfile: false,
    


    checkAuth: async()=>{
        try {
            const res = await axiosInstance.get("/auth/check");
            
            set({authUser: res.data})
        } catch (error) {
            set({authUser: null})
        } finally{
            set({isCheckingAuth: false})
        }
    },
    signup: async(data)=>{
        set({isSigningUp: true})
        try {
            const res = await axiosInstance.post("/auth/signup",data);
            set({authUser: res.data});
            toast.success("Account created successfully")
        } catch (error) {
            toast.error(error.response.data.msg)
        }finally{

            set({isSigningUp: false})
        }
    },
    logout: async()=>{
        try {
            await axiosInstance.post("/auth/logout");
            set({authUser: null});
            toast.success("Logged Out")
        } catch (error) {
            toast.error(error.response.data.msg)
        }
    },
    login: async (data) => {
        set({ isLoggingIn: true });
        try {
          const res = await axiosInstance.post("/auth/login", data);
          set({ authUser: res.data });
          toast.success("Logged in successfully");
    
        } catch (error) {
          toast.error(error.response.data.message);
        } finally {
          set({ isLoggingIn: false });
        }
      },
}))

//hook based state management library