import { Router } from 'express';
import { todoController } from '../controllers';
import { authenticate } from '../middleware';
import { validate } from '../validators';
import { createTodoSchema, updateTodoSchema, todoQuerySchema } from '../validators/todo';

const router = Router();

router.use(authenticate);

router.get('/', validate(todoQuerySchema, 'query'), todoController.getTodos);
router.get('/stats', todoController.getTodoStats);
router.get('/:id', todoController.getTodo);
router.post('/', validate(createTodoSchema), todoController.createTodo);
router.put('/:id', validate(updateTodoSchema), todoController.updateTodo);
router.delete('/:id', todoController.deleteTodo);
router.patch('/:id/toggle', todoController.toggleTodo);
router.patch('/:id/toggle-important', todoController.toggleImportantTodo);

export default router;
