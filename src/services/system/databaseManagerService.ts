import prismaClient from "../../prisma";
import crypto from 'crypto';
import { statusSystem, setStatus } from "../../tools/status";
export default class DatabaseManager{

    static async checkStatusSystem(){
        const quantidade = await prismaClient.systemConfig.count({ where: { id: 1 } })
        if(quantidade == 0){
            return;
        }

        const status = await prismaClient.systemConfig.findMany({
            where: { id: 1 },
            select: { statusSystem: true }
        })
        if(status == null){
            throw new Error('status connot be checked')
        }
        setStatus(status[0].statusSystem)
        return;
    }

    static async addSystemConfiguration(nameStore: string, fileSoon: string){
        await prismaClient.systemConfig.create({ data: { nameStore, fileSoon, statusSystem, creationDate: new Date() } })
    }

    static async createUserAdmin(name: string, email: string, phone: string, hashPassword: string){
        const userAdmin = await prismaClient.user.create({
            data: {name, email, phone, password: hashPassword, role: 'ADMIN'}
        })
        await prismaClient.systemConfig.update({
            where: {id: 1},
            data: { statusSystem }
        });

        if(!userAdmin) console.log('erro ao salvar');
        return;
    }

    static async createUser(name: string, email: string, phone: string, hashPassword: string){
        try{
            const user = await prismaClient.user.create({
                data: {name, email, phone, password: hashPassword}
            })

            if(!user) console.log('erro ao salvar');
            return;
        }
        catch(error){
            console.log(error);
        }
    }

    static async createEmailToken(email: string){
        const date = new Date();
        date.setMinutes(date.getMinutes() + 5);
        let hash = crypto.randomBytes(64).toString('hex');
        const createEmailToken = await prismaClient.user.update({
            where: { email },
            data: { emailConfirmationToken: hash, emailConfirmationTokenExpirationDate: date },
        });

        if(!createEmailToken) console.log('erro ao criar o token de login');
        return hash;
    }

    static async checkEmailToken(hash :string){
        let user = await prismaClient.user.findUnique({
            where: { emailConfirmationToken: hash }
        });
        return user;
    }

    static async tokenEmailConfirmed(userId: string){
        await prismaClient.user.update({
            where: { id: userId,},
            data: { emailConfirmationToken:null, emailConfirmationTokenExpirationDate: null, status: 'OK' }
        });
        return true;
    }


    static async passwordRecovery(email: string){
        const date = new Date();
        date.setMinutes(date.getMinutes() + 5);
        let hash = crypto.randomBytes(64).toString('hex');

        let token = await prismaClient.user.update({
            where: { email },
            data: { resetPasswordToken: hash, resetPasswordTokenExpirationDate: date },
            select: { resetPasswordToken: true }
        })

        if(!token) console.log('erro ao criar o token de login');
        return hash;
    }

    static async checkPasswordRecovery(hash: string){
        let user = await prismaClient.user.findUnique({
            where: { resetPasswordToken: hash }
        });

        return user;
    }

    static async passwordRecoveryConfirmed(userId: string, newHashPassword: string){
        await prismaClient.user.update({
            where: { id: userId,},
            data: { password: newHashPassword, resetPasswordToken:null, resetPasswordTokenExpirationDate:null }
        });
        return true;
    }

    static async login (email: string, hashPassword: string){
        const date = new Date();
        date.setDate(date.getDate() + 20);
        let hash = crypto.randomBytes(64).toString('hex');
        const createLoginToken = await prismaClient.user.update({
            where: { email, password: hashPassword },
            data: { loginToken: hash, loginTokenExpirationDate: date },
            select: { role: true, loginToken: true, loginTokenExpirationDate: true }
        });

        if(!createLoginToken) console.log('erro ao criar o token de login');
        return createLoginToken;
    }

    static async logOut(userId: string){
        const user = await prismaClient.user.update({
            where: { id: userId },
            data: { loginToken: null, loginTokenExpirationDate: null },
            select: { id: true }
        });

        return user;
    }

    static async validateLoginToken(token: string){
        return await prismaClient.user.findUnique({
            where: { loginToken: token }
        });
    }

    static async consultByEmail(email: string){
        let user = await prismaClient.user.findUnique({
            where: { email }
        });
        return user;
    }
    
    static async consultByLoginToken(token: string){
        let user = await prismaClient.user.findUnique({
            where: { loginToken: token }
        });
        return user;
    }

    static async checkExistingAddress(userId: string){
        const count = await prismaClient.address.count({
            where: { usersId: userId }
        });

        return (count == 0) ? false : true;
    }

    static async listInformationUser(userId: string){

        const userInformation = await prismaClient.user.findUnique({
            where: { id: userId },
            select: { id: true, name: true, email: true, phone: true, role: true, status: true }
        });

        if(userInformation == null) return null;

        const addressQuantity = await this.checkExistingAddress(userId);
        if(addressQuantity== false) return {userInformation};

        const userAddress = await this.listInformationAddress(userId);

        return { userInformation, userAddress };
    }

    static async listInformationAddress(userId: string){

        const userAddress = await prismaClient.user.findUnique({
            where: { id: userId },
            include: { address: {
                select: { description: true, street: true, number: true, neighborhood: true, zipCode: true, city: true, state: true, complement: true }
            }}
        });

        return userAddress;
    }

    static async updateUserInformation(userId: string, name: string, phone: string){
        await prismaClient.user.update({
            where: { id: userId },
            data: { name, phone }
        });

        return true;
    }

    static async updateUserAddressInformation(userId: string, description: string, street: string, number: string, neighborhood: string, zipCode: string, city: string, state: string, complement: string){
        

        const countAddress = await prismaClient.address.count({
            where: { usersId: userId }
        });

        if(countAddress == 0){
            await prismaClient.address.create({
                data: { usersId: userId, description, street, number, neighborhood, zipCode, city, state, complement },
                select: { description: true, street: true, number: true, neighborhood: true, zipCode: true, city: true, state: true, complement: true }
            });
            return true;
        }
        else if(countAddress > 0){
            await prismaClient.address.update({
                where: { usersId: userId },
                data: { description, street, number, neighborhood, zipCode, city, state, complement },
                select: { description: true, street: true, number: true, neighborhood: true, zipCode: true, city: true, state: true, complement: true }
            });
            return true;
        }
        else{
            return false;
        }
    }

    static async deleteUserAddress(userId: string){
        const status = await prismaClient.address.delete({
            where: { usersId: userId }
        });

        return status;
    }

    static async listUsers(){
        const users = await prismaClient.user.findMany({
            select: { id: true, name: true, email: true, phone: true, role: true, status: true }
        });
        return users == null ? false : users;
    }

    static async listAllCategories(){
        const categories = await prismaClient.category.findMany({
            select: { id: true, name: true }
        });
        return categories;
    }

    static async consultNameCategory(categoryId: string){
        const category = await prismaClient.category.findMany({
            where: { id: categoryId },
            select: { id: true, name: true }
        });
        return category;
    }

    static async listAllProductsInCategory(categoryId: string){
        const categoryProducts = await prismaClient.product.findMany({
            where: { categoryId },
            select: { id: true, name: true, originalPrice: true, promotionPrice: true }
        });
        return categoryProducts;
    }

    static async verifyExistenceCategory(id: string = '', name: string = ''){
        if(id !== ''){
            return await prismaClient.category.count({
                where: { id }
            });
        }
        else{
            return await prismaClient.category.count({
                where: { name }
            });
        }
    }

    static async createCategory(name: string){
        const existyCagetory: number = await this.verifyExistenceCategory('', name);

        if(existyCagetory != 0){
            return false;
        }
        
        const category = await prismaClient.category.create({
            data: { name }
        });

        return category;
    }

    static async changeCategory(id: string, name: string){
        const category = await prismaClient.category.update({
            where: { id },
            data: { name }
        });

        return category;
    }

    static async deleteCategory(id: string){
        const existyCagetory: number = await this.verifyExistenceCategory(id);

        if(existyCagetory == 0){
            return false;
        }
        
        const category = await prismaClient.category.delete({
            where: { id },
        });

        return category;
    }

    static async listAllProducts(){
        const products = await prismaClient.product.findMany({
            select: { id: true, name: true, originalPrice: true, promotionPrice: true, imagesProduct: { select: { imageUrl: true }, take: 1 } }
        });
        return products;
    }

    static async listSpecificProduct(productId: string){
        const product = await prismaClient.product.findUnique({
            where: { id: productId },
            select: {name: true, originalPrice: true, promotionPrice: true, description: true, category: { select: { id: true, name: true } }, size: { select: { id: true, size: true, quantity: true } }, imagesProduct: { select: { id: true, imageUrl: true } } }
        });
        return product;
    }

    static async verifyExistenceProduct(id: string){
        return await prismaClient.product.count({
            where: { id }
        });
    }

    static async verifyExistenceSizeProductById(sizeId: string){
        return await prismaClient.productSize.count({
            where: { id: sizeId }
        });
    }

    static async verifyExistenceSizeProductByName(size: string){
        return await prismaClient.productSize.count({
            where: { size }
        });
    }

    static async verifyExistenceImageProduct(imagemId: string){
        return await prismaClient.imagesProduct.findUnique({
            where: { id: imagemId }
        });
    }

    static async createProduct(name: string, originalPrice: number, promotionPrice: number, categoryId: string, description: string, status: 'STOCK' | 'NO_STOCK'){
        originalPrice = Number(originalPrice);
        promotionPrice = Number(promotionPrice);
        const returnProduct = await prismaClient.product.create({
            data: { name, originalPrice, promotionPrice, categoryId, description, status },
            select: { id: true }
        })
        return returnProduct;
    }

    static async addSizeProduct(productId: string, sizeProduct: string | string[], quantityProduct: string | string[]){
        try{
            if(Array.isArray(sizeProduct)){
                for(var cont = 0; cont < sizeProduct.length; cont++){
                    let size= sizeProduct[cont];
                    let quantity: number = Number(quantityProduct[cont]);
                    await prismaClient.productSize.create({
                        data: { size, quantity, productId }
                    })
                }
            }
            else{
                await prismaClient.productSize.create({
                    data: { size: sizeProduct, quantity: Number(quantityProduct), productId }
                });
            }
            return true;
        }
        catch(error){
            return false;
        }
    }

    static async addImagesProduct(productId: string, files: any){
        if(Array.isArray(files)){
            for(var cont = 0; cont < files.length; cont++){
                let imageUrl = files[cont].filename;
                await prismaClient.imagesProduct.create({
                    data: { imageUrl, productId }
                })
            }
            return true;
        }
        else{
            await prismaClient.imagesProduct.create({
                data: { imageUrl: files.filename, productId }
            });
            return true;
        }
    }

    static async changeProduct(productId: string, name: string, originalPrice: number, promotionPrice: number, categoryId: string, description: string){
        originalPrice = Number(originalPrice);
        promotionPrice = Number(promotionPrice);
        await prismaClient.product.update({
            where: { id: productId },
            data: { name, originalPrice, promotionPrice, categoryId, description }
        })
    }

    static async changeSizeProduct(sizeId: string, size: string, quantity: number){
        if(Array.isArray(size)){
            for(var cont = 0; cont < size.length; cont ++){
                quantity = Number(quantity);
                await prismaClient.productSize.update({
                    where: { id: sizeId },
                    data: { size, quantity }
                })
            }
        }
        else{
            quantity = Number(quantity);
            await prismaClient.productSize.update({
                where: { id: sizeId },
                data: { size, quantity }
            })
        }
    }

    static async changeImageProduct(imageId: string, file: any){
        try{
            return await prismaClient.imagesProduct.update({
                where: { id: imageId },
                data: { imageUrl: file.filename }
            });
        }
        catch(error){
            return false;
        }
    }

    static async deleteSizeProduct(sizeId: string){
        try{
            await prismaClient.productSize.delete({
                where: { id: sizeId }
            })
            return true;
        }
        catch(error){
            return false;
        }
    }

    static async deleteAllSizeProductById(productId: string){
        await prismaClient.productSize.deleteMany({
            where: { productId }
        })
    }

    static async deleteAllSizeProductByCategory(categoryName: string){

    }

    static async deleteImageProductById(imageId: string){
        try{
            return await prismaClient.imagesProduct.delete({
                where: { id: imageId }
            })
        }
        catch(error){
            return false;
        }
    }

    static async deleteAllImagesProductById(productId: string){
        const images = await prismaClient.imagesProduct.findMany({
            where: { productId }
        });
        await prismaClient.imagesProduct.deleteMany({
            where: { productId }
        })
        return images;
    }

    static async deleteProductById(productId: string){
        await prismaClient.product.delete({
            where: { id: productId }
        })
    }
}