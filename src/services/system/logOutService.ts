import returnServicePattern from "../returnServicePattern";
import DatabaseManager from "./databaseManagerService";

export default function logOutService(loginToken: string){
    const retornDataBase = DatabaseManager.logOut(loginToken);

    if(retornDataBase == null){
        return returnServicePattern(null, true, false, 'Você não está logado');
    }
    
    return returnServicePattern(null, false, true, 'Deslogado com sucesso');
}