import z from "zod";

export const UploadAvatarRes = z.object({
  data: z.object({
    avatar: z.string(),
    avatarS3Key: z.string(),
  }),
  message: z.string(),
});
export const UploadDishImageRes = z.object({
  data: z.object({
    image: z.string(),
    imageS3Key: z.string(),
  }),
  message: z.string(),
});

export type UploadAvatarResType = z.TypeOf<typeof UploadAvatarRes>;
export type UploadDishImageResType = z.TypeOf<typeof UploadDishImageRes>;
