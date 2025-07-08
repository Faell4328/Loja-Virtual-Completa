// The service is responsible for errors in the back end

export default function returnServicePattern(redirect: string | null, error: boolean, ok: boolean, data: any){
    const returnService = {
        'redirect': redirect,
        'error': error,
        'ok': ok,
        'data': data
    };

    return returnService;
}