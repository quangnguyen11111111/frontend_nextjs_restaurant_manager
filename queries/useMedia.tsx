import meidaApiRequest from "@/apiRequest/media";
import { useMutation } from "@tanstack/react-query";

export const useUploadAvatarMutation = () => {
  return useMutation({ mutationFn: meidaApiRequest.uploadAvatar });
};
export const useUploadDishImageMutation = () => {
  return useMutation({ mutationFn: meidaApiRequest.uploadDishImage });
};
