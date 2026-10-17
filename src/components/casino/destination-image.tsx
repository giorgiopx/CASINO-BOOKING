import { useState } from "react";
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
            alt + " — " + t("photo unavailable", "φωτογραφία μη διαθέσιμη")
          }
        >
          <MapPin aria-hidden="true" size={28} />
          <span>
            {failed
              ? t("Photo unavailable", "Φωτογραφία μη διαθέσιμη")
              : t("Loading photo", "Φόρτωση φωτογραφίας")}
          </span>
        </span>
      )}
      {!failed && src && (
        <img
          src={src}
          alt={alt}
          loading="lazy"
          referrerPolicy="no-referrer"
          onLoad={() => setLoadedSource(src)}
          onError={() => setFailedSource(src)}
          style={{ opacity: loaded ? 1 : 0 }}
        />
      )}
    </span>
  );
}
