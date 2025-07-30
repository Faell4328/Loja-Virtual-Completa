import { Router, Request, Response } from 'express';

import isNotLogged from '../middlewares/isNotLogged';
import { validateEmail } from '../middlewares/validatorInput';
import { emailLimit, confirmationLimit } from '../security/requestLimit';
import { regularlCondicionalRoutes } from '../middlewares/condicionalRoutes';
import { emailConfirmationController, resendEmailConfirmationController } from '../controllers/email/emailConfirmationController';

const confirmationEmailRoute = Router();


confirmationEmailRoute.put('/confirmacao/:hash', regularlCondicionalRoutes, isNotLogged, confirmationLimit, (req: Request, res: Response) => {
    emailConfirmationController(req, res);
    return;
});

confirmationEmailRoute.post('/confirmacao', regularlCondicionalRoutes, isNotLogged, emailLimit, validateEmail, (req: Request, res: Response) => {
    resendEmailConfirmationController(req, res);
    return;
});

export { confirmationEmailRoute };