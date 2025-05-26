import { Request, Response } from 'express';
import { changeProductService, createProductService, deleteProductService, listAllProductsService, listSpecificProductService } from '../../services/product/informationService';
import serverSendingPattern from '../serverSendingPattern';
import { validationResult } from 'express-validator';

export async function listAllProductsController(req: Request, res: Response){
    const products = await listAllProductsService();
    if(products.length == 0){
        serverSendingPattern(res, null, 'Você não possui nenhum produto cadastrado', null, null);
    }
    else{
        serverSendingPattern(res, null, null , null, products);
    }
    return;
}

export async function listSpecificProductController(req: Request, res: Response){
    const productId  = req.params.hash;

    const product = await listSpecificProductService(productId);
    if(product == null){
        serverSendingPattern(res, null, 'Você não possui encontrar o produto', null, null);
    }
    else{
        serverSendingPattern(res, null, null , null, product);
    }
    return;
}

export async function createProductController(req: Request, res: Response){

    const errors:any = validationResult(req);

    if(!errors.isEmpty()){
        serverSendingPattern(res, null, errors.errors[0].msg, null, null);
        return;
    }

    const { name, originalPrice, promotionPrice, categoryId, description } = req.body;
    const { size, quantity } = req.body;
    const { files } = req;

    if(Number(originalPrice) <= Number(promotionPrice)){
        serverSendingPattern(res, null, 'O valor de promoção é maior ou igual ao valor original, isso não é permitido', null, null)
        return;
    }
    else if(size.length !== quantity.length){
        serverSendingPattern(res, null, 'A quantidade de opções e a quantidade fornecida não são iguais', null, null)
        return;
    }

    const returnProduct: string = await createProductService(name, Number(originalPrice), Number(promotionPrice), categoryId, description, size, quantity, files);

    if(returnProduct == 'ok'){
        serverSendingPattern(res, null, null, 'Produto cadastrado', null);
        return;
    }
    else{
        serverSendingPattern(res, null, returnProduct, null, null);
        return;
    }
}

export async function changeProductController(req: Request, res: Response){
    const errors:any = validationResult(req);
    
    if(!errors.isEmpty()){
        serverSendingPattern(res, null, errors.errors[0].msg, null, null);
        return;
    }
    
    const { hash } = req.params;
    const { name, originalPrice, promotionPrice, categoryId, description } = req.body;

    if(Number(originalPrice) <= Number(promotionPrice)){
        serverSendingPattern(res, null, 'O valor de promoção é maior ou igual ao valor original, isso não é permitido', null, null)
        return;
    }

    const returnProduct: string = await changeProductService(hash, name, originalPrice, promotionPrice, categoryId, description);

    if(returnProduct == 'ok'){
        serverSendingPattern(res, null, null, 'Informações do produto alterado', null);
        return;
    }
    else{
        serverSendingPattern(res, null, returnProduct, null, null);
        return;
    }
}

export async function deleteProductController(req: Request, res: Response){
    const { hash } = req.params;

    const returnProduct: string = await deleteProductService(hash);

    if(returnProduct == 'ok'){
        serverSendingPattern(res, null, null, 'Produto deletado', null);
        return;
    }
    else{
        serverSendingPattern(res, null, returnProduct, null, null);
        return;
    }
}