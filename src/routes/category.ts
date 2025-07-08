import { Request, Response, Router } from 'express';
import multer from 'multer';

import uploadConfig from '../config/multer';
import isAdmin from '../middlewares/isAdmin';
import { regularlCondicionalRoutes } from '../middlewares/condicionalRoutes';
import { changeCategoryController, consultNameCategoryController, createCategoryController, deleteCategoryController, listAllCategoriesController, listAllProductsInCategoryController } from '../controllers/category/informationController';
import { validateCategory } from '../middlewares/validatorInput';

const categoryRoute = Router();
const upload = multer(uploadConfig.upload());

categoryRoute.get('/categorias', regularlCondicionalRoutes, (req: Request, res: Response) => {
    listAllCategoriesController(req, res);
    return;
});

categoryRoute.get('/categoria/:hash', regularlCondicionalRoutes, (req: Request, res: Response) => {
    consultNameCategoryController(req, res);
    return;
});

categoryRoute.get('/categoria/produtos/:hash', regularlCondicionalRoutes, (req: Request, res: Response) => {
    listAllProductsInCategoryController(req, res);
    return;
});

categoryRoute.post('/admin/categoria', regularlCondicionalRoutes, isAdmin, upload.none(), validateCategory, (req: Request, res: Response) => {
    createCategoryController(req, res);
    return;
});

categoryRoute.put('/admin/categoria/:hash', regularlCondicionalRoutes, isAdmin, upload.none(), validateCategory, (req: Request, res: Response) => {
    changeCategoryController(req, res);
    return;
});

categoryRoute.delete('/admin/categoria/:hash', regularlCondicionalRoutes, isAdmin, (req: Request, res: Response) => {
    deleteCategoryController(req, res);
    return
});

export { categoryRoute };