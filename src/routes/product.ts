import { Request, Response, Router } from 'express';
import multer from 'multer';

import uploadConfig from '../config/multer';
import isAdmin from '../middlewares/isAdmin';
import { regularlCondicionalRoutes } from '../middlewares/condicionalRoutes';
import { changeImagemProductController, changeProductController, changeOptionProductController, createImageProductController, createProductController, createOptionProductController, deleteImageProductController, deleteProductController, deleteOptionProductController, listAllProductsController, listSpecificProductController, searchProductController } from '../controllers/product/informationController';
import { validateChangedProduct, validateOptionProduct, validateCreatedProduct, validateFile } from '../middlewares/validatorInput';

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

productRoute.get('/produto/procurar/:value', regularlCondicionalRoutes, (req: Request, res: Response) => {
    searchProductController(req, res);
    return;
});

productRoute.post('/admin/produto', regularlCondicionalRoutes, isAdmin, upload.array('files'), validateCreatedProduct, (req: Request, res: Response) => {
    createProductController(req, res);
    return;
});

productRoute.post('/admin/produto/opcao/:hash', regularlCondicionalRoutes, isAdmin, validateOptionProduct, (req: Request, res: Response) => {
    createOptionProductController(req, res);
    return;
});

productRoute.post('/admin/produto/imagem/:hash', regularlCondicionalRoutes, isAdmin, upload.single('file'), validateFile, (req: Request, res: Response) => {
    createImageProductController(req, res);
    return;
});

productRoute.put('/admin/produto/:hash', regularlCondicionalRoutes, isAdmin, validateChangedProduct, (req: Request, res: Response) => {
    changeProductController(req, res);
    return;
});

productRoute.put('/admin/produto/opcao/:hash',regularlCondicionalRoutes, isAdmin, validateOptionProduct, (req: Request, res: Response) => {
    changeOptionProductController(req, res);
    return;
});

productRoute.put('/admin/produto/imagem/:hash', regularlCondicionalRoutes, isAdmin, upload.single('file'), validateFile, (req: Request, res: Response) => {
    changeImagemProductController(req, res);
    return;
});


productRoute.delete('/admin/produto/:hash', regularlCondicionalRoutes, isAdmin, (req: Request, res: Response) => {
    deleteProductController(req, res);
    return
});


productRoute.delete('/admin/produto/opcao/:hash', regularlCondicionalRoutes, isAdmin, (req: Request, res: Response) => {
    deleteOptionProductController(req, res);
    return
});

productRoute.delete('/admin/produto/imagem/:hash', (req: Request, res: Response) => {
    deleteImageProductController(req, res);
    return
});

export { productRoute };