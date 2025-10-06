// src/controllers/taskController.ts
import { Request, Response } from "express";
import prisma from "../database/client";
import { z } from "zod";

// Schema para criar/atualizar tarefa
const taskSchema = z.object({
    title: z.string().min(5, "Título muito curto").max(100, "Título muito longo"),
    description: z.string().optional(),
});

export const createTask = async (req: Request, res: Response) => {

    if (!req.userId) return res.status(401).json({ error: "Usuário não autenticado" });
    
    try {
        const { title, description } = taskSchema.parse(req.body);

        // Criar a task vinculada ao usuário logado
        const task = await prisma.task.create({
            data: {
                title,
                description,
                userId: req.userId, // middleware deve preencher req.userId
            },
        });

        res.status(201).json({ task });
    } catch (error) {
        if (error instanceof z.ZodError) {
            return res.status(400).json({
                error: error.issues.map((err) => err.message).join(", "),
            });
        }
        console.error(error);
        res.status(500).json({ error: "Erro interno do servidor" });
    }
};

export const deleteTask = async (req: Request, res: Response) => {
    try {
        const { id } = req.params;

        // Verificar se a task pertence ao usuário
        const task = await prisma.task.findUnique({ where: { id: Number(id) } });
        if (!task || task.userId !== req.userId) {
            return res.status(403).json({ error: "Acesso negado" });
        }

        await prisma.task.delete({ where: { id: Number(id) } });

        res.status(200).json({ message: "Tarefa deletada com sucesso" });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: "Erro interno do servidor" });
    }
};

export const updateTask = async (req: Request, res: Response) => {
    try {
        const { id } = req.params;
        const { title, description } = taskSchema.parse(req.body);

        // Verificar se a task pertence ao usuário
        const task = await prisma.task.findUnique({ where: { id: Number(id) } });
        if (!task || task.userId !== req.userId) {
            return res.status(403).json({ error: "Acesso negado" });
        }

        const updatedTask = await prisma.task.update({
            where: { id: Number(id) },
            data: { title, description },
        });

        res.status(200).json({ task: updatedTask });
    } catch (error) {
        if (error instanceof z.ZodError) {
            return res.status(400).json({
                error: error.issues.map((err) => err.message).join(", "),
            });
        }
        console.error(error);
        res.status(500).json({ error: "Erro interno do servidor" });
    }
};

export const getAllTask = async (req: Request, res: Response) => {
    try {
        const tasks = await prisma.task.findMany({
            where: { userId: req.userId },
            orderBy: { createdAt: "desc" },
        });

        res.status(200).json({ tasks });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: "Erro interno do servidor" });
    }
};

export const getIdTask = async (req: Request, res: Response) => {
    try {
        const { id } = req.params;

        const task = await prisma.task.findUnique({ where: { id: Number(id) } });

        if (!task || task.userId !== req.userId) {
            return res.status(404).json({ error: "Tarefa não encontrada" });
        }

        res.status(200).json({ task });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: "Erro interno do servidor" });
    }
};
