import { Request, Response } from "express";
import { z } from "zod";
import { prisma } from "@/lib/prisma.js";
import { AppError } from "@/utils/AppError.js";

class TasksController {
  async create(request: Request, response: Response) {
    const bodySchema = z.object({
      title: z.string().trim().min(3),
      description: z.string().trim().nullish(),
      assignedTo: z.uuid(),
      teamId: z.uuid(),
    });

    const { title, description, assignedTo, teamId } = bodySchema.parse(
      request.body,
    );

    const assignedToId = await prisma.user.findUnique({
      where: { id: assignedTo },
    });

    if (!assignedToId) {
      throw new AppError("User not found");
    }

    const team = await prisma.team.findUnique({
      where: { id: teamId },
    });

    if (!team) {
      throw new AppError("Team not found");
    }

    const alreadyMember = await prisma.teamMember.findFirst({
      where: {
        userId: assignedTo,
        teamId,
      },
    });

    if (!alreadyMember) {
      throw new AppError("User is not a member of this team");
    }

    const task = await prisma.task.create({
      data: {
        title,
        description,
        assignedTo,
        teamId,
      },
    });

    return response.status(201).json(task);
  }

  async index(request: Request, response: Response) {
    const querySchema = z.object({
      status: z.enum(["pending", "in_progress", "completed"]).optional(),
      priority: z.enum(["high", "medium", "low"]).optional(),
    });

    const { status, priority } = querySchema.parse(request.query);

    if (!request.user) {
      throw new AppError("Unauthorized", 401);
    }

    const { id, role } = request.user;

    const where = role === "admin" ? {} : { assignedTo: id };
    const filters = { ...where, status, priority };

    const tasks = await prisma.task.findMany({ where: filters });

    return response.status(200).json(tasks);
  }

  async update(request: Request, response: Response) {
    const paramsSchema = z.object({
      id: z.uuid(),
    });

    const bodySchema = z.object({
      title: z.string().trim().min(3).optional(),
      description: z.string().trim().min(3).nullish(),
      status: z.enum(["pending", "in_progress", "completed"]).optional(),
      priority: z.enum(["high", "medium", "low"]).optional(),
    });

    const { id } = paramsSchema.parse(request.params);

    const { title, description, status, priority } = bodySchema.parse(
      request.body,
    );

    if (!request.user) {
      throw new AppError("User not authenticated");
    }

    const task = await prisma.task.findUnique({ where: { id } });

    if (!task) {
      throw new AppError("Task not found");
    }

    const { id: userId, role } = request.user;

    if (role === "member" && task.assignedTo !== userId) {
      throw new AppError("You can only edit your own tasks");
    }

    const updatedTask = await prisma.task.update({
      where: { id },
      data: { title, description, status, priority },
    });

    if (status && status !== task.status) {
      await prisma.taskHistory.create({
        data: {
          taskId: id,
          changedBy: userId,
          newStatus: status,
          oldStatus: task.status,
        },
      });
    }

    return response.status(200).json(updatedTask);
  }

  async remove(request: Request, response: Response) {
    const paramsSchema = z.object({
      id: z.uuid(),
    });

    const { id } = paramsSchema.parse(request.params);

    const task = await prisma.task.findUnique({ where: { id } });

    if (!task) {
      throw new AppError("Task not found");
    }

    await prisma.task.delete({
      where: { id },
    });

    return response.status(200).send();
  }
}

export { TasksController };
