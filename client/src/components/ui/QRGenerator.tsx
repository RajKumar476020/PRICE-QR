import React, { useEffect, useRef, useState } from 'react';
import QRCodeLib from 'qrcode';
import { Download, Copy, Share2, Printer, Check, ExternalLink } from 'lucide-react';
import { Button } from './Button';
import { toast } from './Toast';
import { resolveImageUrl } from '../../services/api';

export interface QRGeneratorProps {
  url: string;
  businessName: string;
  businessLogoUrl?: string | null;
  size?: number;
  showActions?: boolean;
  onDownload?: () => void;
}

export const QRGenerator: React.FC<QRGeneratorProps> = ({
  url,
  businessName,
  businessLogoUrl,
  size = 260,
  showActions = true,
  onDownload,
}) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [copied, setCopied] = useState(false);
  const [svgString, setSvgString] = useState<string>('');

  useEffect(() => {
    if (!url) return;

    // Generate high resolution canvas (render at 3x for ultra-sharp download)
    const canvas = canvasRef.current;
    if (canvas) {
      QRCodeLib.toCanvas(
        canvas,
        url,
        {
          width: size * 2,
          margin: 2,
          color: {
            dark: '#111111',
            light: '#FFFFFF',
          },
          errorCorrectionLevel: 'H',
        },
        (error) => {
          if (error) console.error('QR Canvas generation error:', error);
        },
      );
    }

    // Generate SVG string for vector download
    QRCodeLib.toString(
      url,
      {
        type: 'svg',
        margin: 2,
        color: {
          dark: '#111111',
          light: '#FFFFFF',
        },
        errorCorrectionLevel: 'H',
      },
      (err, string) => {
        if (!err && string) {
          setSvgString(string);
        }
      },
    );
  }, [url, size]);

  const handleCopyLink = async () => {
    try {
      await navigator.clipboard.writeText(url);
      setCopied(true);
      toast.success('Link copied to clipboard!', url);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      toast.error('Failed to copy link.');
    }
  };

  const handleDownloadPNG = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const link = document.createElement('a');
    link.download = `${businessName.toLowerCase().replace(/[^a-z0-9]/g, '-')}-qr.png`;
    link.href = canvas.toDataURL('image/png');
    link.click();
    toast.success('QR Code downloaded as PNG');
    if (onDownload) onDownload();
  };

  const handleDownloadSVG = () => {
    if (!svgString) return;

    const blob = new Blob([svgString], { type: 'image/svg+xml;charset=utf-8' });
    const link = document.createElement('a');
    link.download = `${businessName.toLowerCase().replace(/[^a-z0-9]/g, '-')}-qr.svg`;
    link.href = URL.createObjectURL(blob);
    link.click();
    toast.success('QR Code downloaded as vector SVG');
    if (onDownload) onDownload();
  };

  const handleShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: `${businessName} Live Catalog & Prices`,
          text: `Scan or visit our digital business profile & price list: ${url}`,
          url,
        });
      } catch {}
    } else {
      handleCopyLink();
    }
  };

  const handlePrint = () => {
    window.print();
  };

  const resolvedLogo = resolveImageUrl(businessLogoUrl);

  return (
    <div className="flex flex-col items-center text-center">
      {/* Visual QR Card */}
      <div className="relative p-6 sm:p-7 bg-white rounded-3xl border border-slate-200 shadow-premium flex flex-col items-center max-w-sm w-full mx-auto">
        {/* Business Header above QR */}
        <div className="flex items-center gap-3 mb-4 text-left w-full border-b border-slate-100 pb-3">
          {resolvedLogo ? (
            <img
              src={resolvedLogo}
              alt={businessName}
              className="w-10 h-10 rounded-full object-cover border border-slate-200 shadow-subtle shrink-0"
            />
          ) : (
            <div className="w-10 h-10 rounded-full bg-brand-50 border border-brand-200 flex items-center justify-center font-bold text-brand-700 text-sm shrink-0">
              {businessName.slice(0, 2).toUpperCase()}
            </div>
          )}
          <div className="min-w-0 flex-1">
            <h4 className="text-sm font-bold text-slate-900 truncate tracking-tight">
              {businessName}
            </h4>
            <p className="text-[11px] text-slate-500 font-medium">Scan to View Products & Prices</p>
          </div>
        </div>

        {/* QR Canvas */}
        <div className="relative bg-white p-3 rounded-2xl border border-slate-100 shadow-sm flex items-center justify-center">
          <canvas
            ref={canvasRef}
            style={{ width: size, height: size }}
            className="rounded-lg max-w-full h-auto"
          />
        </div>

        {/* Public URL badge */}
        <div className="mt-4 pt-3 border-t border-slate-100 w-full flex items-center justify-between text-xs text-slate-500 font-mono bg-slate-50 px-3 py-2 rounded-xl">
          <span className="truncate pr-2">{url.replace(/^https?:\/\//, '')}</span>
          <button
            onClick={handleCopyLink}
            className="text-slate-600 hover:text-slate-900 shrink-0 font-sans text-[11px] font-semibold flex items-center gap-1"
          >
            {copied ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
            {copied ? 'Copied' : 'Copy'}
          </button>
        </div>
      </div>

      {/* Action Buttons */}
      {showActions && (
        <div className="mt-6 flex flex-wrap items-center justify-center gap-2.5 max-w-md w-full no-print">
          <Button
            variant="primary"
            size="sm"
            onClick={handleDownloadPNG}
            leftIcon={<Download className="w-4 h-4" />}
          >
            Download PNG
          </Button>

          <Button
            variant="secondary"
            size="sm"
            onClick={handleDownloadSVG}
            leftIcon={<Download className="w-4 h-4" />}
          >
            Download SVG
          </Button>

          <Button
            variant="secondary"
            size="sm"
            onClick={handleCopyLink}
            leftIcon={copied ? <Check className="w-4 h-4 text-emerald-600" /> : <Copy className="w-4 h-4" />}
          >
            {copied ? 'Copied!' : 'Copy Link'}
          </Button>

          <Button
            variant="secondary"
            size="sm"
            onClick={handleShare}
            leftIcon={<Share2 className="w-4 h-4" />}
          >
            Share
          </Button>

          <Button
            variant="secondary"
            size="sm"
            onClick={handlePrint}
            leftIcon={<Printer className="w-4 h-4" />}
          >
            Print
          </Button>

          <a
            href={url}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1.5 text-xs text-slate-600 hover:text-slate-900 font-semibold px-3 py-2 rounded-xl border border-slate-200 bg-white hover:bg-slate-50 transition-colors shadow-subtle"
          >
            <ExternalLink className="w-3.5 h-3.5" />
            Live Preview
          </a>
        </div>
      )}
    </div>
  );
};
