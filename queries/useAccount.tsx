
import accountApiRequest from "@/apiRequest/account"
import { useMutation, useQuery } from "@tanstack/react-query"

export const useAccountMeQuery = () => {
    return useQuery({
        queryKey:["account-me"],
        queryFn: accountApiRequest.me
    })
}

export const useUpdateMeMutation = () => {
    return useMutation({
        mutationFn: accountApiRequest.updateMe
    })
}

export const useChangePasswordMutation = () => {
    return useMutation({
        mutationFn: accountApiRequest.changePassword
    })
}