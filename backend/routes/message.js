import express from 'express';
import { protectRoute } from '../lib/utils.js';
import { handleGetUsersForSidebar , handleGetMessages, handleSendmessages} from '../controllers/message.js';
const router = express.Router();

router.get("/users",protectRoute, handleGetUsersForSidebar)
router.get("/:id",protectRoute, handleGetMessages)
router.post("/send/:id",protectRoute, handleSendmessages)
export default router;