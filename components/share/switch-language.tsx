"use client";

import { useLocale, useTranslations } from "next-intl";
import { usePathname, useRouter } from "@/navigation";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

export default function SwitchLanguage() {
  const t = useTranslations("SwitchLanguage");
  const locale = useLocale();
  const router = useRouter();
  const pathname = usePathname();

  const handleLanguageChange = (value: string) => {
    router.replace(pathname, { locale: value });
  };

  return (
    <Select value={locale} onValueChange={handleLanguageChange}>
      <SelectTrigger className="w-[140px] focus:ring-0 focus:ring-offset-0 border-none shadow-none">
        <SelectValue placeholder={t("title")} />
      </SelectTrigger>
      <SelectContent>
        <SelectItem value="vi">{t("vi")}</SelectItem>
        <SelectItem value="en">{t("en")}</SelectItem>
      </SelectContent>
    </Select>
  );
}
