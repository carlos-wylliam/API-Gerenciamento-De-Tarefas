import express from 'express';
import testsRoutes from './routes/testeRoutes';

const app = express();
const PORT = 3000;

app.use(express.json());

app.use('/api/test', testsRoutes);

app.listen(PORT, () => {
    console.log(`Servidor rodando em http://localhost:${PORT}`);
})