import { deleteImagesLocal } from "../../tools/deleteImagesLocal";
import returnServicePattern from "../returnServicePattern";
import DatabaseManager from "../system/databaseManagerService";

export async function listAllProductsService(){
    const returnDbAllProducts = await DatabaseManager.listAllProducts();
    if(returnDbAllProducts == null || returnDbAllProducts.length == 0){
        return returnServicePattern(null, true, false, 'Você não possui nenhum produto cadastrado');
    }

    return returnServicePattern(null, false, true, returnDbAllProducts);
}

export async function listSpecificProductService(productId: string){
    const returnDbSpecificProduct= await DatabaseManager.listSpecificProduct(productId);

    if(returnDbSpecificProduct == null){
        return returnServicePattern(null, true, false, 'Produto solicitado não existe');
    }

    return returnServicePattern(null, false, true, returnDbSpecificProduct);
}

export async function createProductService(name: string, originalPrice: number, promotionPrice: number, categoryId: string, description: string, homeSession: 'PROMOTION' | 'NEW' | 'REMAINING', option: string | string [], quantity: string | string [], files: any){
    if(await DatabaseManager.verifyExistenceCategory(categoryId) <= 0){
        return returnServicePattern(null, true, false, 'Categoria fornecida não existe');
    }

    const returnDbProduct = await DatabaseManager.createProduct(name, originalPrice, promotionPrice, categoryId, description, homeSession, 'STOCK');
    await DatabaseManager.addOptionProduct(returnDbProduct.id, option, quantity);
    await DatabaseManager.addImagesProduct(returnDbProduct.id, files);

    return returnServicePattern(null, false, true, 'Produto cadastrado');
}

export async function createOptionProductService(productId: string, option: string, quantity: string){
    if(await DatabaseManager.verifyExistenceProduct(productId) <= 0){
        return returnServicePattern(null, true, false, 'Produto fornecido não existe');
    }
    else if(await DatabaseManager.verifyExistenceOptionProductByName(option) != 0){
        return returnServicePattern(null, true, false, 'A opção fornecida já está cadastrado');
    }

    await DatabaseManager.addOptionProduct(productId, option, quantity);

    return returnServicePattern(null, false, true, 'Opção cadastrada');
}

export async function createImageProductService(productId: string, file: any){
    if(await DatabaseManager.verifyExistenceProduct(productId) <= 0){
        return returnServicePattern(null, true, false, 'Produto fornecido não existe');
    }

    const returnDbImagemProduct = await DatabaseManager.addImagesProduct(productId, file);

    if(returnDbImagemProduct == false){
        return returnServicePattern(null, true, false, 'Não foi possível adicionar a imagem');
    }

    return returnServicePattern(null, false, true, 'Imagem cadastrada');
}

export async function changeProductService(productId: string, name: string, originalPrice: number, promotionPrice: number, categoryId: string, description: string){
    if(await DatabaseManager.verifyExistenceCategory(categoryId) <= 0){
        return returnServicePattern(null, true, false, 'Categoria fornecida não existe');
    }

    await DatabaseManager.changeProduct(productId, name, originalPrice, promotionPrice, categoryId, description);
    return returnServicePattern(null, false, true, 'Produto cadastrado');
}

export async function changeOptionProductService(optionId: string, option: string, quantity: number){
    if(await DatabaseManager.verifyExistenceOptionProductById(optionId) <= 0){
        return returnServicePattern(null, true, false, 'A opção fornecida não existe');

    } else if(await DatabaseManager.verifyExistenceOptionProductByName(option) != 0){
        return returnServicePattern(null, true, false, 'A opção fornecida já está cadastrado');
    }

    await DatabaseManager.changeOptionProduct(optionId, option, quantity);
    return returnServicePattern(null, false, true, 'Opção atualizada');
}

export async function changeImagemProductService(imageId: string, file: any){
    const returnDbOldImage = await DatabaseManager.verifyExistenceImageProduct(imageId);
    if(returnDbOldImage == null){
        return returnServicePattern(null, true, false, 'Imagem fornecida não existe');
    }

    const imagemProduct = await DatabaseManager.changeImageProduct(imageId, file);

    if(imagemProduct == false){
        return returnServicePattern(null, true, false, 'Não foi possível alterar a imagem');
    }
    
    deleteImagesLocal(returnDbOldImage);
    return returnServicePattern(null, false, true, 'Imagem atualizada');
}

export async function deleteProductService(productId: string){
    if(await DatabaseManager.verifyExistenceProduct(productId) == 0){
        return returnServicePattern(null, true, false, 'Não é possível deletar o produto, não foi encontrado');
    }

    await DatabaseManager.deleteAllOptionProductById(productId);
    const returnDbImages = await DatabaseManager.deleteAllImagesProductById(productId);
    if(returnDbImages !=null && returnDbImages.length > 1){
        deleteImagesLocal(returnDbImages);
    }

    await DatabaseManager.deleteProductById(productId);
    return returnServicePattern(null, false, true, 'Produto deletado');
}

export async function deleteOptionProductService(optionId: string){
    if(await DatabaseManager.verifyExistenceOptionProductById(optionId) == 0){
        return returnServicePattern(null, true, false, 'Não é possível deletar a opção, não foi encontrado');
    }

    const returnDbOptionProduct = await DatabaseManager.deleteOptionProduct(optionId);

    if(returnDbOptionProduct == false){
        return returnServicePattern(null, true, false, 'Não foi possível deletar a opção');
    }

    return returnServicePattern(null, false, true, 'Opção deletado');
}

export async function deleteImageProductService(imageId: string){
    const retunDbOldImage = await DatabaseManager.verifyExistenceImageProduct(imageId);
    if(retunDbOldImage == null){
        return returnServicePattern(null, true, false, 'Não foi possível deletar a imagem, não foi encontrado');
    }

    const returnDbImageProduct = await DatabaseManager.deleteImageProductById(imageId);

    if(returnDbImageProduct == false){
        return returnServicePattern(null, true, false, 'Não foi possível deletar a imagem');
    }

    deleteImagesLocal(returnDbImageProduct);
    return returnServicePattern(null, false, true, 'Opção deletado');
}