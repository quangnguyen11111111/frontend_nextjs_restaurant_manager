import http from "@/lib/http";
import {
  UploadAvatarResType,
  UploadDishImageResType,
} from "@/schemaValidations/media.schema";

const mediaApiRequest = {
  uploadAvatar: (formData: FormData) =>
    http.post<UploadAvatarResType>("/api/accounts/me/avatar", formData),
  uploadDishImage: (formData: FormData) =>
    http.post<UploadDishImageResType>("/api/admin/dishes/image", formData),
};
export default mediaApiRequest;
