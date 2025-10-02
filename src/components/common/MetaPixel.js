import { useEffect, useRef, useCallback } from "react";
import { useSelector } from "react-redux";
import { useLocation } from "react-router-dom";
import { selectSettings } from "../../redux/settingsSlice";

const MetaPixel = () => {
  const settings = useSelector(selectSettings);
  const location = useLocation();
  const isInitialized = useRef(false);
  const loadingRef = useRef(false);

  // Initialize fbq function önce
  const initializeFbq = useCallback(() => {
    if (typeof window.fbq !== "undefined") {
      return; // Zaten tanımlı
    }

    // fbq function'ını manuel olarak tanımla
    window.fbq = function () {
      window.fbq.callMethod
        ? window.fbq.callMethod.apply(window.fbq, arguments)
        : window.fbq.queue.push(arguments);
    };

    if (!window._fbq) window._fbq = window.fbq;
    window.fbq.push = window.fbq;
    window.fbq.loaded = true;
    window.fbq.version = "2.0";
    window.fbq.queue = [];
  }, []);

  // Script loader
  const loadMetaPixelScript = useCallback(
    (pixelId) => {
      return new Promise((resolve, reject) => {
        if (loadingRef.current || isInitialized.current) {
          resolve();
          return;
        }

        loadingRef.current = true;

        // Önce fbq function'ını initialize et
        initializeFbq();

        // Script element oluştur
        const script = document.createElement("script");
        script.async = true;
        script.src = "https://connect.facebook.net/en_US/fbevents.js";

        script.onload = () => {
          try {
            // Script yüklendikten sonra pixel'i initialize et
            if (typeof window.fbq === "function") {
              window.fbq("init", pixelId);
              window.fbq("track", "PageView");
              isInitialized.current = true;
              loadingRef.current = false;
              resolve();
            } else {
              throw new Error("fbq function not available after script load");
            }
          } catch (error) {
            console.error("Meta Pixel initialization error:", error);
            loadingRef.current = false;
            reject(error);
          }
        };

        script.onerror = () => {
          console.error("Meta Pixel script loading failed");
          loadingRef.current = false;
          reject(new Error("Script loading failed"));
        };

        document.head.appendChild(script);
      });
    },
    [initializeFbq]
  );

  // User interaction'da yükle
  const initializeOnInteraction = useCallback(
    (pixelId) => {
      if (!pixelId) return;

      const events = ["click", "scroll", "keydown", "touchstart"];

      const handleInteraction = () => {
        if (!isInitialized.current && !loadingRef.current) {
          loadMetaPixelScript(pixelId).catch((error) => {
            console.error("Meta Pixel loading failed:", error);
          });
        }

        // Event listener'ları temizle
        events.forEach((event) => {
          document.removeEventListener(event, handleInteraction);
        });
      };

      // Event listener'ları ekle
      events.forEach((event) => {
        document.addEventListener(event, handleInteraction, {
          once: true,
          passive: true,
        });
      });

      // 3 saniye fallback
      const fallbackTimer = setTimeout(() => {
        if (!isInitialized.current && !loadingRef.current) {
          loadMetaPixelScript(pixelId).catch((error) => {
            console.error("Meta Pixel fallback loading failed:", error);
          });
        }
      }, 3000);

      return () => {
        clearTimeout(fallbackTimer);
        events.forEach((event) => {
          document.removeEventListener(event, handleInteraction);
        });
      };
    },
    [loadMetaPixelScript]
  );

  // Settings değişikliği
  useEffect(() => {
    if (settings?.metaPixelEnabled && settings?.metaPixelId) {
      const cleanup = initializeOnInteraction(settings.metaPixelId);
      return cleanup;
    }
  }, [
    settings?.metaPixelEnabled,
    settings?.metaPixelId,
    initializeOnInteraction,
  ]);

  // Route change tracking
  useEffect(() => {
    if (
      settings?.metaPixelEnabled &&
      isInitialized.current &&
      typeof window.fbq === "function"
    ) {
      const trackTimer = setTimeout(() => {
        try {
          window.fbq("track", "PageView");
        } catch (error) {
          console.error("Meta Pixel PageView tracking error:", error);
        }
      }, 100);

      return () => clearTimeout(trackTimer);
    }
  }, [location.pathname, settings?.metaPixelEnabled]);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      isInitialized.current = false;
      loadingRef.current = false;
    };
  }, []);

  return null;
};

export default MetaPixel;
