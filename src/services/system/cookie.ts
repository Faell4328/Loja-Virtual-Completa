import { Response } from 'express'

export default class Cookie{
    static setCookie(res: Response, token: String, expiration: Date){
        res.cookie('token', token, {
            httpOnly: true,
            secure: false,
            sameSite: 'strict',
            expires: expiration
        })
    }
}