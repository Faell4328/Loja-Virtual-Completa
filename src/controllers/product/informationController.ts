import { Request, Response } from 'express';
import { changeImagemProductService, changeProductService, changeOptionProductService, createImageProductService, createProductService, createOptionProductService, deleteImageProductService, deleteProductService, deleteOptionProductService, listAllProductsService, listSpecificProductService, searchProductService } from '../../services/product/informationService';
import serverSendingPattern from '../serverSendingPattern';
import { validationResult } from 'express-validator';
import { deleteImagesLocal } from '../../tools/deleteImagesLocal';

export async function listAllProductsController(req: Request, res: Response){
    if(req.query.session !== undefined  && req.query.session !== "promocao" && req.query.session !== "novidade" && req.query.session !== "destaque"){
        serverSendingPattern(res, null, "A query 'session', está com parâmetro inválido", null, null);
        return;
    }
    else if(req.query.page !== undefined && isNaN(Number(req.query.page)) || Number(req.query.page) <= 0){
        serverSendingPattern(res, null, "A query 'page', está com parâmetro inválido (apenas número positivo, ex: 1, 2, ...)", null, null);
        return;
    }

    let session: "PROMOTION" | "NEW" | "HIGHLIGHTS" | undefined;
    switch(req.query.session){
        case "promocao":
            session = "PROMOTION"
            break;
        case "novidade":
            session = "NEW"
            break;
        case "destaque":
            session = "HIGHLIGHTS"
            break;
    }

    let page = undefined;
    
    if(req.query.page != undefined && !isNaN(Number(req.query.page))){
        page = Number(req.query.page)
    }

    const returnServiceAllProducts = await listAllProductsService(session, page);
    
    if(returnServiceAllProducts.error == true){
        serverSendingPattern(res, returnServiceAllProducts.redirect, returnServiceAllProducts.data, null, null);
        return;
    }

    serverSendingPattern(res, returnServiceAllProducts.redirect, null, null, returnServiceAllProducts.data);
    return;
}

export async function listSpecificProductController(req: Request, res: Response){
    const productId  = req.params.hash;

    const returnServiceSpecificProduct = await listSpecificProductService(productId);

    if(returnServiceSpecificProduct.error == true){
        serverSendingPattern(res, returnServiceSpecificProduct.redirect, returnServiceSpecificProduct.data, null, null);
        return;
    }
    
    serverSendingPattern(res, returnServiceSpecificProduct.redirect, null, null, returnServiceSpecificProduct.data);
    return;
}

export async function searchProductController(req: Request, res: Response){
    const value = req.params.value;

    if(!value){
        serverSendingPattern(res, null, "Não foi enviado nada na consulta", null, null);
        return
    }

    const returnSearchProduct = await searchProductService(value);

    serverSendingPattern(res, returnSearchProduct.redirect, null, null, returnSearchProduct.data);
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

    const { name, originalPrice, promotionPrice, categoryId, description, homeSession } = req.body;
    const { option, quantity } = req.body;
    const { files } = req;

    if((Array.isArray(option) || Array.isArray(quantity)) && (!Array.isArray(option) || !Array.isArray(quantity))){
        deleteImagesLocal(files);
        serverSendingPattern(res, null, 'A quantidade de opções e a quantidade fornecida não são iguais', null, null);
        return;
    }
    else if((Array.isArray(option) && Array.isArray(quantity)) && option.length !== quantity.length){
        deleteImagesLocal(files);
        serverSendingPattern(res, null, 'A quantidade de opções e a quantidade fornecida não são iguais', null, null);
        return;
    }
    else if(Number(originalPrice) <= Number(promotionPrice)){
        deleteImagesLocal(files);
        serverSendingPattern(res, null, 'O valor de promoção é maior ou igual ao valor original, isso não é permitido', null, null);
        return;
    }

    const returnServiceProduct = await createProductService(name, Number(originalPrice), Number(promotionPrice), categoryId, description, homeSession, option, quantity, files);

    if(returnServiceProduct.error == true){
        deleteImagesLocal(files);
        serverSendingPattern(res, returnServiceProduct.redirect, returnServiceProduct.data, null, null);
        return;
    }
    
    serverSendingPattern(res, returnServiceProduct.redirect, null, returnServiceProduct.data, null);
    return;
}

export async function createOptionProductController(req: Request, res: Response){
    const { hash } = req.params;
    const { option, quantity } = req.body;

    if(Array.isArray(option) && Array.isArray(quantity) && option.length !== quantity.length){
        serverSendingPattern(res, null, 'A quantidade de opções e a quantidade fornecida não são iguais', null, null)
        return;
    }

    const returnServiceOptionProduct = await createOptionProductService(hash, option, quantity);

    if(returnServiceOptionProduct.error == true){
        serverSendingPattern(res, returnServiceOptionProduct.redirect, returnServiceOptionProduct.data, null, null);
        return;
    }
    else{
        serverSendingPattern(res, returnServiceOptionProduct.redirect, null, returnServiceOptionProduct.data, null);
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

    const returnServiceImageProduct = await createImageProductService(hash, file);

    if(returnServiceImageProduct.error == true){
        deleteImagesLocal(file);
        serverSendingPattern(res, returnServiceImageProduct.redirect, returnServiceImageProduct.data, null, null);
        return;
    }
    else{
        serverSendingPattern(res, returnServiceImageProduct.redirect, null, returnServiceImageProduct.data, null);
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

    const returnServiceProduct = await changeProductService(hash, name, originalPrice, promotionPrice, categoryId, description);

    if(returnServiceProduct.error == true){
        serverSendingPattern(res, returnServiceProduct.redirect, returnServiceProduct.data, null, null);
        return;
    }
    else{
        serverSendingPattern(res, returnServiceProduct.redirect, null, returnServiceProduct.data, null);
        return;
    }
}

export async function changeOptionProductController(req: Request, res: Response){
    const errors:any = validationResult(req);
    
    if(!errors.isEmpty()){
        serverSendingPattern(res, null, errors.errors[0].msg, null, null);
        return;
    }
    
    const { hash } = req.params;
    const { option, quantity } = req.body;

    if(Array.isArray(option) && Array.isArray(quantity) && option.length !== quantity.length){
        serverSendingPattern(res, null, 'A quantidade de opções e a quantidade fornecida não são iguais', null, null)
        return;
    }

    const returnServiceProduct = await changeOptionProductService(hash, option, quantity);

    if(returnServiceProduct.error == true){
        serverSendingPattern(res, returnServiceProduct.redirect, returnServiceProduct.data, null, null);
        return;
    }
    else{
        serverSendingPattern(res, returnServiceProduct.redirect, null, returnServiceProduct.data, null);
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

    const returnServiceProduct = await changeImagemProductService(hash, file);

    if(returnServiceProduct.error == true){
        deleteImagesLocal(file);
        serverSendingPattern(res, returnServiceProduct.redirect, returnServiceProduct.data, null, null);
        return;
    }
    else{
        serverSendingPattern(res, returnServiceProduct.redirect, null, returnServiceProduct.data, null);
        return;
    }
}

export async function deleteProductController(req: Request, res: Response){
    const { hash } = req.params;

    const returnServiceProduct = await deleteProductService(hash);

    if(returnServiceProduct.error == true){
        serverSendingPattern(res, returnServiceProduct.redirect, returnServiceProduct.data, null, null);
        return;
    }
    else{
        serverSendingPattern(res, returnServiceProduct.redirect, null, returnServiceProduct.data, null);
        return;
    }
}

export async function deleteOptionProductController(req: Request, res: Response){
    const { hash } = req.params;

    const returnServiceOptionProduct = await deleteOptionProductService(hash);

    if(returnServiceOptionProduct.error == true){
        serverSendingPattern(res, returnServiceOptionProduct.redirect, returnServiceOptionProduct.data, null, null);
        return;
    }
    else{
        serverSendingPattern(res, returnServiceOptionProduct.redirect, null, returnServiceOptionProduct.data, null);
        return;
    }
}

export async function deleteImageProductController(req: Request, res: Response){
    const { hash } = req.params;

    const returnDbImagemProduct = await deleteImageProductService(hash);

    if(returnDbImagemProduct.error == true){
        serverSendingPattern(res, returnDbImagemProduct.redirect, returnDbImagemProduct.data, null, null);
        return;
    }
    else{
        serverSendingPattern(res, returnDbImagemProduct.redirect, null, returnDbImagemProduct.data, null);
        return;
    }
}