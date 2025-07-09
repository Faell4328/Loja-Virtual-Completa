import { Request, Response } from 'express';
import { validationResult } from 'express-validator';

import { changeCategoryService, consultNameCategoryService, createCategoryService, deleteCategoryService, listAllCategoriesService, listAllProductsInCategoryService } from '../../services/category/informationService';
import serverSendingPattern from '../serverSendingPattern';

export async function listAllCategoriesController(req: Request, res: Response){
    const returnServiceCategories = await listAllCategoriesService();

    if(returnServiceCategories.error == true){
        serverSendingPattern(res, returnServiceCategories.redirect, returnServiceCategories.data, null, null);
        return;
    }

    serverSendingPattern(res, returnServiceCategories.redirect, null, null, returnServiceCategories.data);
    return;
}

export async function consultNameCategoryController(req: Request, res: Response){
    const { hash } = req.params;
    const returnServiceCategoryName = await consultNameCategoryService(hash);

    if(returnServiceCategoryName.error == true){
        serverSendingPattern(res, returnServiceCategoryName.redirect, returnServiceCategoryName.data, null, null);
        return;
    }

    serverSendingPattern(res, returnServiceCategoryName.redirect, null, null, returnServiceCategoryName.data);
    return;
}

export async function listAllProductsInCategoryController(req: Request, res: Response){
    const { hash } = req.params;
    const returnServiceAllProducts = await listAllProductsInCategoryService(hash);

    if(returnServiceAllProducts.error == true){
        serverSendingPattern(res, returnServiceAllProducts.redirect, returnServiceAllProducts.data, null, null);
        return;
    }
    serverSendingPattern(res, returnServiceAllProducts.redirect, null, null, returnServiceAllProducts.data);
    return
}

export async function createCategoryController(req: Request, res: Response){

    const errors:any = validationResult(req);

    if(!errors.isEmpty()){
        serverSendingPattern(res, null, errors.errors[0].msg, null, null);
        return;
    }

    const categoryName = req.body.name;
    const returnServiceCategory = await createCategoryService(categoryName);

    if(returnServiceCategory.error == true){
        serverSendingPattern(res, returnServiceCategory.redirect, returnServiceCategory.data, null, null);
        return;
    }
    
    serverSendingPattern(res, returnServiceCategory.redirect, null, returnServiceCategory.data, null);
    return;
}

export async function changeCategoryController(req: Request, res: Response){
    
    const errors:any = validationResult(req);

    if(!errors.isEmpty()){
        serverSendingPattern(res, null, errors.errors[0].msg, null, null);
        return;
    }

    const categoryId  = req.params.hash;
    const categoryName = req.body.name;

    const returnServiceCategory = await changeCategoryService(categoryId, categoryName);

    if(returnServiceCategory.error == true){
        serverSendingPattern(res, returnServiceCategory.redirect, returnServiceCategory.data, null, null);
        return;
    }

    serverSendingPattern(res, returnServiceCategory.redirect, null, returnServiceCategory.data, null);
    return;
}

export async function deleteCategoryController(req: Request, res: Response){
    const id  = req.params.hash;

    const returnServiceCategory = await deleteCategoryService(id);

    if(returnServiceCategory.error == true){
        serverSendingPattern(res, returnServiceCategory.redirect, returnServiceCategory.data, null, null);
        return;
    }

    serverSendingPattern(res, returnServiceCategory.redirect, null, returnServiceCategory.data, null);
    return
}