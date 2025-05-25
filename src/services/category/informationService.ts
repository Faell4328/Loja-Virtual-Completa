import DatabaseManager from "../system/databaseManagerService";

export async function listAllCategoriesService(){
    const categories = await DatabaseManager.listAllCategories();
    return categories;
}

export async function createCategoriesService(categoryName: string){
    const category = await DatabaseManager.createCategory(categoryName);

    if(category == false){
        return 'Já existe uma categoria com esse nome';
    }

    return category;
}

export async function changeCategoryService(id: string, name: string){
    const category = await DatabaseManager.changeCategory(id, name);

    if(category == false){
        return 'Não foi possível alterar, a categória enviada não existe';
    }

    return category;
}

export async function deleteCategoryService(id: string){
    const category = await DatabaseManager.deleteCategory(id);

    if(category == false){
        return 'Não foi possível deletar, a categória enviada não existe';
    }

    return category;
}