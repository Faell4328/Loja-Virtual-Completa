import { deleteImagesLocal } from "../../tools/deleteImagesLocal";
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

    const product = await DatabaseManager.createProduct(name, originalPrice, promotionPrice, categoryId, description, 'STOCK');
    await DatabaseManager.addSizeProduct(product.id, size, quantity);
    await DatabaseManager.addImagesProduct(product.id, files);

    return 'ok';
}

export async function createSizeProductService(productId: string, size: string, quantity: string){
    if(await DatabaseManager.verifyExistenceProduct(productId) <= 0){
        return 'Produto fornecido não existe'; 
    }
    else if(await DatabaseManager.verifyExistenceSizeProductByName(size) != 0){
        return 'A opção fornecida já está cadastrado'; 
    }

    await DatabaseManager.addSizeProduct(productId, size, quantity);

    return 'ok';
}

export async function createImageProductService(productId: string, file: any){
    if(await DatabaseManager.verifyExistenceProduct(productId) <= 0){
        return 'Produto fornecido não existe'; 
    }

    let imagemProduct = await DatabaseManager.addImagesProduct(productId, file);

    if(imagemProduct == false){
        return 'Não foi possível cadastrar';
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

export async function changeSizeProductService(sizeId: string, size: string, quantity: number){
    if(await DatabaseManager.verifyExistenceSizeProductById(sizeId) <= 0){
        return 'A opção fornecida já está cadastrado'; 
    }

    await DatabaseManager.changeSizeProduct(sizeId, size, quantity);
    return 'ok';
}

export async function changeImagemProductService(imageId: string, file: any){
    const oldImage = await DatabaseManager.verifyExistenceImageProduct(imageId);
    if(oldImage == null){
        return 'Imagem fornecida não existe'; 
    }

    const imagemProduct = await DatabaseManager.changeImageProduct(imageId, file);

    if(imagemProduct == false){
        return 'Não foi possível alterar a imagem';
    }
    
    deleteImagesLocal(oldImage);
    return 'ok';
}

export async function deleteProductService(productId: string){
    if(await DatabaseManager.verifyExistenceProduct(productId) == 0){
        return 'Não é possível deletar o produto, não foi encontrado'; 
    }

    await DatabaseManager.deleteAllSizeProduct(productId);
    const images = await DatabaseManager.deleteAllImagesProduct(productId);
    deleteImagesLocal(images);

    await DatabaseManager.deleteProduct(productId);
    return 'ok';
}

export async function deleteSizeProductService(sizeId: string){
    if(await DatabaseManager.verifyExistenceSizeProductById(sizeId) == 0){
        return 'Não é possível deletar a opção, não foi encontrado'; 
    }

    const sizeProduct = await DatabaseManager.deleteSizeProduct(sizeId);

    if(sizeProduct == false){
        return 'Não foi possível deletar a opção';
    }

    return 'ok';
}

export async function deleteImageProductService(imageId: string){
    const oldImage = await DatabaseManager.verifyExistenceImageProduct(imageId);
    if(oldImage == null){
        return 'Não é possível deletar a imagem, não foi encontrado'; 
    }

    const imageProduct = await DatabaseManager.deleteImageProduct(imageId);

    if(imageProduct == false){
        return 'Não foi possível deletar a imagem';
    }

    deleteImagesLocal(imageProduct);
    return 'ok';
}