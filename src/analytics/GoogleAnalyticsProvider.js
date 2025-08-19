import { useEffect, useRef } from "react";
import { useLocation } from "react-router-dom";
import axios from "axios";

const PUBLIC_SETTINGS_URL =
  "https://materialblog-server-production.up.railway.app/api/settings/public";

function loadGtag(measurementId) {
  // 1) gtag.js <script> etiketi
  const s1 = document.createElement("script");
  s1.async = true;
  s1.src = `https://www.googletagmanager.com/gtag/js?id=${measurementId}`;
  document.head.appendChild(s1);

  // 2) config script
  const s2 = document.createElement("script");
  s2.innerHTML = `
    window.dataLayer = window.dataLayer || [];
    function gtag(){ dataLayer.push(arguments); }
    gtag('js', new Date());
    // SPA: Otomatik page_view kapalı, manuel göndereceğiz
    gtag('config', '${measurementId}', { send_page_view: false });
  `;
  document.head.appendChild(s2);
}

function sendPageView(pathname) {
  if (!window.gtag) return;
  window.gtag("event", "page_view", {
    page_title: document.title,
    page_location: window.location.href,
    page_path: pathname,
  });
}

/**
 * Provider
 */
export default function GoogleAnalyticsProvider({ children }) {
  const location = useLocation();
  const isReadyRef = useRef(false);
  const currentIdRef = useRef(null);

  // İlk yükleme: public settings → gtag yükle → ilk page_view
  useEffect(() => {
    let cancelled = false;

    (async () => {
      try {
        const { data } = await axios.get(PUBLIC_SETTINGS_URL);
        const enabled = !!data?.gaEnabled;
        const id = (data?.gaMeasurementId || "").trim();

        if (!enabled || !id) return;

        // Aynı ID ikinci kez yüklenmesin
        if (currentIdRef.current !== id) {
          loadGtag(id);
          currentIdRef.current = id;
        }

        // gtag globalinin hazır olması için minik bekleyiş
        await new Promise((r) => setTimeout(r, 300));
        if (cancelled) return;

        isReadyRef.current = true;
        sendPageView(window.location.pathname);
      } catch {
        /* sessiz geç */
      }
    })();

    return () => {
      cancelled = true;
    };
  }, []);

  // Route değişiminde page_view gönder
  useEffect(() => {
    if (!isReadyRef.current) return;
    sendPageView(location.pathname);
  }, [location.pathname]);

  return children;
}

/**
 * (Opsiyonel) Bunu başka yerlerde event yollamak için kullanabilirsin.
 * Örn: trackGaEvent('like_post', { postId })
 */
export function trackGaEvent(action, params = {}) {
  if (!window.gtag) return;
  window.gtag("event", action, params);
}
