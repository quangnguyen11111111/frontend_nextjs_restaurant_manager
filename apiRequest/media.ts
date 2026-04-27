import http from "@/lib/http";
import { UploadImageResType } from "@/schemaValidations/media.schema";

const mediaApiRequest = {
  upload: (formData: FormData) =>
    http.post<UploadImageResType>("/api/accounts/me/avatar", formData),
};
export default mediaApiRequest;
