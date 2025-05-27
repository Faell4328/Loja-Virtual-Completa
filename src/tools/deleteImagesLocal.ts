import { unlink } from "fs"
import { resolve } from "path"

export function deleteImagesLocal(name: any | any[]){
    if(Array.isArray(name)){
        if(name[0].path != undefined){
            for(var cont = 0; cont< name.length; cont++){
                unlink(resolve(name[cont].path), (err) => {
                    if(err) console.log(`Erro ao deletar o arquivo ${name[cont].path}`)
                })
            }
        }
        else{
            for(var cont = 0; cont< name.length; cont++){
                unlink(resolve('public', 'files', 'product', name[cont].imageUrl), (err) => {
                    if(err) console.log(`Erro ao deletar o arquivo ${name[cont].imagemUrl}`)
                })
            }
        }
    }
    else{
        if(name.path != undefined){
            unlink(resolve(name.path), (err) => {
                if(err) console.log(`Erro ao deletar o arquivo ${name.path}`)
            })
        }
        else{
            unlink(resolve('public', 'files', 'product', name.imageUrl), (err) => {
                if(err) console.log(`Erro ao deletar o arquivo ${name.imagemUrl}`)
            })
        }
    }
}
