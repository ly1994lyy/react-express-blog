import {get} from "../utils/http"

export const getCate = (params)=>{
    return get('/categories',params)
}