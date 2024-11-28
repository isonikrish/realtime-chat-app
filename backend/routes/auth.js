import express from 'express';
import {handleSignup , handleLogin, handleLogout, handleUpdateProfile,handleCheckAuth} from '../controllers/auth.js'
import { protectRoute } from '../lib/utils.js';
const router = express.Router();

router.post("/signup",handleSignup);
router.post("/login",handleLogin);
router.post("/logout",handleLogout);
router.put("/update-profile",protectRoute, handleUpdateProfile);
router.get("/check",protectRoute,handleCheckAuth)
export default router;
