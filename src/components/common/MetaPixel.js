import { useEffect } from "react";
import { useSelector } from "react-redux";
import { useLocation } from "react-router-dom";
import { selectSettings } from "../../redux/settingsSlice";

const MetaPixel = () => {
  const settings = useSelector(selectSettings);
  const location = useLocation();

  useEffect(() => {
    if (settings?.metaPixelEnabled && settings?.metaPixelId) {
      // Eğer daha önce fbq yüklenmemişse, scripti ekle
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
          t = b.createElement(e);
          t.async = !0;
          t.src = "https://connect.facebook.net/en_US/fbevents.js";
          s = b.getElementsByTagName(e)[0];
          s.parentNode.insertBefore(t, s);
        })(window, document, "script");

        window.fbq("init", settings.metaPixelId); // sadece ilk seferde init
      }

      // Route değişiminde PageView tetikle
      if (window.fbq) {
        window.fbq("track", "PageView");
      }
    }
  }, [settings, location]);

  return null;
};

export default MetaPixel;
