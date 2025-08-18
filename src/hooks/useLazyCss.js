import { useEffect, useRef, useState } from "react";

/**
 * useLazyCss
 * - source: string (CSS URL) veya () => Promise (dynamic import('...css'))
 * - options:
 *    - preload: true -> <link rel="preload" as="style" ...> + onload stylesheet
 *    - removeOnUnmount: unmount'ta eklenen <link> tag'ini kaldır
 *    - onError: hata callback
 *
 * return: "idle" | "loading" | "loaded" | "error"
 */
export default function useLazyCss(source, options = {}) {
  const { preload = false, removeOnUnmount = false, onError } = options;
  const [status, setStatus] = useState("idle");
  const linkRef = useRef(null);

  useEffect(() => {
    let disposed = false;

    async function load() {
      if (!source) return;
      setStatus("loading");

      try {
        if (typeof source === "string") {
          // URL tabanlı CSS
          // zaten eklenmişse tekrar ekleme
          const existing =
            document.querySelector(`link[data-lazy-css="${source}"]`) ||
            document.querySelector(`link[href="${source}"]`);
          if (existing) {
            setStatus("loaded");
            return;
          }

          const link = document.createElement("link");
          link.href = source;
          link.setAttribute("data-lazy-css", source);

          if (preload) {
            link.rel = "preload";
            link.as = "style";
            link.onload = function () {
              this.rel = "stylesheet";
            };
            // preload'ta load event beklemeden "loaded" sayabiliriz
            setStatus("loaded");
          } else {
            link.rel = "stylesheet";
            link.addEventListener("load", () => {
              if (!disposed) setStatus("loaded");
            });
          }

          document.head.appendChild(link);
          linkRef.current = link;
        } else if (typeof source === "function") {
          // dynamic import('...css')
          await source();
          if (!disposed) setStatus("loaded");
        }
      } catch (err) {
        if (!disposed) setStatus("error");
        if (onError) onError(err);
        // optional: console.error("useLazyCss error:", err);
      }
    }

    load();

    return () => {
      disposed = true;
      if (removeOnUnmount && linkRef.current instanceof HTMLLinkElement) {
        linkRef.current.parentNode?.removeChild(linkRef.current);
      }
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [typeof source === "string" ? source : "import-fn"]);

  return status;
}
