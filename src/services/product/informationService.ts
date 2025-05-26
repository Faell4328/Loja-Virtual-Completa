import DatabaseManager from "../system/databaseManagerService";

export async function listAllProductsService(){
    const categories = await DatabaseManager.listAllProducts();
    return categories;
}

export async function listSpecificProductService(productId: string){
    const categories = await DatabaseManager.listSpecificProduct(productId);
    return categories;
}

export async function createProductService(name: string, originalPrice: number, promotionPrice: number, categoryId: string, description: string, size: string | string [], quantity: string | string [], files: any){
    if(await DatabaseManager.verifyExistenceCategory(categoryId) <= 0){
        return 'Categoria fornecida não existe'; 
    }

    const product = await DatabaseManager.createProduct(name, originalPrice, promotionPrice, categoryId, description, files[0].filename, 'STOCK');
    await DatabaseManager.addSizeProduct(size, quantity, product.id);
    if(files.length > 1){
        await DatabaseManager.addImagesProdut(files, product.id);
    }

    return 'ok';
}

export async function changeProductService(productId: string, name: string, originalPrice: number, promotionPrice: number, categoryId: string, description: string){
    if(await DatabaseManager.verifyExistenceCategory(categoryId) <= 0){
        return 'Categoria fornecida não existe'; 
    }

    await DatabaseManager.changeProduct(productId, name, originalPrice, promotionPrice, categoryId, description);
    return 'ok';
}

export async function deleteProductService(productId: string){
    if(await DatabaseManager.verifyExistenceProduct(productId) == 0){
        return 'Não é possível deletar o produto, não foi encontrado'; 
    }

    Promise.all([
        DatabaseManager.deleteSize(productId),
        DatabaseManager.deleteImages(productId)
    ]);
    await DatabaseManager.deleteProduct(productId);
    return 'ok';
}