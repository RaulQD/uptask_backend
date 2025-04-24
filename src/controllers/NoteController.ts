import type { Request, Response } from 'express'
import Note, { INote } from '../models/Note'
import { Types } from 'mongoose'

type NoteParams = {
    noteId: Types.ObjectId
}

export class NoteController {
    static createNote = async (req: Request<{}, {}, INote>, res: Response) => {
        const { content } = req.body

        const note = new Note()
        note.content = content
        note.createdBy = req.user.id
        note.task = req.task.id

        req.task.notes.push(note.id)
        try {
            await Promise.allSettled([req.task.save(), note.save()])
            res.send('Nota Creada Correctamente')
        } catch (error) {
            res.status(500).json({ error: 'Hubo un error' })
        }
    }
    static getNote = async (req: Request, res: Response) => {
        try {
            const note = req.note
            if (note.createdBy._id.toString() !== req.user.id.toString()) {
                const error = new Error('Acción no válida')
                return res.status(401).json({ error: error.message })
            }

            return res.json(note)
        } catch (error) {
            console.log(error)
            return res.status(500).json({ error: 'Hubo un error' })
        }

    }

    static getTaskNotes = async (req: Request, res: Response) => {
        try {
            const notes = await Note.find({ task: req.task.id })
                .sort({ createdAt: -1 })
                .populate({ path: 'createdBy', select: 'id name email' })
            res.json(notes)
        } catch (error) {
            res.status(500).json({ error: 'Hubo un error' })
        }
    }

    static deleteNote = async (req: Request, res: Response) => {
        const { noteId } = req.params
        const note = await Note.findById(noteId)

        if (!note) {
            const error = new Error('Nota no encontrada')
            return res.status(404).json({ error: error.message })
        }

        if (note.createdBy.toString() !== req.user.id.toString()) {
            const error = new Error('Acción no válida')
            return res.status(401).json({ error: error.message })
        }

        req.task.notes = req.task.notes.filter(note => note.toString() !== noteId.toString())

        try {
            await Promise.allSettled([req.task.save(), note.deleteOne()])
            res.send('Nota Eliminada')
        } catch (error) {
            res.status(500).json({ error: 'Hubo un error' })
        }
    }
    static updateNote = async (req: Request<NoteParams, {}, INote>, res: Response) => {
        const { noteId } = req.params
        const { content } = req.body
        const note = await Note.findById(noteId)
        if (!note) {
            const error = new Error('Nota no encontrada')
            return res.status(404).json({ error: error.message })
        }
        if (note.createdBy.toString() !== req.user.id.toString()) {
            const error = new Error('Acción no válida')
            return res.status(401).json({ error: error.message })
        }
        note.content = content
        try {
            await note.save()
            return res.status(200).json({ message: 'Nota Actualizada Correctamente' })
        } catch (error) {
            console.log(error)
            return res.status(500).json({ error: 'Hubo un error' })
        }
    }
}