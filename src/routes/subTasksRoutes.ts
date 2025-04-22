import { Router } from "express";
import { SubTaskController } from "../controllers/SubTaskController";
import { body, param } from "express-validator";
import { authenticate } from "../middleware/auth";
import { handleInputErrors } from "../middleware/validation";
import { hasAuthorization, subTaskExist, taskExists } from "../middleware/task";
import { TaskController } from "../controllers/TaskController";

const router = Router();
router.use(authenticate);
// router.param("taskId", taskExists);
// router.param('subTaskId', subTaskExist)

router.post('/:taskId/subtasks',
  param('taskId').isMongoId().withMessage('ID de tarea no válido'),
  body('name').notEmpty().withMessage('El nombre de la subtarea es obligatorio.'),
  handleInputErrors,
  taskExists,
  SubTaskController.createSubTask);

router.get('/:taskId/subtasks',
  handleInputErrors,
  taskExists,
  SubTaskController.getSubTask);
router.get('/:taskId/subtask', TaskController.getTaskWithSubtask);
router.patch('/:taskId/subtasks/:subTaskId/completed',
  param('taskId').isMongoId().withMessage('ID de tarea no válido.'),
  param('subTaskId').isMongoId().withMessage('ID de subtask no válido.'),
  body('completed').isBoolean().withMessage('El estado de la subtarea debe ser un booleano.'),
  handleInputErrors,
  taskExists,
  subTaskExist,
  SubTaskController.updateSubTaskStatus)

router.delete('/:taskId/subtasks/:subTaskId',
  param('taskId').isMongoId().withMessage('ID de tarea no válido.'),
  param('subTaskId').isMongoId().withMessage('ID de subtask no válido.'),
  handleInputErrors,
  taskExists,
  subTaskExist,
  SubTaskController.deleteSubTask
)

export default router;