import 'dotenv/config';
import express from 'express';
import cors from 'cors';
import path from 'path';

import authRoutes    from './routes/auth.routes';
import blogRoutes    from './routes/blog.routes';
import commentRoutes from './routes/comment.routes';
import adminRoutes   from './routes/admin.routes';
import { errorMiddleware } from './middlewares/error.middleware';

const app = express();

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

app.use('/api/auth',                  authRoutes);
app.use('/api/blogs',                 blogRoutes);
app.use('/api/blogs/:blogId/comments', commentRoutes);
app.use('/api/admin',                 adminRoutes);

app.use(errorMiddleware);

export default app;
