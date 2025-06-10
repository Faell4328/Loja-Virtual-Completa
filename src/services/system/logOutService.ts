import returnServicePattern from "../returnServicePattern";
import DatabaseManager from "./databaseManagerService";

export default function logOutService(userId: string){
    const retornDataBase = DatabaseManager.logOut(userId);
    if(retornDataBase != undefined && retornDataBase != null){
        return returnServicePattern(null, false, true, 'Você não está logado');
    }
        return returnServicePattern(null, true, false, 'Deslogado com sucesso');
}