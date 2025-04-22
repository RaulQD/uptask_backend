import type { Request, Response, NextFunction } from 'express'
import Task, { ITask } from '../models/Task'
import SubTask, { ISubTask } from '../models/SubTasks'
import mongoose from 'mongoose'

declare global {
    namespace Express {
        interface Request {
            task: ITask
            subTask: ISubTask
        }
    }
}
export async function subTaskExist(req: Request, res: Response, next: NextFunction) {
    try {
        const { subTaskId } = req.params
        const subTask = await SubTask.findById(subTaskId)
        if (!subTask) {
            const error = new Error('Subtarea no encontrada')
            return res.status(400).json({ error: error.message })
        }
        req.subTask = subTask
        next()
    } catch (error) {
        console.log(error)
        return res.status(500).json({ error: 'Hubo un error' })
    }
}
export async function taskExists(req: Request, res: Response, next: NextFunction) {
    try {
        const { taskId } = req.params
        const task = await Task.findById(taskId)
        if (!task) {
            const error = new Error('Tarea no encontrada')
            return res.status(404).json({ error: error.message })
        }
        req.task = task
        next()
    } catch (error) {
        console.log(error)
        res.status(500).json({ error: 'Hubo un error' })
    }
}

export function taskBelongsToProject(req: Request, res: Response, next: NextFunction) {
    if (req.task.project.toString() !== req.project.id.toString()) {
        const error = new Error('Acción no válida')
        return res.status(400).json({ error: error.message })
    }
    next()
}

export function hasAuthorization(req: Request, res: Response, next: NextFunction) {
    if (req.user.id.toString() !== req.project.manager.toString()) {
        const error = new Error('Acción no válida')
        return res.status(400).json({ error: error.message })
    }
    next()
}
