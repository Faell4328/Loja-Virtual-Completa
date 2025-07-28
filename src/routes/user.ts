import { Router, Request, Response } from 'express';
import multer from 'multer';

import uploadConfig from '../config/multer';
import isLogged from '../middlewares/isLogged';
import { validateInformationUser, validatesInformationAddress } from '../middlewares/validatorInput';
import { createAddressController, deleteUserAddressController, listUserInformationController, updateAddressController, updateUserInformationController } from '../controllers/user/informationController';

const userRoute = Router();

const upload = multer(uploadConfig.upload());

userRoute.get('/usuario', isLogged, (req: Request, res: Response) => {
    listUserInformationController(req, res);
    return;
});

userRoute.put('/usuario', isLogged, upload.none(), validateInformationUser, (req: Request, res: Response) => {
    updateUserInformationController(req, res);
    return;
});

userRoute.post('/usuario/endereco', isLogged, upload.none(), validatesInformationAddress, (req: Request, res: Response) => {
    createAddressController(req, res);
    return;
});

userRoute.put('/usuario/endereco/:hash', isLogged, upload.none(), validatesInformationAddress, (req: Request, res: Response) => {
    updateAddressController(req, res);
    return;
});

userRoute.delete('/usuario/endereco/:hash', isLogged, (req: Request, res: Response) => {
    deleteUserAddressController(req, res);
    return;
});

export { userRoute };