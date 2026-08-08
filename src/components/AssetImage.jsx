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
  onError,
  ...imageProps
}) {
  const localSource = getLocalAssetUrl(src);
  const remoteSource = getAssetUrl(src);
  const [resolvedSource, setResolvedSource] = useState(remoteSource);
  const isUsingR2 = R2_ASSETS_ENABLED && resolvedSource === remoteSource;

  useEffect(() => {
    setResolvedSource(remoteSource);
  }, [remoteSource]);

  const handleError = (event) => {
    if (isUsingR2 && localSource) {
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
      onError={handleError}
      data-asset-source={isUsingR2 ? "r2" : "local"}
    />
  );
}
