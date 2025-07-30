import { Router, Request, Response } from 'express';
import multer from 'multer';

import uploadConfig from '../config/multer';
import createUserAdminController from '../controllers/installation/createUserAdminController';
import configureSystemController from '../controllers/installation/configureSystemController';
import { validateRegister, validateSystemConfig } from '../middlewares/validatorInput';
import { instalationConditionalRoutes } from '../middlewares/condicionalRoutes';

const instalationRoute = Router();
const upload = multer(uploadConfig.upload(true));

instalationRoute.post('/instalacao/admin', instalationConditionalRoutes, validateRegister, (req: Request, res: Response) => {
    createUserAdminController(req, res);
    return
})

instalationRoute.post('/instalacao/config', instalationConditionalRoutes, upload.single('file'), validateSystemConfig, (req: Request, res: Response) => {
    configureSystemController(req, res);
    return;
})

export { instalationRoute };