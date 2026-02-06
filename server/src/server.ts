import express, { Application } from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import stockRoutes from './stockRoutes';

dotenv.config();

const app: Application = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

app.use('/api', stockRoutes);

app.get('/health', (req, res) => {
  res.json({ status: 'ok', message: 'Portfolio server is running' });
});

app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
