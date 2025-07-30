import { Router, Request, Response } from 'express';
import multer from 'multer';

import uploadConfig from '../config/multer';
import isLogged from '../middlewares/isLogged';
import { validateInformationUser, validatePassword, validatesInformationAddress } from '../middlewares/validatorInput';
import { listUserInformationController, updateUserInformationController } from '../controllers/user/informationController';
import { regularlCondicionalRoutes } from '../middlewares/condicionalRoutes';
import { createAddressController, deleteUserAddressController, updateAddressController } from '../controllers/user/addressController';
import { changePasswordController } from '../controllers/user/changePasswordController';

const userRoute = Router();

const upload = multer(uploadConfig.upload());

userRoute.get('/usuario',regularlCondicionalRoutes,  isLogged, (req: Request, res: Response) => {
    listUserInformationController(req, res);
    return;
});

userRoute.put('/usuario', regularlCondicionalRoutes, isLogged, validateInformationUser, (req: Request, res: Response) => {
    updateUserInformationController(req, res);
    return;
});

userRoute.post('/usuario/endereco',regularlCondicionalRoutes,  isLogged, validatesInformationAddress, (req: Request, res: Response) => {
    createAddressController(req, res);
    return;
});

userRoute.put('/usuario/endereco/:hash',regularlCondicionalRoutes,  isLogged, validatesInformationAddress, (req: Request, res: Response) => {
    updateAddressController(req, res);
    return;
});

userRoute.delete('/usuario/endereco/:hash',regularlCondicionalRoutes,  isLogged, (req: Request, res: Response) => {
    deleteUserAddressController(req, res);
    return;
});

userRoute.patch('/usuario/senha', regularlCondicionalRoutes, isLogged, validatePassword, (req: Request, res: Response) => {
    changePasswordController(req, res);
    return;
});

export { userRoute };