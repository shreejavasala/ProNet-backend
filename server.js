import express from 'express'
import dotenv from 'dotenv'
import connectDB from './configs/db.js';
import cors from 'cors'
import userRouter from './routes/user.route.js';
import postRouter from './routes/post.route.js';
import allowedOrigins from './configs/allowedOrigins.js'
dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());
app.use(cors({
  origin: allowedOrigins,
  credentials: true,
}));

app.use('/api/users', userRouter);
app.use('/api/posts', postRouter)

app.get('/api', (req, res) => {
  res.send('Backend is running');
});

app.listen(PORT, () => {
  connectDB();
  console.log(`Server is running on PORT: ${PORT}`);
});