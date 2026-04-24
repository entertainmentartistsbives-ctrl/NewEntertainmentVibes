'use client';

import { useEffect, useRef } from 'react';

const AVATAR_EMBED_URL = "https://embed.liveavatar.com/v1/42f4e94f-4eec-431d-8110-67ca00153eec";

interface VirtualAssistantProps {
  onClose: () => void;
}

const VirtualAssistant = ({ onClose }: VirtualAssistantProps) => {
  const onCloseRef = useRef(onClose);

  useEffect(() => {
    onCloseRef.current = onClose;
  }, [onClose]);

  useEffect(() => {
    // Cleanup any existing elements
    ['heygen-streaming-embed', 'heygen-overlay', 'heygen-styles'].forEach(id => {
      const el = document.getElementById(id);
      if (el && el.parentNode) el.parentNode.removeChild(el);
    });

    const overlay = document.createElement('div');
    overlay.id = 'heygen-overlay';

    const wrapDiv = document.createElement('div');
    wrapDiv.id = 'heygen-streaming-embed';

    const closeBtn = document.createElement('button');
    closeBtn.id = 'heygen-close-btn';
    closeBtn.innerHTML = '✕';

    const stylesheet = document.createElement('style');
    stylesheet.id = 'heygen-styles';
    stylesheet.innerHTML = `
      #heygen-overlay {
        position: fixed; inset: 0;
        background: rgba(0,0,0,0.65);
        backdrop-filter: blur(6px);
        z-index: 9998;
        animation: heygenFadeIn 0.3s ease forwards;
      }
      #heygen-streaming-embed {
        z-index: 9999;
        position: fixed;
        bottom: 40px;
        right: 40px;
        width: 400px;
        height: 370px;
        border-radius: 20px;
        background: #0c0a08;
        border: 1px solid rgba(212,175,100,0.4);
        box-shadow: 0 24px 80px rgba(0,0,0,0.7), 0 0 0 1px rgba(212,175,100,0.1);
        overflow: hidden;
        animation: heygenSlideUp 0.4s cubic-bezier(0.25,0.8,0.25,1) forwards;
      }
      #heygen-iframe-wrapper {
        width: 100%;
        height: 540px;
        position: relative;
        top: 0;
        overflow: hidden;
      }
      #heygen-streaming-embed iframe {
        width: 100%;
        height: 540px;
        border: 0;
        display: block;
        position: absolute;
        top: 0;
        left: 0;
      }
      #heygen-close-btn {
        position: absolute; top: 12px; right: 12px;
        z-index: 10000; width: 34px; height: 34px;
        border-radius: 50%;
        border: 1px solid rgba(212,175,100,0.5);
        background: rgba(12,10,8,0.92);
        color: #D4AF64; font-size: 13px; cursor: pointer;
        display: flex; align-items: center; justify-content: center;
        backdrop-filter: blur(8px);
        transition: all 0.2s ease; line-height: 1;
      }
      #heygen-close-btn:hover {
        background: rgba(212,175,100,0.2);
        border-color: #D4AF64; transform: scale(1.1);
      }
      @media (max-width: 540px) {
        #heygen-streaming-embed {
          bottom: 0; left: 0; right: 0;
          width: 100%; height: 60vh;
          border-radius: 24px 24px 0 0;
        }
        #heygen-iframe-wrapper {
          height: 100vh;
        }
        #heygen-streaming-embed iframe {
          height: 100vh;
        }
      }
      @keyframes heygenFadeIn {
        from { opacity: 0; } to { opacity: 1; }
      }
      @keyframes heygenSlideUp {
        from { opacity: 0; transform: translateY(40px) scale(0.96); }
        to   { opacity: 1; transform: translateY(0) scale(1); }
      }
    `;

    const iframeWrapper = document.createElement('div');
    iframeWrapper.id = 'heygen-iframe-wrapper';

    const iframe = document.createElement('iframe');
    iframe.src = AVATAR_EMBED_URL;
    iframe.allow = 'microphone; camera';
    iframe.title = 'EntertainmentVibes Virtual Assistant';
    iframe.allowFullscreen = true;

    const handleClose = () => {
      ['heygen-streaming-embed', 'heygen-overlay', 'heygen-styles'].forEach(id => {
        const el = document.getElementById(id);
        if (el && el.parentNode) el.parentNode.removeChild(el);
      });
      if (onCloseRef.current) onCloseRef.current();
    };

    closeBtn.addEventListener('click', handleClose);
    overlay.addEventListener('click', handleClose);

    document.head.appendChild(stylesheet);
    iframeWrapper.appendChild(iframe);
    wrapDiv.appendChild(iframeWrapper);
    wrapDiv.appendChild(closeBtn);
    document.body.appendChild(overlay);
    document.body.appendChild(wrapDiv);

    return () => {
      // Don't necessarily remove on unmount if we want it to persist, 
      // but standard React behavior would be to cleanup.
      // handleClose(); 
    };
  }, []);

  return null;
};

export default VirtualAssistant;
