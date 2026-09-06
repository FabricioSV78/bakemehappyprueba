import { useEffect, useState } from "react";
import { ImageOff, LoaderCircle } from "lucide-react";
import {
  getAssetUrl,
  getLocalAssetUrl,
  R2_ASSETS_ENABLED,
} from "../utils/assets";

const R2_FALLBACK_TIMEOUT_MS = 3000;

/**
 * Intenta cargar desde R2 y, si el objeto aún no fue sincronizado o R2 no
 * responde, conserva la imagen incluida en /public como respaldo inmediato.
 */
export default function AssetImage({
  src,
  className = "",
  onError,
  onLoad,
  revealWhenReady = false,
  showPlaceholder = false,
  ...imageProps
}) {
  const localSource = getLocalAssetUrl(src);
  const remoteSource = getAssetUrl(src);
  const [resolvedSource, setResolvedSource] = useState(remoteSource);
  const shouldShowPlaceholder = revealWhenReady || showPlaceholder;
  const [loadState, setLoadState] = useState(
    shouldShowPlaceholder ? "loading" : "ready",
  );
  const isReady = loadState === "ready";
  const hasError = loadState === "error";
  const isUsingR2 = R2_ASSETS_ENABLED && resolvedSource === remoteSource;

  useEffect(() => {
    setResolvedSource(remoteSource);
    setLoadState(shouldShowPlaceholder ? "loading" : "ready");
  }, [remoteSource, shouldShowPlaceholder]);

  useEffect(() => {
    if (!isUsingR2 || !localSource || localSource === remoteSource || isReady) {
      return undefined;
    }

    const fallbackTimer = window.setTimeout(() => {
      setLoadState(shouldShowPlaceholder ? "loading" : "ready");
      setResolvedSource(localSource);
    }, R2_FALLBACK_TIMEOUT_MS);

    return () => window.clearTimeout(fallbackTimer);
  }, [isReady, isUsingR2, localSource, remoteSource, shouldShowPlaceholder]);

  const handleLoad = (event) => {
    const image = event.currentTarget;
    const loadedSource = image.currentSrc;

    onLoad?.(event);

    if (!shouldShowPlaceholder) return;

    const revealImage = () => {
      if (image.currentSrc === loadedSource) setLoadState("ready");
    };

    if (typeof image.decode === "function") {
      image.decode().catch(() => undefined).finally(revealImage);
    } else {
      revealImage();
    }
  };

  const handleError = (event) => {
    if (isUsingR2 && localSource) {
      setLoadState(shouldShowPlaceholder ? "loading" : "ready");
      event.currentTarget.srcset = "";
      event.currentTarget.src = localSource;
      setResolvedSource(localSource);
      return;
    }

    setLoadState("error");
    onError?.(event);
  };

  return (
    <>
      <img
        {...imageProps}
        src={resolvedSource}
        className={`${className} ${
          revealWhenReady
            ? `transition-opacity duration-300 motion-reduce:transition-none ${
                isReady ? "opacity-100" : "opacity-0"
              }`
            : ""
        }`}
        onLoad={handleLoad}
        onError={handleError}
        data-asset-source={isUsingR2 ? "r2" : "local"}
        data-image-ready={isReady ? "true" : "false"}
      />
      {shouldShowPlaceholder && (
        <span
          className={`asset-image-placeholder pointer-events-none absolute inset-0 z-[1] grid place-items-center overflow-hidden transition-opacity duration-300 motion-reduce:transition-none ${
            isReady ? "opacity-0" : "opacity-100"
          }`}
          data-image-placeholder={hasError ? "error" : "loading"}
          aria-hidden="true"
        >
          <span className="asset-image-placeholder-icon relative z-[1] grid h-10 w-10 place-items-center rounded-full border border-white/80 bg-white/90 text-plum shadow-sm sm:h-11 sm:w-11">
            {hasError ? (
              <ImageOff size={19} strokeWidth={1.8} />
            ) : (
              <LoaderCircle
                className="animate-spin motion-reduce:animate-none"
                size={21}
                strokeWidth={2}
              />
            )}
          </span>
        </span>
      )}
    </>
  );
}
