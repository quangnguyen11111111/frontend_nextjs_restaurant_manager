
import accountApiRequest from "@/apiRequest/account"
import { useQuery } from "@tanstack/react-query"

const useAccountProfileQuery = () => {
    return useQuery({
        queryKey:["account-profile"],
        queryFn: accountApiRequest.me
    })
}
export default useAccountProfileQuery