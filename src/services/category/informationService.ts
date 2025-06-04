import DatabaseManager from "../system/databaseManagerService";

export async function listAllCategoriesService(){
    const categories = await DatabaseManager.listAllCategories();
    return categories;
}


export async function consultNameCategoryService(categoryId: string){
    const category = await DatabaseManager.consultNameCategory(categoryId);
    if(category != null){
        return category;
    }

    return false;
}

export async function listAllProductsInCategoryService(categoryId: string){
    const categoryProducts = await DatabaseManager.listAllProductsInCategory(categoryId);
    if(categoryProducts.length > 0){
        return categoryProducts;
    }

    return false;
}

export async function createCategoryService(categoryName: string){
    const category = await DatabaseManager.createCategory(categoryName);

    if(category == false){
        return 'Já existe uma categoria com esse nome';
    }

    return category;
}

export async function changeCategoryService(categoryId: string, categoryName: string){
    let existyCagetory: number = await DatabaseManager.verifyExistenceCategory('', categoryName);

    if(existyCagetory > 0){
        return 'Já existe um categoria com esse nome';
    }

    existyCagetory = await DatabaseManager.verifyExistenceCategory(categoryId, '');

    if(existyCagetory != 1){
        return 'Categoria informada não existe';
    }
        
    const category = await DatabaseManager.changeCategory(categoryId, categoryName);

    if(category == null){
        return 'Não foi possível alterar o nome da categoria';
    }

    return category;
}

export async function deleteCategoryService(categoryId: string){
    const products = await DatabaseManager.listAllProductsInCategory(categoryId);

    if(products.length > 0){
        return 'É necessário deletar ou alterar todos os produtos relacionado a essa categoria antes de deleta ela';
    }

    const category = await DatabaseManager.deleteCategory(categoryId);

    if(category == false){
        return 'Não foi possível deletar, a categória enviada não existe';
    }

    return category;
}