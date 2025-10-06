import express from 'express';
import testsRoutes from './routes/testeRoutes';
import userRoutes from './routes/userRoutes';

const app = express();
const PORT = 3000;

app.use(express.json());

app.use('/api/test', testsRoutes);
app.use('/api/users', userRoutes);

app.listen(PORT, () => {
    console.log(`Servidor rodando em http://localhost:${PORT}`);
})