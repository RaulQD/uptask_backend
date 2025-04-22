import type { Request, Response } from 'express';
import Project, { IProject } from '../models/Project';
import SubTask, { ISubTask } from '../models/SubTasks';


export class SubTaskController {
  static createSubTask = async (req: Request, res: Response) => {
    try {
      // Crear la subtarea
      const subTask = new SubTask(req.body);
      subTask.task = req.task.id;
      req.task.subtasks.push(subTask.id);
      await Promise.all([subTask.save(), req.task.save()]);
      return res.status(201).json(subTask);
    } catch (error) {
      console.log(error);
      return res.status(500).json({ error: 'Hubo un error' });
    }
  }
  static async getSubTask(req: Request, res: Response) { 
    try {
      const { taskId } = req.params
      const subtasks = await SubTask.find({ task: taskId })
      return res.json(subtasks)
    } catch (error) {
      console.log(error);
      return res.status(500).json({ error: 'Hubo un error' });
    }
  }
  static async updateSubTaskStatus(req: Request<{}, {}, ISubTask>, res: Response) {
    try {
      const { completed } = req.body;
      req.subTask.completed = completed;
      await req.subTask.save();
      return res.status(200).json(req.subTask);
    } catch (error) {
      console.log(error)
      return res.status(500).json({ error: 'Hubo un error' });
    }
  }
  static async deleteSubTask(req: Request, res: Response) {
    try {
      req.task.subtasks = req.task.subtasks.filter(subtasks => subtasks.toString() !== req.subTask.id.toString())
      await Promise.all([req.task.save(), req.subTask.deleteOne()])
      return res.status(200).json({ message: 'Subtarea eliminada' })
    } catch (error) {
      console.log(error)
      return res.status(500).json({ error: 'Hubo un error' })
    }
  }

  static async getSubTasks(req: Request, res: Response) { }
  static async updateSubTask(req: Request, res: Response) { }
  static async deleteAllSubTaksByTask(req: Request, res: Response) { }

}