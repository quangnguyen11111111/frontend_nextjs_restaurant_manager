import authApiRequest from "@/apiRequest/auth"
import { useMutation } from "@tanstack/react-query"


export const useLoginMutation=()=>{
    return useMutation({
        mutationFn:authApiRequest.cLogin
    })
}

export const useLogoutMutation=()=>{
    return useMutation({
        mutationFn:authApiRequest.cLogout
    })
}