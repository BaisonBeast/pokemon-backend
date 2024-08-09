import express from 'express';
import bodyParser from 'body-parser';
import authRoutes from './routes/authRoute';
import userRoutes from './routes/userRoute';
import connectDB from './config/db';
import dotenv from 'dotenv';
import cors from 'cors';

dotenv.config();
const port = process.env.PORT || 3000;
const app = express();

app.use(cors({
  origin: 'http://localhost:5173' 
}));

connectDB();

app.use(bodyParser.json());

app.use('/api/auth', authRoutes);  
app.use('/api/users', userRoutes);

app.get('/', function(req, res) {
  res.send('Hello')
})


app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});