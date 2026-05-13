import express from 'express';
import ledgerController from '../controllers/ledgerController.js';

const router = express.Router();

router.get('/', ledgerController.getLedgerEntries);

export default router;