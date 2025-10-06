import { Router } from 'express';
import { registerUser, login, getAllUsers } from '../controller/userController';

const router = Router();

router.post('/register', registerUser);
router.post('/login', login);
router.get('/users', getAllUsers);
export default router;
