import z from "zod";

const configSchema = z.object({
  NEXT_PUBLIC_API_ENDPOINT: z.string(),
  NEXT_PUBLIC_SOCKET_ENDPOINT: z.string(),
  NEXT_PUBLIC_URL: z.string(),
});

const configProject = configSchema.safeParse({
  NEXT_PUBLIC_API_ENDPOINT: process.env.NEXT_PUBLIC_API_ENDPOINT,
  NEXT_PUBLIC_SOCKET_ENDPOINT: process.env.NEXT_PUBLIC_SOCKET_ENDPOINT,
  NEXT_PUBLIC_URL: process.env.NEXT_PUBLIC_URL,
});

if (!configProject.success) {
  console.error(configProject.error.issues);
  throw new Error(
    "Các khai báo bien môi trường không hợp lệ. Vui lòng kiểm tra lại file .env",
  );
}
const envConfig = configProject.data;
export default envConfig;
export type Locale = (typeof locales)[number];

export const locales = ["en", "vi"] as const;
export const defaultLocale: Locale = "vi";
