import express from 'express'
import { addComment, createPost, deletePost, editPost, getAllPosts, toggleLikePost } from '../controllers/post.controller.js';
import { verifyToken } from '../middlewares/auth.middleware.js';

const postRouter = express.Router();

postRouter.get('/', verifyToken, getAllPosts);
postRouter.post('/', verifyToken, createPost);
postRouter.put('/:id', verifyToken, editPost);
postRouter.delete('/:id', verifyToken, deletePost);
postRouter.put('/:id/like', verifyToken, toggleLikePost);
postRouter.post('/:id/comment', verifyToken, addComment);

export default postRouter;