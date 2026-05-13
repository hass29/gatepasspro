import express from 'express';
import requestController from '../controllers/requestController.js';

const router = express.Router();

router.get('/', requestController.getRequests);
router.post('/', requestController.createRequest);
router.put('/:id/approve', requestController.approveRequest);
router.put('/:id/decline', requestController.declineRequest);
router.delete('/:id', requestController.deleteRequest);

export default router;