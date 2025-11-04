"use client";

import { useEffect } from 'react';

/**
 * Disable right-click / context menu across the entire page.
 * This attaches a document-level listener on mount and removes it on unmount.
 *
 * Note: This prevents the native context menu for all users — consider
 * accessibility and support for power users before enabling site-wide.
 */
export default function DisableContextMenu() {
  useEffect(() => {
    const onContext = (e: MouseEvent) => {
      e.preventDefault();
    };
    document.addEventListener('contextmenu', onContext);
    return () => document.removeEventListener('contextmenu', onContext);
  }, []);

  return null;
}
