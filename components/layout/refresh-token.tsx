"use client";
import { checkAndRefreshToken } from "@/lib/utils";
import { useEffect } from "react";
export default function RefreshToken() {
  useEffect(() => {
    let interval: any = null;

    checkAndRefreshToken({
      onError: () => {
        clearInterval(interval);
      },
    });
    interval = setInterval(checkAndRefreshToken, 1000);
    return () => clearInterval(interval);
  }, []);
  return null;
}
