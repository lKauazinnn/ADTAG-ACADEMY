import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import authRoutes from './routes/auth.routes';
import moduleRoutes from './routes/module.routes';
import videoRoutes from './routes/video.routes';
import progressRoutes from './routes/progress.routes';
import adminRoutes from './routes/admin.routes';
import chatRoutes from './routes/chat.routes';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3333;

// Middlewares
app.use(cors());
app.use(express.json());

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/modules', moduleRoutes);
app.use('/api/videos', videoRoutes);
app.use('/api/progress', progressRoutes);
app.use('/api/admin', adminRoutes);
app.use('/api/chat', chatRoutes);

// Health check
app.get('/health', (req, res) => {
  res.json({ status: 'ok', message: 'Server is running' });
});

// Debug - testa conexão Supabase
app.get('/debug', async (req, res) => {
  const supabase = (await import('./lib/supabase')).default;
  const { data, error } = await supabase.from('users').select('count').limit(1);
  res.json({ data, error, url: process.env.SUPABASE_URL, hasKey: !!process.env.SUPABASE_SERVICE_KEY });
});

// Em dev local, inicia o servidor normalmente
if (process.env.NODE_ENV !== 'production') {
  app.listen(PORT, () => {
    console.log(`🚀 Server running on http://localhost:${PORT}`);
  });
}

export default app;
