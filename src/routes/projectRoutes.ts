import { Router } from 'express'
import { body, param } from 'express-validator'
import { ProjectController } from '../controllers/ProjectController'
import { handleInputErrors } from '../middleware/validation'
import { TaskController } from '../controllers/TaskController'
import { projectExists } from '../middleware/project'
import { hasAuthorization, taskBelongsToProject, taskExists } from '../middleware/task'
import { authenticate } from '../middleware/auth'
import { TeamMemberController } from '../controllers/TeamController'
import { NoteController } from '../controllers/NoteController'
import { noteBelongsToTaks, noteExist } from '../middleware/note'

const router = Router()

router.use(authenticate)

router.post('/',
    body('projectName')
        .notEmpty().withMessage('El Nombre del Proyecto es Obligatorio'),
    body('clientName')
        .notEmpty().withMessage('El Nombre del Cliente es Obligatorio'),
    body('description')
        .notEmpty().withMessage('La Descripción del Proyecto es Obligatoria'),
    handleInputErrors,
    ProjectController.createProject
)

router.get('/', ProjectController.getAllProjects)

router.get('/:id',
    param('id').isMongoId().withMessage('ID no válido'),
    handleInputErrors,
    ProjectController.getProjectById
)


/** Routes for tasks */
router.param('projectId', projectExists)

router.put('/:projectId',
    param('projectId').isMongoId().withMessage('ID no válido'),
    body('projectName')
        .notEmpty().withMessage('El Nombre del Proyecto es Obligatorio'),
    body('clientName')
        .notEmpty().withMessage('El Nombre del Cliente es Obligatorio'),
    body('description')
        .notEmpty().withMessage('La Descripción del Proyecto es Obligatoria'),
    handleInputErrors,
    hasAuthorization,
    ProjectController.updateProject
)

router.delete('/:projectId',
    param('projectId').isMongoId().withMessage('ID no válido'),
    handleInputErrors,
    hasAuthorization,
    ProjectController.deleteProject
)


router.post('/:projectId/tasks',
    hasAuthorization,
    body('name')
        .notEmpty().withMessage('El Nombre de la tarea es Obligatorio'),
    body('description')
        .notEmpty().withMessage('La descripción de la tarea es obligatoria'),
    handleInputErrors,
    TaskController.createTask
)

router.get('/:projectId/tasks',
    TaskController.getProjectTasks
)

router.param('taskId', taskExists)
router.param('taskId', taskBelongsToProject)

router.get('/:projectId/tasks/:taskId',
    param('taskId').isMongoId().withMessage('ID no válido'),
    handleInputErrors,
    TaskController.getTaskById
)

router.put('/:projectId/tasks/:taskId',
    hasAuthorization,
    param('taskId').isMongoId().withMessage('ID no válido'),
    body('name')
        .notEmpty().withMessage('El Nombre de la tarea es Obligatorio'),
    body('description')
        .notEmpty().withMessage('La descripción de la tarea es obligatoria'),
    handleInputErrors,
    TaskController.updateTask
)

router.delete('/:projectId/tasks/:taskId',
    hasAuthorization,
    param('taskId').isMongoId().withMessage('ID no válido'),
    handleInputErrors,
    TaskController.deleteTask
)

router.post('/:projectId/tasks/:taskId/status',
    param('taskId').isMongoId().withMessage('ID no válido'),
    body('status')
        .notEmpty().withMessage('El estado es obligatorio'),
    handleInputErrors,
    TaskController.updateStatus
)
/** Routes for teams */
router.post('/:projectId/team/find',
    body('name')
        .optional()
        .isString().withMessage('El Nombre no es válido')
        .trim()
        .isLength({ min: 2 }).withMessage('El nombre debe tener al menos 2 caracteres'),
    body('email')
        .optional()
        .isEmail().toLowerCase().withMessage('E-mail no válido')
        .normalizeEmail(),
    handleInputErrors,
    TeamMemberController.findMemberByEmailAndName
)

router.get('/:projectId/team',
    TeamMemberController.getProjecTeam
)

router.post('/:projectId/team',
    body('id')
        .isMongoId().withMessage('ID No válido'),
    handleInputErrors,
    TeamMemberController.addMemberById
)

router.delete('/:projectId/team/:userId',
    param('userId')
        .isMongoId().withMessage('ID No válido'),
    handleInputErrors,
    TeamMemberController.removeMemberById
)

/** Routes for Notes */

router.param('noteId', noteExist)
router.param('noteId', noteBelongsToTaks)

router.post('/:projectId/tasks/:taskId/notes',
    body('content')
        .notEmpty().withMessage('El Contenido de la nota es obligatorio'),
    handleInputErrors,
    NoteController.createNote
)

router.get('/:projectId/tasks/:taskId/notes',
    NoteController.getTaskNotes
)
router.get('/:projectId/tasks/:taskId/notes/:noteId',
    hasAuthorization,
    param('noteId').isMongoId().withMessage('ID No Válido'),
    handleInputErrors,
    NoteController.getNote
)

router.delete('/:projectId/tasks/:taskId/notes/:noteId',
    param('noteId').isMongoId().withMessage('ID No Válido'),
    handleInputErrors,
    NoteController.deleteNote
)
router.put('/:projectId/tasks/:taskId/notes/:noteId',
    param('noteId').isMongoId().withMessage('ID No Válido'),
    body('content')
        .notEmpty().withMessage('El Contenido de la nota es obligatorio'),
    handleInputErrors,
    NoteController.updateNote
)

export default router