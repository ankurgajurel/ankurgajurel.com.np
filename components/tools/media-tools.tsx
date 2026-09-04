"use client";

import {
  type ChangeEvent,
  type PointerEvent,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import { DownloadSimpleIcon as Download } from "@phosphor-icons/react/dist/ssr/DownloadSimple";
import { EraserIcon as Eraser } from "@phosphor-icons/react/dist/ssr/Eraser";
import { ImageIcon as ImageIcon } from "@phosphor-icons/react/dist/ssr/Image";
import { CursorIcon as MousePointer2 } from "@phosphor-icons/react/dist/ssr/Cursor";
import { PenNibIcon as PenLine } from "@phosphor-icons/react/dist/ssr/PenNib";
import { UploadSimpleIcon as Upload } from "@phosphor-icons/react/dist/ssr/UploadSimple";
import { cn } from "@/lib/utils";
import {
  ToolPanel,
  toolInputClassName,
  toolLabelClassName,
} from "@/components/tools/tool-shell";
import { ToolButton } from "@/components/tools/tool-button";

function formatFileSize(bytes: number) {
  if (bytes === 0) return "0 bytes";
  const units = ["bytes", "KB", "MB", "GB"];
  const index = Math.min(Math.floor(Math.log(bytes) / Math.log(1024)), units.length - 1);
  return `${Number((bytes / 1024 ** index).toFixed(2))} ${units[index]}`;
}

function downloadDataUrl(url: string, name: string) {
  const link = document.createElement("a");
  link.href = url;
  link.download = name;
  document.body.append(link);
  link.click();
  link.remove();
}

function ImagePreview({ src, alt }: { src: string; alt: string }) {
  return (
    <div className="flex aspect-video items-center justify-center border border-foreground/10 bg-background p-3">
      {/* The image is a local browser data URL selected by the visitor. */}
      <img src={src} alt={alt} className="max-h-full max-w-full object-contain" />
    </div>
  );
}

export function ImageCompressor() {
  const [source, setSource] = useState<string | null>(null);
  const [output, setOutput] = useState<string | null>(null);
  const [quality, setQuality] = useState(70);
  const [format, setFormat] = useState<"jpeg" | "png" | "webp">("jpeg");
  const [maxWidth, setMaxWidth] = useState(1024);
  const [sourceSize, setSourceSize] = useState(0);
  const [outputSize, setOutputSize] = useState(0);
  const [isWorking, setIsWorking] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  const selectFile = (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    setError(null);
    if (!file) return;
    if (!file.type.startsWith("image/")) {
      setError("Choose a PNG, JPG, WebP, or another image file.");
      return;
    }
    const reader = new FileReader();
    reader.onload = () => {
      setSource(reader.result as string);
      setOutput(null);
      setSourceSize(file.size);
      setOutputSize(0);
    };
    reader.onerror = () => setError("That image could not be read.");
    reader.readAsDataURL(file);
  };

  const compress = () => {
    if (!source || !canvasRef.current) return;
    setError(null);
    setIsWorking(true);
    const image = new Image();
    image.onload = () => {
      const canvas = canvasRef.current;
      const context = canvas?.getContext("2d");
      if (!canvas || !context) {
        setError("Your browser could not prepare an image canvas.");
        setIsWorking(false);
        return;
      }
      const targetWidth = Math.max(1, Math.round(maxWidth) || 1);
      const scale = image.width > targetWidth ? targetWidth / image.width : 1;
      canvas.width = Math.round(image.width * scale);
      canvas.height = Math.round(image.height * scale);
      context.clearRect(0, 0, canvas.width, canvas.height);
      context.drawImage(image, 0, 0, canvas.width, canvas.height);
      const next = canvas.toDataURL(`image/${format}`, quality / 100);
      setOutput(next);
      setOutputSize(Math.round((next.split(",")[1]?.length ?? 0) * 0.75));
      setIsWorking(false);
    };
    image.onerror = () => {
      setError("That image could not be processed.");
      setIsWorking(false);
    };
    image.src = source;
  };

  const change = sourceSize && outputSize ? Math.round((1 - outputSize / sourceSize) * 100) : null;

  return (
    <div className="space-y-6">
      <ToolPanel>
        <label htmlFor="compressor-file" className={toolLabelClassName}>upload image</label>
        <input id="compressor-file" type="file" accept="image/*" onChange={selectFile} className={toolInputClassName} />
        {error && <p role="alert" className="mt-3 text-sm text-destructive">{error}</p>}
      </ToolPanel>

      {source && (
        <ToolPanel className="grid gap-5 md:grid-cols-3">
          <label>
            <span className={toolLabelClassName}>quality · {quality}%</span>
            <input aria-label="Compression quality" type="range" min="1" max="100" value={quality} onChange={(event) => setQuality(Number(event.target.value))} className="w-full accent-foreground" />
          </label>
          <label>
            <span className={toolLabelClassName}>output format</span>
            <select value={format} onChange={(event) => setFormat(event.target.value as typeof format)} className={toolInputClassName}>
              <option value="jpeg">JPG</option>
              <option value="png">PNG</option>
              <option value="webp">WebP</option>
            </select>
          </label>
          <label>
            <span className={toolLabelClassName}>maximum width (px)</span>
            <input type="number" min="1" value={maxWidth} onChange={(event) => setMaxWidth(Math.max(1, event.target.valueAsNumber || 1))} className={toolInputClassName} />
          </label>
          <ToolButton className="md:col-span-3 md:w-fit" onClick={compress} disabled={isWorking}>
            <ImageIcon size={16} />{isWorking ? "compressing…" : "compress image"}
          </ToolButton>
        </ToolPanel>
      )}

      {source && (
        <div className="grid gap-5 md:grid-cols-2">
          <ToolPanel className="space-y-3">
            <div className="flex items-baseline justify-between gap-3"><h2 className="text-lg">original</h2><span className="text-xs text-foreground/60">{formatFileSize(sourceSize)}</span></div>
            <ImagePreview src={source} alt="Original upload" />
          </ToolPanel>
          {output && (
            <ToolPanel className="space-y-3">
              <div className="flex items-baseline justify-between gap-3"><h2 className="text-lg">compressed</h2><span className="text-xs text-foreground/60">{formatFileSize(outputSize)}{change !== null && ` · ${Math.abs(change)}% ${change >= 0 ? "smaller" : "larger"}`}</span></div>
              <ImagePreview src={output} alt="Compressed output" />
              <ToolButton onClick={() => downloadDataUrl(output, `compressed-image.${format}`)}><Download size={16} />download</ToolButton>
            </ToolPanel>
          )}
        </div>
      )}
      <canvas ref={canvasRef} className="hidden" />
    </div>
  );
}

export function PngToJpg() {
  const [source, setSource] = useState<string | null>(null);
  const [output, setOutput] = useState<string | null>(null);
  const [fileName, setFileName] = useState("converted");
  const [sourceSize, setSourceSize] = useState(0);
  const [outputSize, setOutputSize] = useState(0);
  const [quality, setQuality] = useState(90);
  const [isWorking, setIsWorking] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  const selectFile = (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    setError(null);
    setOutput(null);
    if (!file) return;
    if (file.type !== "image/png") {
      setError("Choose a PNG image.");
      return;
    }
    setFileName(file.name.replace(/\.png$/i, "") || "converted");
    setSourceSize(file.size);
    const reader = new FileReader();
    reader.onload = () => setSource(reader.result as string);
    reader.onerror = () => setError("That PNG could not be read.");
    reader.readAsDataURL(file);
  };

  const convert = () => {
    if (!source || !canvasRef.current) return;
    setIsWorking(true);
    setError(null);
    const image = new Image();
    image.onload = () => {
      const canvas = canvasRef.current;
      const context = canvas?.getContext("2d");
      if (!canvas || !context) return;
      canvas.width = image.width;
      canvas.height = image.height;
      context.fillStyle = "#ffffff";
      context.fillRect(0, 0, canvas.width, canvas.height);
      context.drawImage(image, 0, 0);
      const next = canvas.toDataURL("image/jpeg", quality / 100);
      setOutput(next);
      setOutputSize(Math.round((next.split(",")[1]?.length ?? 0) * 0.75));
      setIsWorking(false);
    };
    image.onerror = () => { setError("That PNG could not be converted."); setIsWorking(false); };
    image.src = source;
  };

  const difference = sourceSize && outputSize ? Math.round((1 - outputSize / sourceSize) * 100) : null;
  return (
    <div className="space-y-6">
      <ToolPanel>
        <label htmlFor="png-file" className={toolLabelClassName}>upload PNG</label>
        <input id="png-file" type="file" accept="image/png" onChange={selectFile} className={toolInputClassName} />
        {error && <p role="alert" className="mt-3 text-sm text-destructive">{error}</p>}
      </ToolPanel>
      {source && <ToolPanel className="space-y-4"><label><span className={toolLabelClassName}>JPG quality · {quality}%</span><input aria-label="JPG quality" type="range" min="1" max="100" value={quality} onChange={(event) => setQuality(Number(event.target.value))} className="w-full accent-foreground" /></label><ToolButton onClick={convert} disabled={isWorking}>{isWorking ? "converting…" : "convert to JPG"}</ToolButton></ToolPanel>}
      {source && <div className="grid gap-5 md:grid-cols-2"><ToolPanel className="space-y-3"><div className="flex justify-between gap-3"><h2 className="text-lg">original PNG</h2><span className="text-xs text-foreground/60">{formatFileSize(sourceSize)}</span></div><ImagePreview src={source} alt="Original PNG" /></ToolPanel>{output && <ToolPanel className="space-y-3"><div className="flex justify-between gap-3"><h2 className="text-lg">converted JPG</h2><span className="text-xs text-foreground/60">{formatFileSize(outputSize)}{difference !== null && ` · ${Math.abs(difference)}% ${difference >= 0 ? "smaller" : "larger"}`}</span></div><ImagePreview src={output} alt="Converted JPG" /><ToolButton onClick={() => downloadDataUrl(output, `${fileName}.jpg`)}><Download size={16} />download JPG</ToolButton></ToolPanel>}</div>}
      <canvas ref={canvasRef} className="hidden" />
    </div>
  );
}

export function SignatureMaker() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [mode, setMode] = useState<"mouse" | "touch">("mouse");
  const [drawing, setDrawing] = useState(false);
  const [hasSignature, setHasSignature] = useState(false);

  useEffect(() => {
    const canvas = canvasRef.current;
    const context = canvas?.getContext("2d");
    if (!canvas || !context) return;
    canvas.width = 1200;
    canvas.height = 400;
    context.strokeStyle = "#171717";
    context.lineWidth = 4;
    context.lineCap = "round";
    context.lineJoin = "round";
  }, []);

  const point = (event: PointerEvent<HTMLCanvasElement>) => {
    const canvas = canvasRef.current;
    if (!canvas) return null;
    const bounds = canvas.getBoundingClientRect();
    return { x: (event.clientX - bounds.left) * (canvas.width / bounds.width), y: (event.clientY - bounds.top) * (canvas.height / bounds.height) };
  };
  const isActivePointer = (event: PointerEvent<HTMLCanvasElement>) => mode === "touch" ? event.pointerType !== "mouse" : event.pointerType === "mouse";
  const start = (event: PointerEvent<HTMLCanvasElement>) => {
    if (!isActivePointer(event)) return;
    const context = canvasRef.current?.getContext("2d");
    const next = point(event);
    if (!context || !next) return;
    event.currentTarget.setPointerCapture(event.pointerId);
    context.beginPath();
    context.moveTo(next.x, next.y);
    setDrawing(true);
  };
  const draw = (event: PointerEvent<HTMLCanvasElement>) => {
    if (!drawing || !isActivePointer(event)) return;
    const context = canvasRef.current?.getContext("2d");
    const next = point(event);
    if (!context || !next) return;
    context.lineTo(next.x, next.y);
    context.stroke();
    setHasSignature(true);
  };
  const clear = () => {
    const canvas = canvasRef.current;
    canvas?.getContext("2d")?.clearRect(0, 0, canvas.width, canvas.height);
    setHasSignature(false);
  };

  return (
    <ToolPanel className="space-y-5">
      <div className="flex flex-wrap items-center gap-2" role="group" aria-label="Signature input mode">
        <ToolButton variant={mode === "mouse" ? "primary" : "secondary"} onClick={() => setMode("mouse")}><MousePointer2 size={16} />mouse</ToolButton>
        <ToolButton variant={mode === "touch" ? "primary" : "secondary"} onClick={() => setMode("touch")}><PenLine size={16} />touch</ToolButton>
        {mode === "touch" && <span className="text-sm text-foreground/60">Use a finger or stylus on the canvas.</span>}
      </div>
      <div className={cn("border-2 border-dashed p-1", mode === "touch" ? "border-foreground/45 bg-card" : "border-foreground/15")}>
        <canvas ref={canvasRef} className="block w-full touch-none cursor-crosshair" aria-label="Signature canvas" onPointerDown={start} onPointerMove={draw} onPointerUp={() => setDrawing(false)} onPointerCancel={() => setDrawing(false)} />
      </div>
      <div className="flex flex-wrap gap-2">
        <ToolButton variant="secondary" disabled={!hasSignature} onClick={clear}><Eraser size={16} />clear</ToolButton>
        <ToolButton disabled={!hasSignature} onClick={() => { const data = canvasRef.current?.toDataURL("image/png"); if (data) downloadDataUrl(data, "signature.png"); }}><Download size={16} />download signature</ToolButton>
      </div>
    </ToolPanel>
  );
}
