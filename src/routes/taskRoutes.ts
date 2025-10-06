import { Router } from "express";
import {
    createTask,
    deleteTask,
    updateTask,
    getAllTask,
    getIdTask,
} from "../controller/taskController";
import { authenticate } from "../middleware/authMiddleware";

const router = Router();

// Todas as rotas de task serão protegidas
router.use(authenticate);

router.post("/create", createTask);
router.get("/search", getAllTask);
router.get("/search/:id", getIdTask);
router.put("/updateTask/:id", updateTask);
router.delete("/removeTask/:id", deleteTask);

export default router;
