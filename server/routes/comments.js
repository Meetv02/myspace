import express from "express";
import { addComment, likeComment, getComment } from "../controllers/comments.js";
import { verifyToken } from "../middleware/auth.js";

const router = express.Router();

router.post("/add/:id",verifyToken,addComment);
router.patch("/:id/like",verifyToken,likeComment);
router.get("/:id",getComment);

export default router;