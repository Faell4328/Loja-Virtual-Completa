import { Request, Response } from 'express';
import { changeImagemProductService, changeProductService, changeSizeProductService, createImageProductService, createProductService, createSizeProductService, deleteImageProductService, deleteProductService, deleteSizeProductService, listAllProductsService, listSpecificProductService } from '../../services/product/informationService';
import serverSendingPattern from '../serverSendingPattern';
import { validationResult } from 'express-validator';
import { deleteImagesLocal } from '../../tools/deleteImagesLocal';

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
        if(req.files !== undefined && req.files?.length){
            deleteImagesLocal(req.files);
        }
        serverSendingPattern(res, null, errors.errors[0].msg, null, null)
        return;
    }

    const { name, originalPrice, promotionPrice, categoryId, description } = req.body;
    const { size, quantity } = req.body;
    const { files } = req;

    if(Number(originalPrice) <= Number(promotionPrice)){
        deleteImagesLocal(files);
        serverSendingPattern(res, null, 'O valor de promoção é maior ou igual ao valor original, isso não é permitido', null, null);
        return;
    }
    else if(Array.isArray(size) && Array.isArray(quantity) && size.length !== quantity.length){
        deleteImagesLocal(files);
        serverSendingPattern(res, null, 'A quantidade de opções e a quantidade fornecida não são iguais', null, null);
        return;
    }

    const returnProduct: string = await createProductService(name, Number(originalPrice), Number(promotionPrice), categoryId, description, size, quantity, files);

    if(returnProduct == 'ok'){
        serverSendingPattern(res, null, null, 'Produto cadastrado', null);
        return;
    }
    else{
        deleteImagesLocal(files);
        serverSendingPattern(res, null, returnProduct, null, null);
        return;
    }
}

export async function createSizeProductController(req: Request, res: Response){
    const { hash } = req.params;
    const { size, quantity } = req.body;

    if(Array.isArray(size) && Array.isArray(quantity) && size.length !== quantity.length){
        serverSendingPattern(res, null, 'A quantidade de opções e a quantidade fornecida não são iguais', null, null)
        return;
    }

    const returnSizeProduct: string = await createSizeProductService(hash, size, quantity);

    if(returnSizeProduct == 'ok'){
        serverSendingPattern(res, null, null, 'Opção cadastrado', null);
        return;
    }
    else{
        serverSendingPattern(res, null, returnSizeProduct, null, null);
        return;
    }
}

export async function createImageProductController(req: Request, res: Response){

    const errors:any = validationResult(req);

    if(!errors.isEmpty()){
        if(req.file !== undefined){
            deleteImagesLocal(req.files);
        }
        serverSendingPattern(res, null, errors.errors[0].msg, null, null)
        return;
    }

    const { hash } = req.params;
    const file = req.file;

    const returnImageProduct: string = await createImageProductService(hash, file);

    if(returnImageProduct == 'ok'){
        serverSendingPattern(res, null, null, 'Imagem cadastrada', null);
        return;
    }
    else{
        deleteImagesLocal(file);
        serverSendingPattern(res, null, returnImageProduct, null, null);
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

export async function changeSizeProductController(req: Request, res: Response){
    const errors:any = validationResult(req);
    
    if(!errors.isEmpty()){
        serverSendingPattern(res, null, errors.errors[0].msg, null, null);
        return;
    }
    
    const { hash } = req.params;
    const { size, quantity } = req.body;

    if(Array.isArray(size) && Array.isArray(quantity) && size.length !== quantity.length){
        serverSendingPattern(res, null, 'A quantidade de opções e a quantidade fornecida não são iguais', null, null)
        return;
    }

    const returnProduct: string = await changeSizeProductService(hash, size, quantity);

    if(returnProduct == 'ok'){
        serverSendingPattern(res, null, null, 'A opção do produto foi alterado', null);
        return;
    }
    else{
        serverSendingPattern(res, null, returnProduct, null, null);
        return;
    }
}

export async function changeImagemProductController(req: Request, res: Response){
    const errors:any = validationResult(req);

    if(!errors.isEmpty()){
        if(req.file !== undefined){
            deleteImagesLocal(req.files);
        }
        serverSendingPattern(res, null, errors.errors[0].msg, null, null)
        return;
    }

    const { hash } = req.params;
    const file = req.file;

    const returnProduct: string = await changeImagemProductService(hash, file);

    if(returnProduct == 'ok'){
        serverSendingPattern(res, null, null, 'Imagem foi alterada', null);
        return;
    }
    else{
        deleteImagesLocal(file);
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

export async function deleteSizeProductController(req: Request, res: Response){
    const { hash } = req.params;

    const returnSizeProduct: string = await deleteSizeProductService(hash);

    if(returnSizeProduct == 'ok'){
        serverSendingPattern(res, null, null, 'A opção do produto foi deletada', null);
        return;
    }
    else{
        serverSendingPattern(res, null, returnSizeProduct, null, null);
        return;
    }
}

export async function deleteImageProductController(req: Request, res: Response){
    const { hash } = req.params;

    const returnImagemProduct: string = await deleteImageProductService(hash);

    if(returnImagemProduct == 'ok'){
        serverSendingPattern(res, null, null, 'Imagem do produto deletada', null);
        return;
    }
    else{
        serverSendingPattern(res, null, returnImagemProduct, null, null);
        return;
    }
}