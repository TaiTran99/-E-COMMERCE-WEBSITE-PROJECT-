import express, { Express } from 'express';
const router: Express = express();
import authController from '../../controllers/authclient.controller';
import { authenticateToken } from '../../middlewares/auth.middleware';

//http://localhost:8080/api/v1/auth/login/customer
router.post('/login/customer', authController.authLogin);

//http://localhost:8080/api/v1/auth/refresh-token/customer
router.post('/refresh-token/customer', authenticateToken, authController.refreshToken);

//http://localhost:8080/api/v1/auth/profile
router.get('/profile/customer', authenticateToken, authController.getProfile);


export default router;