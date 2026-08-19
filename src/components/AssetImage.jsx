import { useEffect, useState } from "react";
import {
  getAssetUrl,
  getLocalAssetUrl,
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
  ...imageProps
}) {
  const localSource = getLocalAssetUrl(src);
  const remoteSource = getAssetUrl(src);
  const [resolvedSource, setResolvedSource] = useState(remoteSource);
  const [isReady, setIsReady] = useState(!revealWhenReady);
  const isUsingR2 = R2_ASSETS_ENABLED && resolvedSource === remoteSource;

  useEffect(() => {
    setResolvedSource(remoteSource);
    setIsReady(!revealWhenReady);
  }, [remoteSource, revealWhenReady]);

  const handleLoad = (event) => {
    const image = event.currentTarget;
    const loadedSource = image.currentSrc;

    onLoad?.(event);

    if (!revealWhenReady) return;

    const revealImage = () => {
      if (image.currentSrc === loadedSource) setIsReady(true);
    };

    if (typeof image.decode === "function") {
      image.decode().catch(() => undefined).finally(revealImage);
    } else {
      revealImage();
    }
  };

  const handleError = (event) => {
    if (isUsingR2 && localSource) {
      setIsReady(!revealWhenReady);
      event.currentTarget.srcset = "";
      event.currentTarget.src = localSource;
      setResolvedSource(localSource);
      return;
    }

    onError?.(event);
  };

  return (
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
  );
}
