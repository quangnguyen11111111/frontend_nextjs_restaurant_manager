import http from "@/lib/http";
import { AccountResType, ChangePasswordBodyType, UpdateMeBodyType } from "@/schemaValidations/account.schema";

const accountApiRequest = {
    me: () => http.get<AccountResType>("/api/accounts/me"),
    updateMe: (body: UpdateMeBodyType) => http.put<AccountResType>("/api/accounts/me", body),
    changePassword: (body: ChangePasswordBodyType)=> http.put<AccountResType>("/api/accounts/change-password", body)
};
export default accountApiRequest;
