import returnServicePattern from "../returnServicePattern";
import DatabaseManager from "../system/databaseManagerService";

export async function listAllCategoriesService(){
    const returnDbCategories = await DatabaseManager.listAllCategories();

    if(returnDbCategories.length == 0){
        return returnServicePattern(null, true, false, 'Não existe nenhuma categoria cadastrada')
    }

    return returnServicePattern(null, false, true, returnDbCategories)
}


export async function consultNameCategoryService(categoryId: string){
    const returnDbCategoryName = await DatabaseManager.consultNameCategory(categoryId);

    if(returnDbCategoryName == null){
        return returnServicePattern(null, true, false, 'Essa categoria não existe');
    }

    return returnServicePattern(null, false, true, returnDbCategoryName);
}

export async function listAllProductsInCategoryService(categoryId: string){
    const returnDbAllProducts = await DatabaseManager.listAllProductsInCategory(categoryId);

    if(returnDbAllProducts.length == 0){
        return returnServicePattern(null, true, false, 'Não existe nenhum produto nessa categória');
    }
    
    return returnServicePattern(null, false, true, returnDbAllProducts);
}

export async function createCategoryService(categoryName: string){
    const returnDbExistyCagetory: number = await DatabaseManager.verifyExistenceCategory('', categoryName);

    if(returnDbExistyCagetory > 0){
        return returnServicePattern(null, true, false, 'Já existe uma categoria com esse nome');
    }

    const returnDbCategory = await DatabaseManager.createCategory(categoryName);

    if(returnDbCategory == null){
        return returnServicePattern(null, true, false, 'Não foi possível cadstrar a categoria');
    }

    return returnServicePattern(null, false, true, 'Categoria cadastrada');
}

export async function changeCategoryService(categoryId: string, categoryName: string){
    const checkExistyCagetoryName = await DatabaseManager.verifyExistenceCategory('', categoryName);

    if(checkExistyCagetoryName > 0){
        return returnServicePattern(null, true, false, 'Já existe uma categoria com esse nome');
    }

    const checkExistyCagetory = await DatabaseManager.verifyExistenceCategory(categoryId, '');

    if(checkExistyCagetory == 0){
        return returnServicePattern(null, true, false, 'Categoria informada não existe');
    }
        
    const returnDbCategory = await DatabaseManager.changeCategory(categoryId, categoryName);

    if(returnDbCategory == null){
        return returnServicePattern(null, true, false, 'Não foi possível alterar o nome da categoria');
    }

    return returnServicePattern(null, false, true, 'Categoria atualizada');
}

export async function deleteCategoryService(categoryId: string){
    const checkExistyCagetory = await DatabaseManager.verifyExistenceCategory(categoryId);

    if(checkExistyCagetory == 0){
        return returnServicePattern(null, true, false, 'Categoria solicitada não existe');
    }

    const returnDbProducts = await DatabaseManager.listAllProductsInCategory(categoryId);

    if(returnDbProducts.length > 0){
        return returnServicePattern(null, true, false, 'É necessário deletar ou alterar todos os produtos relacionado a essa categoria antes de deleta ela');
    }

    const returnDbCategory = await DatabaseManager.deleteCategory(categoryId);

    if(returnDbCategory == null){
        return returnServicePattern(null, true, false, 'Não foi possível deletar');
    }

    return returnServicePattern(null, false, true, 'Categoria deletada');
}