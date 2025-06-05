import express from 'express';
import { updateGameRoomStatus } from '../controllers/gameRoomController';
import { authMiddleware } from '../middleware/authMiddleware';

const router = express.Router();

/**
 * PATCH route to update game room status
 * Requires authentication and proper authorization
 */
router.patch('/:roomId/status', authMiddleware, updateGameRoomStatus);

export default router;