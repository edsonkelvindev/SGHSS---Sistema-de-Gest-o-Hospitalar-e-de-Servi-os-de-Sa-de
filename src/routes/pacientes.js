const express = require('express');
const router = express.Router();
const pacienteController = require('../controllers/pacienteController');
const auth = require('../middleware/auth');

router.post('/', auth, pacienteController.createPaciente);
router.get('/', auth, pacienteController.listPacientes);
router.get('/:id', auth, pacienteController.getPaciente);
router.put('/:id', auth, pacienteController.updatePaciente);
router.delete('/:id', auth, pacienteController.deletePaciente);

module.exports = router;
