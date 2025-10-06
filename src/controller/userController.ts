import { Request, Response } from 'express';
import prisma from '../database/client';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import { z } from 'zod';

const registerSchema = z.object({
    name: z.string()
    .min(2, "Nome muito curto")
    .max(50, "Nome muito longo")
    .regex(/^[A-Za-zÀ-ÖØ-öø-ÿ ]+$/, "Nome inválido"),
    email: z.string().email("Email inválido"),
    password: z.string().min(8, "Senha precisa ter pelo menos 8 caracteres")
});

export const registerUser = async (req: Request, res: Response) => {
    try {
        //Validar dados
        const { name, email, password } = registerSchema.parse(req.body);

        //Verificar se o e-mail já existe
        const existingUser = await prisma.user.findUnique({ where: { email } });
        if (existingUser) {
            return res.status(400).json({ error: "Email já cadastrado"});
        }

        //Criptgrafar senha
        const hashedPassword = await bcrypt.hash(password, 10);

        //Criar usuário
        const user = await prisma.user.create({
            data: { name, email, password: hashedPassword }
        });

        //Gerar token JWT
        const token = jwt.sign(
            { userId: user.id },
            process.env.JWT_SECRET || 'supersecret',
            { expiresIn: '1h' }
        );

        res.status(201).json({ user: { id: user.id, name: user.name, email: user.email }, token });
    } catch (error) {
        if (error instanceof z.ZodError) {
            return res.status(400).json({
      error: error.issues.map(err => err.message).join(', ')
    })
        
    }
        
        console.error(error);
        res.status(500).json({ error: "Erro interno do servidor" });
  }
}