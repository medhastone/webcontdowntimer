'use client';

import React, { useState, useEffect, useCallback } from 'react';
import { createPortal } from 'react-dom';
import { usePathname } from 'next/navigation';
import {
  Share2,
  X,
  Copy,
  Check,
  MessageCircle,
  MessageSquare,
  Globe,
  Briefcase,
  Send,
  Hash,
  Bookmark,
  Mail,
  Smartphone,
  ExternalLink,
} from 'lucide-react';

interface SharePageButtonProps {
  variant?: 'toolbar' | 'icon';
  label?: string;
  className?: string;
}

const SITE_ORIGIN = 'https://webcountdowntimer.com';

export default function SharePageButton({
  variant = 'toolbar',
  label = 'Share',
  className = '',
}: SharePageButtonProps) {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);
  const [shareUrl, setShareUrl] = useState(`${SITE_ORIGIN}${pathname === '/' ? '' : pathname}`);
  const [shareTitle, setShareTitle] = useState('WebCountDownTimer');
  const [copied, setCopied] = useState(false);
  const [canNativeShare, setCanNativeShare] = useState(false);

  const syncPageMetadata = useCallback(() => {
    if (typeof window === 'undefined') return;
    const currentUrl = window.location.href || `${SITE_ORIGIN}${pathname === '/' ? '' : pathname}`;
    const currentTitle = document.title || 'WebCountDownTimer — Free Online Timers & Clocks';
    setShareUrl(currentUrl);
    setShareTitle(currentTitle);
    setCanNativeShare(typeof navigator !== 'undefined' && typeof navigator.share === 'function');
  }, [pathname]);

  const handleOpen = () => {
    syncPageMetadata();
    setCopied(false);
    setOpen(true);
  };

  useEffect(() => {
    if (!open) return;
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        setOpen(false);
      }
    };
    document.addEventListener('keydown', onKeyDown);
    return () => document.removeEventListener('keydown', onKeyDown);
  }, [open]);

  const handleCopyLink = async () => {
    try {
      if (navigator.clipboard && navigator.clipboard.writeText) {
        await navigator.clipboard.writeText(shareUrl);
      } else {
        const textarea = document.createElement('textarea');
        textarea.value = shareUrl;
        textarea.setAttribute('readonly', '');
        textarea.style.position = 'fixed';
        textarea.style.opacity = '0';
        document.body.appendChild(textarea);
        textarea.select();
        document.execCommand('copy');
        document.body.removeChild(textarea);
      }
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      setCopied(false);
    }
  };

  const handleNativeShare = async () => {
    if (typeof navigator === 'undefined' || typeof navigator.share !== 'function') return;
    try {
      await navigator.share({
        title: shareTitle,
        text: shareTitle,
        url: shareUrl,
      });
      setOpen(false);
    } catch {
      // User cancelled native share sheet; keep modal open cleanly.
    }
  };

  const encodedUrl = encodeURIComponent(shareUrl);
  const encodedTitle = encodeURIComponent(shareTitle);

  const socialChannels = [
    {
      name: 'WhatsApp',
      href: `https://wa.me/?text=${encodeURIComponent(`${shareTitle} ${shareUrl}`)}`,
      icon: MessageCircle,
      tileClass:
        'bg-emerald-50 text-emerald-700 border-emerald-200/80 dark:bg-emerald-950/50 dark:text-emerald-300 dark:border-emerald-800/60',
    },
    {
      name: 'X (Twitter)',
      href: `https://twitter.com/intent/tweet?text=${encodedTitle}&url=${encodedUrl}`,
      icon: MessageSquare,
      tileClass:
        'bg-neutral-100 text-neutral-900 border-neutral-200 dark:bg-neutral-800 dark:text-neutral-100 dark:border-neutral-700',
    },
    {
      name: 'Facebook',
      href: `https://www.facebook.com/sharer/sharer.php?u=${encodedUrl}`,
      icon: Globe,
      tileClass:
        'bg-blue-50 text-blue-700 border-blue-200/80 dark:bg-blue-950/50 dark:text-blue-300 dark:border-blue-800/60',
    },
    {
      name: 'LinkedIn',
      href: `https://www.linkedin.com/sharing/share-offsite/?url=${encodedUrl}`,
      icon: Briefcase,
      tileClass:
        'bg-sky-50 text-sky-700 border-sky-200/80 dark:bg-sky-950/50 dark:text-sky-300 dark:border-sky-800/60',
    },
    {
      name: 'Telegram',
      href: `https://t.me/share/url?url=${encodedUrl}&text=${encodedTitle}`,
      icon: Send,
      tileClass:
        'bg-cyan-50 text-cyan-700 border-cyan-200/80 dark:bg-cyan-950/50 dark:text-cyan-300 dark:border-cyan-800/60',
    },
    {
      name: 'Reddit',
      href: `https://www.reddit.com/submit?url=${encodedUrl}&title=${encodedTitle}`,
      icon: Hash,
      tileClass:
        'bg-orange-50 text-orange-700 border-orange-200/80 dark:bg-orange-950/50 dark:text-orange-300 dark:border-orange-800/60',
    },
    {
      name: 'Pinterest',
      href: `https://pinterest.com/pin/create/button/?url=${encodedUrl}&description=${encodedTitle}`,
      icon: Bookmark,
      tileClass:
        'bg-rose-50 text-rose-700 border-rose-200/80 dark:bg-rose-950/50 dark:text-rose-300 dark:border-rose-800/60',
    },
    {
      name: 'Email',
      href: `mailto:?subject=${encodedTitle}&body=${encodeURIComponent(`${shareTitle}\n\n${shareUrl}`)}`,
      icon: Mail,
      tileClass:
        'bg-[#E7EDE7] text-[#365C4B] border-[#CFE0D4] dark:bg-[#223029] dark:text-[#7EC4A0] dark:border-[#304439]',
    },
  ];

  const triggerButton =
    variant === 'icon' ? (
      <button
        type="button"
        data-shortcuts-ui="true"
        onClick={handleOpen}
        className={`inline-flex items-center justify-center p-1.5 rounded-lg text-[#252B27]/65 dark:text-slate-300 hover:text-[#365C4B] dark:hover:text-[#70B393] hover:bg-[#F7F6F2] dark:hover:bg-[#252D28] transition-colors cursor-pointer shrink-0 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#365C4B] ${className}`}
        aria-label="Share this tool"
        title="Share this tool"
      >
        <Share2 className="w-4 h-4" />
      </button>
    ) : (
      <button
        type="button"
        data-shortcuts-ui="true"
        onClick={handleOpen}
        className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-[#F7F6F2] dark:bg-[#222924] hover:bg-[#E7EDE7] dark:hover:bg-[#2A342D] border border-[#E4E1D9] dark:border-[#323D36] text-[#252B27] dark:text-slate-200 hover:text-[#365C4B] dark:hover:text-[#70B393] text-xs font-semibold transition-colors cursor-pointer whitespace-nowrap shrink-0 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#365C4B] ${className}`}
        aria-label="Share this tool"
        title="Share this tool"
      >
        <Share2 className="w-3.5 h-3.5 text-[#365C4B] dark:text-[#70B393] shrink-0" />
        <span>{label}</span>
      </button>
    );

  const modalContent =
    open && typeof document !== 'undefined'
      ? createPortal(
          <div
            className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-[#141816]/55 backdrop-blur-xs"
            onClick={() => setOpen(false)}
            role="dialog"
            aria-modal="true"
            aria-labelledby="share-dialog-title"
          >
            <div
              className="w-full max-w-md rounded-2xl bg-white dark:bg-[#1A201C] border border-[#E4E1D9] dark:border-[#2D352F] shadow-2xl overflow-hidden text-[#252B27] dark:text-[#E7EDE7]"
              onClick={(e) => e.stopPropagation()}
            >
              {/* Header */}
              <div className="flex items-start justify-between gap-3 px-5 pt-5 pb-4 border-b border-[#E4E1D9] dark:border-[#262D28]">
                <div className="min-w-0">
                  <h2
                    id="share-dialog-title"
                    className="text-base font-bold text-[#252B27] dark:text-white leading-snug"
                  >
                    Share this page
                  </h2>
                  <p className="text-xs text-[#252B27]/65 dark:text-slate-400 truncate mt-0.5">
                    {shareTitle}
                  </p>
                </div>
                <button
                  type="button"
                  onClick={() => setOpen(false)}
                  className="p-1.5 rounded-lg text-[#252B27]/60 dark:text-slate-400 hover:text-[#252B27] dark:hover:text-white hover:bg-[#F7F6F2] dark:hover:bg-[#252E28] transition-colors cursor-pointer shrink-0"
                  aria-label="Close share dialog"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              {/* Body */}
              <div className="p-5 space-y-4">
                {/* Social Apps Grid */}
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
                  {socialChannels.map((channel) => {
                    const Icon = channel.icon;
                    const isMailto = channel.href.startsWith('mailto:');
                    return (
                      <a
                        key={channel.name}
                        href={channel.href}
                        target={isMailto ? undefined : '_blank'}
                        rel={isMailto ? undefined : 'noopener noreferrer'}
                        onClick={() => setOpen(false)}
                        className="group flex flex-col items-center justify-center gap-2 p-3 rounded-xl border border-[#E4E1D9] dark:border-[#2A342E] bg-[#F7F6F2]/60 dark:bg-[#141816]/70 hover:border-[#365C4B] dark:hover:border-[#5E917A] hover:bg-white dark:hover:bg-[#202722] transition-colors min-h-[76px]"
                      >
                        <span
                          className={`w-9 h-9 rounded-lg border flex items-center justify-center transition-transform duration-150 group-hover:scale-105 ${channel.tileClass}`}
                        >
                          <Icon className="w-4 h-4" />
                        </span>
                        <span className="text-xs font-semibold text-[#252B27] dark:text-slate-200 whitespace-nowrap">
                          {channel.name}
                        </span>
                      </a>
                    );
                  })}
                </div>

                {/* Native Device Share (iOS / Android / OS Share Sheet) */}
                {canNativeShare && (
                  <button
                    type="button"
                    onClick={handleNativeShare}
                    className="w-full py-2.5 px-4 rounded-xl bg-[#365C4B] hover:bg-[#2B4A3C] text-white text-xs font-semibold flex items-center justify-center gap-2 transition-colors cursor-pointer whitespace-nowrap"
                  >
                    <Smartphone className="w-4 h-4 shrink-0" />
                    <span>Share via Device Apps</span>
                    <ExternalLink className="w-3.5 h-3.5 opacity-80 shrink-0" />
                  </button>
                )}

                {/* Copy Page Link */}
                <div className="pt-3 border-t border-[#E4E1D9] dark:border-[#262D28] space-y-1.5">
                  <label
                    htmlFor="share-page-url-input"
                    className="block text-xs font-semibold text-[#252B27]/75 dark:text-slate-300"
                  >
                    Page link
                  </label>
                  <div className="flex items-center gap-2">
                    <input
                      id="share-page-url-input"
                      type="text"
                      readOnly
                      value={shareUrl}
                      onFocus={(e) => e.currentTarget.select()}
                      className="flex-1 min-w-0 px-3 py-2 rounded-xl bg-[#F7F6F2] dark:bg-[#141816] border border-[#E4E1D9] dark:border-[#2D352F] text-xs font-mono text-[#252B27] dark:text-slate-200 focus:outline-hidden focus:border-[#365C4B]"
                    />
                    <button
                      type="button"
                      onClick={handleCopyLink}
                      className={`inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-semibold transition-colors cursor-pointer whitespace-nowrap shrink-0 ${
                        copied
                          ? 'bg-emerald-600 text-white'
                          : 'bg-[#252B27] dark:bg-[#365C4B] hover:opacity-90 text-white'
                      }`}
                    >
                      {copied ? (
                        <>
                          <Check className="w-3.5 h-3.5" />
                          <span>Copied</span>
                        </>
                      ) : (
                        <>
                          <Copy className="w-3.5 h-3.5" />
                          <span>Copy</span>
                        </>
                      )}
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>,
          document.body
        )
      : null;

  return (
    <>
      {triggerButton}
      {modalContent}
    </>
  );
}
