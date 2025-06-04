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

export async function createProductService(name: string, originalPrice: number, promotionPrice: number, categoryId: string, description: string, option: string | string [], quantity: string | string [], files: any){
    if(await DatabaseManager.verifyExistenceCategory(categoryId) <= 0){
        return 'Categoria fornecida não existe'; 
    }

    const product = await DatabaseManager.createProduct(name, originalPrice, promotionPrice, categoryId, description, 'STOCK');
    await DatabaseManager.addoptionProduct(product.id, option, quantity);
    await DatabaseManager.addImagesProduct(product.id, files);

    return 'ok';
}

export async function createOptionProductService(productId: string, option: string, quantity: string){
    if(await DatabaseManager.verifyExistenceProduct(productId) <= 0){
        return 'Produto fornecido não existe'; 
    }
    else if(await DatabaseManager.verifyExistenceOptionProductByName(option) != 0){
        return 'A opção fornecida já está cadastrado'; 
    }

    await DatabaseManager.addoptionProduct(productId, option, quantity);

    return 'ok';
}

export async function createImageProductService(productId: string, file: any){
    if(await DatabaseManager.verifyExistenceProduct(productId) <= 0){
        return 'Produto fornecido não existe'; 
    }

    let imagemProduct = await DatabaseManager.addImagesProduct(productId, file);

    if(imagemProduct == false){
        return 'Não foi possível adicionar a imagem';
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

export async function changeOptionProductService(optionId: string, option: string, quantity: number){
    if(await DatabaseManager.verifyExistenceOptionProductById(optionId) <= 0){
        return 'A opção fornecida não existe'; 
    } else if(await DatabaseManager.verifyExistenceOptionProductByName(option) != 0){
        return 'A opção fornecida já está cadastrado'; 
    }

    await DatabaseManager.changeOptionProduct(optionId, option, quantity);
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

    await DatabaseManager.deleteAllOptionProductById(productId);
    const images = await DatabaseManager.deleteAllImagesProductById(productId);
    if(images !=null && images.length > 1){
        deleteImagesLocal(images);
    }

    await DatabaseManager.deleteProductById(productId);
    return 'ok';
}

export async function deleteOptionProductService(optionId: string){
    if(await DatabaseManager.verifyExistenceOptionProductById(optionId) == 0){
        return 'Não é possível deletar a opção, não foi encontrado'; 
    }

    const optionProduct = await DatabaseManager.deleteOptionProduct(optionId);

    if(optionProduct == false){
        return 'Não foi possível deletar a opção';
    }

    return 'ok';
}

export async function deleteImageProductService(imageId: string){
    const oldImage = await DatabaseManager.verifyExistenceImageProduct(imageId);
    if(oldImage == null){
        return 'Não é possível deletar a imagem, não foi encontrado'; 
    }

    const imageProduct = await DatabaseManager.deleteImageProductById(imageId);

    if(imageProduct == false){
        return 'Não foi possível deletar a imagem';
    }

    deleteImagesLocal(imageProduct);
    return 'ok';
}