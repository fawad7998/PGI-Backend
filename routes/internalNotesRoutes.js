const express = require('express');
const {
  DeleteNote,
  EditNote,
  GetNote,
  GetNoteById,
  PostNote,
} = require('../controllers/internalNotesController');

const router = express.Router();

router.get('/', GetNote);
router.post('/', PostNote);
router.patch('/:id', EditNote);
router.delete('/:id', DeleteNote);
router.get('/:id', GetNoteById);

module.exports = router;
