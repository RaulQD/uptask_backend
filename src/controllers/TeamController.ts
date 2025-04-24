import type { Request, Response } from 'express'
import User, { IUser } from '../models/User'
import Project from '../models/Project'
interface SearchQuery {
    name?: { $regex: string; $options: string };
    email?: { $regex: string; $options: string };
}
export class TeamMemberController {
    static findMemberByEmail = async (req: Request, res: Response) => {
        const { email } = req.body

        // Find user
        const user = await User.findOne({ email }).select('id email name')
        if (!user) {
            const error = new Error('Usuario no encontrado')
            return res.status(404).json({ error: error.message })
        }
        res.json(user)
    }

    static findMemberByEmailAndName = async (req: Request<{}, {}, IUser>, res: Response) => {
        try {
            const { email, name } = req.body
            const searchQuery: SearchQuery = {}
            if (email) {
                searchQuery.email = { $regex: email, $options: 'i' }
            }
            if (name) {
                searchQuery.name = { $regex: name, $options: 'i' }
            }
            // Si no se proporcionaron parámetros de búsqueda, devolver un mensaje apropiado
            if (Object.keys(searchQuery).length === 0) {
                return res.status(400).json({
                    success: false,
                    message: 'Se requiere al menos un parámetro de búsqueda (nombre o correo)'
                });
            }
            const members = await User.find(searchQuery).select('id email name createdAt')
            if (members.length === 0) {
                const error = new Error('No se encontraron usuarios con los criterios proporcionados.')
                return res.status(404).json({ success: false, error: error.message })
            }

            return res.status(200).json(members)
        } catch (error) {
            console.error('Error al buscar usuarios:', error);
            return res.status(500).json({
                success: false,
                message: 'Error al buscar usuarios',
                error: error instanceof Error ? error.message : 'Error desconocido'
            });
        }
    }
    static getProjecTeam = async (req: Request, res: Response) => {
        const project = await Project.findById(req.project.id).populate({
            path: 'team',
            select: 'id email name'
        })
        res.json(project.team)
    }

    static addMemberById = async (req: Request, res: Response) => {
        const { id } = req.body

        // Find user
        const user = await User.findById(id).select('id')
        if (!user) {
            const error = new Error('Usuario no Encontrado')
            return res.status(404).json({ error: error.message })
        }
        //VALIDAR QUE EL USUARIO NO SEA EL MANAGER DEL PROYECTO
        if (req.project.manager.toString() === user.id.toString()) {
            const error = new Error('El creador del proyecto no puede agregarse a sí mismo como colaborador.')
            return res.status(409).json({ error: error.message })
        }

        if (req.project.team.some(team => team.toString() === user.id.toString())) {
            const error = new Error('El usuario ya existe en el proyecto')
            return res.status(409).json({ error: error.message })
        }

        req.project.team.push(user.id)
        await req.project.save()

        res.send('Usuario agregado correctamente')
    }

    static removeMemberById = async (req: Request, res: Response) => {
        const { userId } = req.params

        if (!req.project.team.some(team => team.toString() === userId)) {
            const error = new Error('El usuario no existe en el proyecto')
            return res.status(409).json({ error: error.message })
        }

        req.project.team = req.project.team.filter(teamMember => teamMember.toString() !== userId)
        await req.project.save()
        res.send('Usuario eliminado correctamente')
    }
}
