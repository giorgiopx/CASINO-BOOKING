import { useCallback, useState } from "react";
import { MapPin } from "lucide-react";
import { useCasino } from "./context";
import "./destination-image.css";

/** A failed source stays visibly unavailable; this placeholder is not a photo. */
export function DestinationImage({
  src,
  alt,
  className = "",
}: {
  src: string | null;
  alt: string;
  className?: string;
}) {
  const { t } = useCasino();
  const [loadedSource, setLoadedSource] = useState<string | null>(null);
  const [failedSource, setFailedSource] = useState<string | null>(null);
  const failed = !src || failedSource === src;
  const loaded = !failed && loadedSource === src;
  const imageRef = useCallback(
    (image: HTMLImageElement | null) => {
      // SSR images can succeed or fail before React attaches event handlers.
      if (image?.complete && src) {
        if (image.naturalWidth > 0) setLoadedSource(src);
        else setFailedSource(src);
      }
    },
    [src],
  );

  return (
    <span
      className={`destination-image ${className}`}
      data-image-status={failed ? "unavailable" : loaded ? "loaded" : "loading"}
    >
      {!loaded && (
        <span
          className="destination-image-placeholder"
          role="img"
          aria-label={
            alt +
            " — " +
            (failed
              ? t("image unavailable", "εικόνα μη διαθέσιμη")
              : t("loading image", "φόρτωση εικόνας"))
          }
        >
          <MapPin aria-hidden="true" size={28} />
          <span>
            {failed
              ? t("Image unavailable", "Εικόνα μη διαθέσιμη")
              : t("Loading image", "Φόρτωση εικόνας")}
          </span>
        </span>
      )}
      {!failed && src && (
        <img
          ref={imageRef}
          src={src}
          alt={alt}
          loading="lazy"
          decoding="async"
          referrerPolicy="no-referrer"
          onLoad={() => setLoadedSource(src)}
          onError={() => setFailedSource(src)}
          style={{ opacity: loaded ? 1 : 0 }}
        />
      )}
    </span>
  );
}
