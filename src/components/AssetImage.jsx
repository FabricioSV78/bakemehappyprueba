import { useEffect, useRef, useState } from "react";
import { R2_FALLBACK_TIMEOUT_MS } from "../data/imageDelivery";
import {
  getAssetSrcSet,
  getAssetUrl,
  getLocalAssetUrl,
  rememberRemoteAssetFailure,
  R2_ASSETS_ENABLED,
} from "../utils/assets";

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
  responsiveWidths = [],
  showPlaceholder = false,
  sourceWidth,
  loading = "eager",
  ...imageProps
}) {
  const localSource = getLocalAssetUrl(src);
  const remoteSource = getAssetUrl(src);
  const remoteSourceSet = getAssetSrcSet(src, responsiveWidths, sourceWidth);
  const localSourceSet = getAssetSrcSet(src, responsiveWidths, sourceWidth, {
    local: true,
  });
  const [resolvedSource, setResolvedSource] = useState(remoteSource);
  const shouldShowPlaceholder = revealWhenReady || showPlaceholder;
  const [loadState, setLoadState] = useState("loading");
  const [isTimeoutArmed, setIsTimeoutArmed] = useState(loading !== "lazy");
  const imageRef = useRef(null);
  const requestedAssetRef = useRef(src);
  const attemptedLocalFallbackRef = useRef(remoteSource === localSource);
  const isReady = loadState === "ready";
  const hasError = loadState === "error";
  const isUsingR2 =
    R2_ASSETS_ENABLED &&
    remoteSource !== localSource &&
    resolvedSource === remoteSource;
  const resolvedSourceSet = isUsingR2 ? remoteSourceSet : localSourceSet;

  useEffect(() => {
    if (requestedAssetRef.current === src) return;

    requestedAssetRef.current = src;
    attemptedLocalFallbackRef.current = remoteSource === localSource;
    setResolvedSource(remoteSource);
    setLoadState("loading");
  }, [localSource, remoteSource, src]);

  useEffect(() => {
    if (loading !== "lazy") {
      setIsTimeoutArmed(true);
      return undefined;
    }

    setIsTimeoutArmed(false);
    const image = imageRef.current;
    if (!image || typeof IntersectionObserver === "undefined") {
      setIsTimeoutArmed(true);
      return undefined;
    }

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (!entry.isIntersecting) return;
        setIsTimeoutArmed(true);
        observer.disconnect();
      },
      { rootMargin: "300px 0px" },
    );

    observer.observe(image);
    return () => observer.disconnect();
  }, [loading, src]);

  useEffect(() => {
    if (
      !isUsingR2 ||
      !localSource ||
      localSource === remoteSource ||
      !isTimeoutArmed ||
      loadState !== "loading"
    ) {
      return undefined;
    }

    const fallbackTimer = window.setTimeout(() => {
      attemptedLocalFallbackRef.current = true;
      rememberRemoteAssetFailure(src);
      setResolvedSource(localSource);
    }, R2_FALLBACK_TIMEOUT_MS);

    return () => window.clearTimeout(fallbackTimer);
  }, [isTimeoutArmed, isUsingR2, loadState, localSource, remoteSource, src]);

  const handleLoad = (event) => {
    const image = event.currentTarget;
    const loadedSource = image.currentSrc;

    onLoad?.(event);

    const revealImage = () => {
      if (image.currentSrc === loadedSource) setLoadState("ready");
    };

    if (revealWhenReady && typeof image.decode === "function") {
      image.decode().catch(() => undefined).finally(revealImage);
    } else {
      revealImage();
    }
  };

  const handleError = (event) => {
    if (
      isUsingR2 &&
      localSource &&
      localSource !== remoteSource &&
      !attemptedLocalFallbackRef.current
    ) {
      attemptedLocalFallbackRef.current = true;
      rememberRemoteAssetFailure(src);
      setLoadState("loading");
      setResolvedSource(localSource);
      return;
    }

    setLoadState("error");
    onError?.(event);
  };

  return (
    <>
      <img
        ref={imageRef}
        {...imageProps}
        src={resolvedSource}
        srcSet={resolvedSourceSet || undefined}
        loading={loading}
        className={`${className} ${
          revealWhenReady
            ? `transition-opacity duration-150 motion-reduce:transition-none ${
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
          className={`asset-image-placeholder pointer-events-none absolute inset-0 z-[1] overflow-hidden transition-opacity duration-150 motion-reduce:transition-none ${
            isReady ? "opacity-0" : "opacity-100"
          }`}
          data-image-placeholder={
            isReady ? "ready" : hasError ? "error" : "loading"
          }
          aria-hidden="true"
        />
      )}
    </>
  );
}
