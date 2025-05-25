import { Request, Response, Router } from 'express';
import multer from 'multer';

import uploadConfig from '../config/multer';
import isAdmin from '../middlewares/isAdmin';
import { regularlCondicionalRoutes } from '../middlewares/condicionalRoutes';
import { changeCategoryController, createCategoriesController, deleteCategoryController, listAllCategoriesController } from '../controllers/category/informationController';

const categoryRoute = Router();
const upload = multer(uploadConfig.upload());

categoryRoute.get('/categorias', regularlCondicionalRoutes, (req: Request, res: Response) => {
    listAllCategoriesController(req, res);
    return;
});

categoryRoute.post('/categoria', regularlCondicionalRoutes, isAdmin, upload.none(), (req: Request, res: Response) => {
    createCategoriesController(req, res);
    return;
});

categoryRoute.put('/categoria/:hash', regularlCondicionalRoutes, isAdmin, upload.none(), (req: Request, res: Response) => {
    changeCategoryController(req, res);
    return;
});

categoryRoute.delete('/categoria/:hash', regularlCondicionalRoutes, isAdmin, (req: Request, res: Response) => {
    deleteCategoryController(req, res);
    return
});

export { categoryRoute };