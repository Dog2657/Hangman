interface Options {
    body?: any,
    headers?: HeadersInit | undefined,
    cache?: "no-cache"|"reload"|"force-cache"|"only-if-cached"|"default" ,
    mode?: "no-cors"|"cors"|"same-origin",
    redirect?: "manual"|"follow"|"error",
    referrerPolicy?: "no-referrer"|"no-referrer-when-downgrade"|"origin"|"origin-when-cross-origin"|"same-origin"|"strict-origin"|"strict-origin-when-cross-origin"|"unsafe-url"
}

export async function request(
    path: string,
    method: "GET"|"POST"|"PUT"|"DELETE" = "GET",
    fetcher: Function = fetch,
    options: Options = {}
){
    if(path[0] == '/')
        path = path.replace('/', '')

    try {
        const response = await fetcher(`${ process.env.NODE_ENV == "development"? "http://localhost:8080/":""}${path}`, {
            method,
            mode: options.mode,
            cache: options.cache, 
            headers: options.headers,
            redirect: options.redirect,
            referrerPolicy: options.referrerPolicy,
            body: (method != "GET")? options.body : undefined
        });

        const json = await response.json()

        if(!response.ok)
            throw json.detail 

        return [json, null]

    } catch (error) {
        return [null, String(error)]
    }
};