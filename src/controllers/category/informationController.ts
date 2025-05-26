import { Request, Response } from 'express';
import { validationResult } from 'express-validator';

import { changeCategoryService, createCategoryService, deleteCategoryService, listAllCategoriesService, listAllProductsInCategoryService } from '../../services/category/informationService';
import serverSendingPattern from '../serverSendingPattern';

export async function listAllCategoriesController(req: Request, res: Response){
    const categories = await listAllCategoriesService()
    if(categories.length == 0){
        serverSendingPattern(res, null, 'Você não possui nenhuma categoria cadastrada', null, null);
    }
    else{
        serverSendingPattern(res, null, null , null, categories);
    }
    return;
}

export async function listAllProductsInCategoryController(req: Request, res: Response){
    const { hash } = req.params;
    const categoryProduct = await listAllProductsInCategoryService(hash);

    if(categoryProduct == false){
        serverSendingPattern(res, null, 'Não existe nenhum produto nessa categória', null, null);
    }
    else{
        serverSendingPattern(res, null, null, null, categoryProduct);
    }

    return
}

export async function createCategoryController(req: Request, res: Response){

    const errors:any = validationResult(req);

    if(!errors.isEmpty()){
        serverSendingPattern(res, null, errors.errors[0].msg, null, null);
        return;
    }

    const { name: categoryName } = req.body;

    const category = await createCategoryService(categoryName);

    if(category == 'Já existe uma categoria com esse nome'){
        serverSendingPattern(res, null, 'Já existe uma categoria com esse nome', null, null);
    }
    else if(category.id !== undefined){
        serverSendingPattern(res, null, null, 'Categoria cadastrada', null);
    }
    else{
        serverSendingPattern(res, null, 'Não foi possui cadastrar a categoria', null, null);
    }

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

    const category = await changeCategoryService(categoryId, categoryName);

    if(category == 'Não foi possível alterar, a categória enviada não existe'){
        serverSendingPattern(res, null, 'Categoria escolhida não existe', null, null);
    }
    else if(category.id !== undefined){
        serverSendingPattern(res, null, null, 'Categoria atualizada', null);
    }
    else{
        serverSendingPattern(res, null, 'Não foi possui atualizar a categoria', null, null);
    }
    
    return;
}

export async function deleteCategoryController(req: Request, res: Response){
    const id  = req.params.hash;

    const category = await deleteCategoryService(id);

    if(category == 'Não foi possível deletar, a categória enviada não existe'){
        serverSendingPattern(res, null, 'Não foi possível deletar, a categória enviada não existe', null, null);
    }
    else if(category.id !== undefined){
        serverSendingPattern(res, null, null, 'Categoria deletada', null);
    }
    else{
        serverSendingPattern(res, null, 'Não foi possui deletar a categoria', null, null);
    }
    
    return;
}