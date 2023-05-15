import router from '../../lib/router';
import { NotesController } from './notes.controller';

// You can create your routes here

router.post('/', NotesController.create);
router.get('/', NotesController.list);
router.get('/:id', NotesController.get);
router.put('/:id', NotesController.update);
router.delete('/:id', NotesController.delete);

export default router;