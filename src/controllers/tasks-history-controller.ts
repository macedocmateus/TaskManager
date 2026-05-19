import { Request, Response } from "express";
import { z } from "zod";
import { prisma } from "@/lib/prisma.js";
import { AppError } from "@/utils/AppError.js";

class TasksHistoryController {
  async index(request: Request, response: Response) {
    const paramsSchema = z.object({
      id: z.uuid(),
    });

    const { id } = paramsSchema.parse(request.params);

    const task = await prisma.task.findUnique({ where: { id } });

    if (!task) {
      throw new AppError("Task not found");
    }

    const taskHistory = await prisma.taskHistory.findMany({
      where: { taskId: id },
    });

    return response.status(200).json(taskHistory);
  }
}

export { TasksHistoryController };
