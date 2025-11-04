"use client";

import React, { useEffect, useMemo, useState } from 'react';
import { Document, Page, pdfjs } from 'react-pdf';

pdfjs.GlobalWorkerOptions.workerSrc = `https://unpkg.com/pdfjs-dist@${pdfjs.version}/build/pdf.worker.min.js`;

export default function PDFJSViewer({ url, className }: { url: string; className?: string }) {
  const [numPages, setNumPages] = useState<number | null>(null);
  const [scale, setScale] = useState(1.0);
  const [blobUrl, setBlobUrl] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  // Try to fetch the URL and create a blob URL to avoid cross-origin toolbar in some cases
  useEffect(() => {
    let active = true;
    setLoading(true);
    setBlobUrl(null);
    (async () => {
      try {
        const res = await fetch(url, { method: 'GET', mode: 'cors' });
        if (!active) return;
        if (!res.ok) {
          // fallback to original url
          setBlobUrl(null);
          return;
        }
        const buf = await res.blob();
        if (!active) return;
        const obj = URL.createObjectURL(buf);
        setBlobUrl(obj);
      } catch (e) {
        // network/CORS failed - fallback to original url
        setBlobUrl(null);
      } finally {
        if (active) setLoading(false);
      }
    })();
    return () => { active = false; };
  }, [url]);

  useEffect(() => {
    return () => {
      if (blobUrl) {
        try { URL.revokeObjectURL(blobUrl); } catch (e) {}
      }
    };
  }, [blobUrl]);

  const source = useMemo(() => ({ url: blobUrl || url }), [blobUrl, url]);

  return (
    <div
      className={`${className || ''} flex flex-col`}
      onContextMenu={(e) => e.preventDefault()} // disable right click inside viewer
    >
      <div className="flex items-center justify-end mb-3">
        <div className="flex items-center gap-2">
          <button className="px-2 py-1 bg-gray-100 rounded-md text-sm" onClick={() => setScale(s => Math.max(0.5, s - 0.25))} aria-label="Zoom out">-</button>
          <div className="text-sm">{Math.round(scale * 100)}%</div>
          <button className="px-2 py-1 bg-gray-100 rounded-md text-sm" onClick={() => setScale(s => Math.min(3, s + 0.25))} aria-label="Zoom in">+</button>
        </div>
      </div>

      <div className="w-full bg-white rounded-lg overflow-auto flex-1">
        {loading ? (
          <div className="p-8 text-center text-gray-500">Loading PDF…</div>
        ) : (
          <Document
            file={source}
            onLoadSuccess={(d) => { setNumPages(d.numPages); }}
            loading={<div className="p-8 text-center text-gray-500">Loading PDF…</div>}
            className="flex flex-col items-center"
          >
            {/* Render all pages in a vertical scrollable column for smooth scrolling */}
            {Array.from({ length: numPages || 0 }, (_, i) => (
              <div key={i} className="w-full flex justify-center my-4">
                <Page pageNumber={i + 1} scale={scale} renderTextLayer={false} renderAnnotationLayer={false} className="inline-block" />
              </div>
            ))}
          </Document>
        )}
      </div>
    </div>
  );
}
