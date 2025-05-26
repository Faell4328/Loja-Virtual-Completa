import { Request, Response, Router } from 'express';
import multer from 'multer';

import uploadConfig from '../config/multer';
import isAdmin from '../middlewares/isAdmin';
import { regularlCondicionalRoutes } from '../middlewares/condicionalRoutes';
import { changeProductController, createProductController, deleteProductController, listAllProductsController, listSpecificProductController } from '../controllers/product/informationController';
import { validateChangedProduct, validateCreatedProduct } from '../middlewares/validatorInput';

const productRoute = Router();
const upload = multer(uploadConfig.upload(false, '/product'));

productRoute.get('/produtos', regularlCondicionalRoutes, (req: Request, res: Response) => {
    listAllProductsController(req, res);
    return;
});

productRoute.get('/produto/:hash', regularlCondicionalRoutes, (req: Request, res: Response) => {
    listSpecificProductController(req, res);
    return;
});

productRoute.post('/produto', regularlCondicionalRoutes, isAdmin, upload.array('file'), validateCreatedProduct, (req: Request, res: Response) => {
    createProductController(req, res);
    return;
});

productRoute.put('/produto/:hash', regularlCondicionalRoutes, isAdmin, upload.none(), validateChangedProduct, (req: Request, res: Response) => {
    changeProductController(req, res);
    return;
});

productRoute.put('/produto/tamanho/:hash', (req: Request, res: Response) => {
});

productRoute.put('/produto/imagem/:hash', (req: Request, res: Response) => {
});


productRoute.delete('/produto/:hash', regularlCondicionalRoutes, isAdmin, (req: Request, res: Response) => {
    deleteProductController(req, res);
    return
});


productRoute.delete('/produto/tamanho/:hash', (req: Request, res: Response) => {
});

productRoute.delete('/produto/imagem/:hash', (req: Request, res: Response) => {
});

export { productRoute };