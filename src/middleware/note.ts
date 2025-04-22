import type { Request, Response, NextFunction } from "express";
import Note, { INote } from "../models/Note";

declare global {
  namespace Express {
    interface Request {
      note: INote;
    }
  }
}

export const noteExist = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { noteId } = req.params;
    const note = await Note.findById(noteId)
    if (!note) {
      const error = new Error('Nota no encontrada')
      return res.status(404).json({ error: error.message })
    }
    req.note = note
    next()
  } catch (error) {
    return res.status(500).json({ error: 'Hubo un error' })
  }
}

//VALIDA SI LA NOTA PERTENECE A LA TAREA
export const noteBelongsToTaks = async (req: Request, res: Response, next: NextFunction) => {
  if (req.note.task.toString() !== req.task.id.toString()) {
    const error = new Error('Acción no válida')
    return res.status(400).json({ error: error.message })
  }
  next()
}