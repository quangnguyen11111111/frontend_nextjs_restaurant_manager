import z from "zod";

export const UploadImageRes = z.object({
  data: z.object({
    avatar: z.string(),
    avatarS3Key: z.string(),
  }),
  message: z.string(),
});

export type UploadImageResType = z.TypeOf<typeof UploadImageRes>;
