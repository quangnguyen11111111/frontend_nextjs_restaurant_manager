"use client";
import { getTableLink } from "@/lib/utils";
import QRCode from "qrcode";
import { useEffect, useRef, useState } from "react";

export default function QrCodeTable({
  token,
  tableNumber,
  widthIn = 250,
  textSizeIn = 18,
}: {
  token: string;
  tableNumber: number;
  widthIn?: number;
  textSizeIn?: number;
}) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [width, setWidth] = useState(widthIn);
  const [textSize, setTextSize] = useState(textSizeIn);

  useEffect(() => {
    const updateSize = () => {
      if (window.innerWidth < 768) {
        setWidth(140); // mobile
        setTextSize(12);
      } else {
        setWidth(widthIn); // desktop
        setTextSize(textSizeIn);
      }
    };

    updateSize();
    window.addEventListener("resize", updateSize);
    return () => window.removeEventListener("resize", updateSize);
  }, []);

  useEffect(() => {
    const canvas = canvasRef.current!;
    canvas.width = width;
    canvas.height = width + 60;

    const ctx = canvas.getContext("2d")!;
    ctx.fillStyle = "#fff";
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    ctx.textAlign = "center";
    ctx.fillStyle = "#000";
    ctx.font = `${textSize}px Arial`;

    ctx.fillText(`Quét mã để gọi món`, canvas.width / 2, canvas.width + 20);
    ctx.fillText(`Bàn số ${tableNumber}`, canvas.width / 2, canvas.width + 50);

    const virtualCanvas = document.createElement("canvas");

    QRCode.toCanvas(
      virtualCanvas,
      getTableLink({ token, tableNumber }),
      (error) => {
        if (error) console.error(error);
        ctx.drawImage(virtualCanvas, 0, 0, width, width);
      },
    );
  }, [token, tableNumber, width, textSize]);

  return <canvas ref={canvasRef} />;
}
