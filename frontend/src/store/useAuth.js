import { create } from "zustand";
import axios from "axios";
import { axiosInstance } from "../lib/axios";
import toast from "react-hot-toast";
import { io } from "socket.io-client";

const BASE_URL = "http://localhost:5001";

export const useAuth = create((set, get) => ({
  authUser: null,
  isCheckingAuth: true,
  isSigningUp: false,
  isLoggingIn: false,
  isUpdatingProfile: false,
  onlineUsers: [],
  socket: null,

  checkAuth: async () => {
    try {
      const res = await axiosInstance.get("/auth/check");
      set({ authUser: res.data });
      if (res.data) {
        get().connectSocket();
      }
    } catch (error) {
      set({ authUser: null });
    } finally {
      set({ isCheckingAuth: false });
    }
  },

  signup: async (data) => {
    set({ isSigningUp: true });
    try {
      const res = await axiosInstance.post("/auth/signup", data);
      set({ authUser: res.data });
      toast.success("Account created successfully");

      const userId = res.data._id;
      localStorage.setItem("userId", userId);
      console.log("Stored userId in localStorage:", userId); // Debugging line

      get().connectSocket();
    } catch (error) {
      toast.error(error.response.data.msg);
    } finally {
      set({ isSigningUp: false });
    }
  },

  logout: async () => {
    try {
      await axiosInstance.post("/auth/logout");
      set({ authUser: null });
      
      toast.success("Logged Out");
      localStorage.setItem("userId", "");
      get().disconnectSocket();
    } catch (error) {
      toast.error(error.response.data.msg);
    }
  },

  login: async (data) => {
    set({ isLoggingIn: true });
    try {
      const res = await axiosInstance.post("/auth/login", data);
      set({ authUser: res.data });
      toast.success("Logged in successfully");

      const userId = res.data._id;
      localStorage.setItem("userId", userId);
      console.log("Stored userId in localStorage:", userId); // Debugging line

      get().connectSocket();
    } catch (error) {
      toast.error(error.response.data.message);
    } finally {
      set({ isLoggingIn: false });
    }
  },

  updateProfile: async (data) => {
    set({ isUpdatingProfile: true });
    try {
      const res = axiosInstance.put("/auth/update-profile", data);
      toast.success("Profile updated successfully");
    } catch (error) {
      toast.error(error.response.data.msg);
    } finally {
      set({ isUpdatingProfile: false });
    }
  },

  connectSocket: () => {
    const { authUser } = get();

    // Ensure valid userId is present
    const userId = authUser?._id || localStorage.getItem("userId");
    if (!userId) {
      console.error("No userId available, cannot connect socket.");
      return;
    }

    if (get().socket?.connected) return; // Prevent reconnecting if already connected

    console.log("Connecting with userId:", userId);
    const socket = io(BASE_URL, {
      query: {
        userId: userId,
      },
      autoConnect: false,
    });

    socket.connect();
    set({ socket: socket });

    socket.on("connect", () => {
      console.log("Socket connected with userId:", userId);
    });

    socket.on("getOnlineUsers", (userIds) => {
      console.log("Online users received:", userIds); // Debugging line
      set({ onlineUsers: userIds });
    });

    socket.on("disconnect", () => {
      console.log("Socket disconnected. Attempting to reconnect...");
      set({ socket: null });
      get().connectSocket(); // Reconnect when disconnected
    });
  },

  disconnectSocket: () => {
    if (get().socket?.connected) {
      get().socket.disconnect();
    }
  },
}));
