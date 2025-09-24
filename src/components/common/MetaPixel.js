import { useEffect, useRef, useCallback } from "react";
import { useSelector } from "react-redux";
import { useLocation } from "react-router-dom";
import { selectSettings } from "../../redux/settingsSlice";

const MetaPixel = () => {
  const settings = useSelector(selectSettings);
  const location = useLocation();
  const isInitialized = useRef(false);
  const loadingRef = useRef(false);

  // Memoized script loader
  const loadMetaPixelScript = useCallback((pixelId) => {
    return new Promise((resolve, reject) => {
      // Eğer zaten yükleniyor veya yüklenmiş ise, çık
      if (loadingRef.current || window.fbq) {
        resolve();
        return;
      }

      loadingRef.current = true;

      // Script element oluştur
      const script = document.createElement("script");
      script.async = true;
      script.src = "https://connect.facebook.net/en_US/fbevents.js";

      script.onload = () => {
        try {
          // fbq function'ını initialize et
          if (!window.fbq) {
            (function (f, b, e, v, n, t, s) {
              if (f.fbq) return;
              n = f.fbq = function () {
                n.callMethod
                  ? n.callMethod.apply(n, arguments)
                  : n.queue.push(arguments);
              };
              if (!f._fbq) f._fbq = n;
              n.push = n;
              n.loaded = !0;
              n.version = "2.0";
              n.queue = [];
            })(window, document, "script");
          }

          // Initialize pixel
          window.fbq("init", pixelId);
          isInitialized.current = true;
          loadingRef.current = false;
          resolve();
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

      // Script'i head'e ekle
      document.head.appendChild(script);
    });
  }, []);

  // User interaction sonrası yükleme
  const initializeOnInteraction = useCallback(
    (pixelId) => {
      const events = ["click", "scroll", "keydown", "touchstart"];

      const handleInteraction = () => {
        if (!isInitialized.current && !loadingRef.current) {
          loadMetaPixelScript(pixelId).catch(console.error);
        }

        // Event listener'ları temizle
        events.forEach((event) => {
          document.removeEventListener(event, handleInteraction);
        });
      };

      // Her event için listener ekle
      events.forEach((event) => {
        document.addEventListener(event, handleInteraction, {
          once: true,
          passive: true,
        });
      });

      // 3 saniye sonra otomatik yükle (fallback)
      const fallbackTimer = setTimeout(() => {
        if (!isInitialized.current && !loadingRef.current) {
          loadMetaPixelScript(pixelId).catch(console.error);
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

  // Settings değişiminde initialize
  useEffect(() => {
    if (settings?.metaPixelEnabled && settings?.metaPixelId) {
      if (!isInitialized.current && !loadingRef.current) {
        // User interaction'a kadar bekle
        const cleanup = initializeOnInteraction(settings.metaPixelId);
        return cleanup;
      }
    }
  }, [
    settings?.metaPixelEnabled,
    settings?.metaPixelId,
    initializeOnInteraction,
  ]);

  // Route değişiminde PageView track et (sadece pixel initialize ise)
  useEffect(() => {
    if (
      settings?.metaPixelEnabled &&
      settings?.metaPixelId &&
      isInitialized.current &&
      window.fbq
    ) {
      // Küçük delay ile PageView track et (DOM güncellensin diye)
      const trackTimer = setTimeout(() => {
        try {
          window.fbq("track", "PageView", {
            page_title: document.title,
            page_location: window.location.href,
            page_path: location.pathname,
          });
        } catch (error) {
          console.error("Meta Pixel PageView tracking error:", error);
        }
      }, 100);

      return () => clearTimeout(trackTimer);
    }
  }, [location.pathname, settings?.metaPixelEnabled, settings?.metaPixelId]);

  // Custom events için helper function
  useEffect(() => {
    // Global helper function ekle
    if (settings?.metaPixelEnabled && window.fbq && isInitialized.current) {
      window.trackMetaEvent = (eventName, parameters = {}) => {
        try {
          window.fbq("track", eventName, parameters);
        } catch (error) {
          console.error(`Meta Pixel ${eventName} tracking error:`, error);
        }
      };
    }

    // Cleanup function
    return () => {
      if (window.trackMetaEvent) {
        delete window.trackMetaEvent;
      }
    };
  }, [settings?.metaPixelEnabled, isInitialized.current]);

  return null;
};

export default MetaPixel;
