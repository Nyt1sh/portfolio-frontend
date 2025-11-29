// src/hooks/useImagePreloader.js
import { useEffect, useState } from 'react';

export default function useImagePreloader(images = [], options = {}) {
  const { timeout = 7000, minDuration = 1000 } = options;
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    let mounted = true;
    let timerTimeout = null;

    // network detection: treat '2g', 'slow-2g', '3g' as slow
    const effectiveType = typeof navigator !== 'undefined' && navigator.connection && navigator.connection.effectiveType;
    const isSlowNetwork = effectiveType && /2g|slow-2g|3g/.test(effectiveType);

    if (!images || images.length === 0) {
      // still show skeleton for minDuration
      const minTimer = setTimeout(() => {
        if (mounted) setIsLoading(false);
      }, minDuration);
      return () => {
        mounted = false;
        clearTimeout(minTimer);
      };
    }

    const loaders = images.map((src) =>
      new Promise((resolve) => {
        const img = new Image();
        img.onload = () => resolve({ src, ok: true });
        img.onerror = () => resolve({ src, ok: false });
        img.src = src;
      })
    );

    const allLoaded = Promise.all(loaders);

    // enforce min duration
    const minDelay = new Promise((resolve) => setTimeout(resolve, minDuration));

    // safety timeout (if network broken)
    timerTimeout = setTimeout(() => {
      if (mounted) {
        // if slow network, keep isLoading true until minDuration at least
        if (!isSlowNetwork) {
          setIsLoading(false);
        }
        // if slow network, we still allow minDelay to finish then clear here; handled below
      }
    }, timeout);

    // wait for both minDelay and either allLoaded OR timeout to finish
    Promise.race([allLoaded, new Promise((r) => setTimeout(r, timeout))])
      .then(() => minDelay) // ensure minDuration
      .then(() => {
        if (mounted) {
          setIsLoading(false);
        }
      })
      .catch(() => {
        if (mounted) setIsLoading(false);
      });

    return () => {
      mounted = false;
      clearTimeout(timerTimeout);
    };
  }, [JSON.stringify(images), timeout, minDuration]);

  return isLoading;
}
