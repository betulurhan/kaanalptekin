import React, { useState, useEffect } from 'react';
import { X } from 'lucide-react';
import { useSiteData } from '../context/SiteDataContext';

const FALLBACK_NAME = 'Kaan Alp Tekin';
const AGENT_REPLY_INFO = 'Genellikle birkaç dakika içinde yanıt veririm';
const PROMPT_MESSAGE = 'Herhangi bir sorunuz varsa lütfen yazın?';
const FALLBACK_PHONE = '905360719655';

// Subtle WhatsApp-style chat backdrop pattern (data URI to avoid extra requests)
const WA_PATTERN_BG =
  "url(\"data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' width='80' height='80' viewBox='0 0 80 80'><g fill='%23dde2dc' fill-opacity='0.55'><circle cx='10' cy='10' r='1.2'/><circle cx='30' cy='20' r='1'/><circle cx='55' cy='12' r='1.4'/><circle cx='70' cy='30' r='1'/><circle cx='15' cy='50' r='1.2'/><circle cx='45' cy='55' r='1'/><circle cx='65' cy='65' r='1.3'/><circle cx='25' cy='75' r='1'/></g></svg>\")";

const WhatsAppIcon = ({ className }) => (
  <svg viewBox="0 0 24 24" className={className} fill="currentColor" aria-hidden="true">
    <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 0 1-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 0 1-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 0 1 2.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0 0 12.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 0 0 5.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 0 0-3.48-8.413z" />
  </svg>
);

export const WhatsAppButton = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [imgError, setImgError] = useState(false);
  const { contactInfo, aboutContent } = useSiteData();

  // Pull agent details from About content with fallback
  const agentName = aboutContent?.name || FALLBACK_NAME;
  const agentAvatar = aboutContent?.image || aboutContent?.profile_image || '';

  // Sanitize phone number to digits only
  const phoneNumber = (contactInfo?.phone || FALLBACK_PHONE).replace(/\D/g, '') || FALLBACK_PHONE;
  const waUrl = `https://wa.me/${phoneNumber}`;

  // Close on Escape
  useEffect(() => {
    if (!isOpen) return;
    const onKey = (e) => e.key === 'Escape' && setIsOpen(false);
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [isOpen]);

  const openWhatsApp = (e) => {
    if (e) {
      e.preventDefault();
      e.stopPropagation();
    }
    window.open(waUrl, '_blank', 'noopener,noreferrer');
  };

  return (
    <div
      className="fixed bottom-5 right-5 sm:bottom-6 sm:right-6"
      style={{ zIndex: 50 }}
      onMouseLeave={() => setIsOpen(false)}
      data-testid="whatsapp-widget"
    >
      {/* Preview Card */}
      {isOpen && (
        <div
          className="absolute bottom-[72px] right-0 w-[calc(100vw-40px)] max-w-[340px] rounded-2xl shadow-2xl overflow-hidden border border-slate-200 bg-white animate-in slide-in-from-bottom-4 fade-in duration-300"
          onClick={openWhatsApp}
          role="button"
          tabIndex={0}
          onKeyDown={(e) => (e.key === 'Enter' || e.key === ' ') && openWhatsApp(e)}
          data-testid="whatsapp-preview-card"
          style={{ cursor: 'pointer' }}
        >
          {/* Top Panel - Dark Green */}
          <div
            className="relative px-4 py-3.5 flex items-center gap-3"
            style={{ backgroundColor: '#075E54' }}
          >
            <div className="flex-shrink-0 w-12 h-12 rounded-full bg-white/20 ring-2 ring-white/30 overflow-hidden flex items-center justify-center">
              {agentAvatar && !imgError ? (
                <img
                  src={agentAvatar}
                  alt={agentName}
                  className="w-full h-full object-cover"
                  onError={() => setImgError(true)}
                  loading="lazy"
                />
              ) : (
                <span className="text-white font-bold text-lg">
                  {agentName.split(' ').map((n) => n[0]).join('').slice(0, 2)}
                </span>
              )}
            </div>
            <div className="flex-1 min-w-0 pr-7">
              <p className="text-white font-semibold text-sm truncate" data-testid="agent-name">
                {agentName}
              </p>
              <p className="text-green-100 text-[11px] leading-snug">
                <span className="inline-block w-1.5 h-1.5 rounded-full bg-green-300 mr-1 align-middle animate-pulse" />
                {AGENT_REPLY_INFO}
              </p>
            </div>
            <button
              onClick={(e) => {
                e.stopPropagation();
                setIsOpen(false);
              }}
              aria-label="Kapat"
              data-testid="whatsapp-close-btn"
              className="absolute top-2.5 right-2.5 w-6 h-6 rounded-full bg-white/15 hover:bg-white/25 flex items-center justify-center transition-colors"
            >
              <X className="w-3.5 h-3.5 text-white" />
            </button>
          </div>

          {/* Middle - WhatsApp themed chat area */}
          <div
            className="relative px-4 py-5"
            style={{
              background: '#e5ddd5',
              backgroundImage: WA_PATTERN_BG,
              backgroundSize: '160px 160px',
            }}
          >
            <div className="max-w-[85%]">
              <div
                className="relative bg-[#dcf8c6] text-slate-800 text-sm rounded-lg rounded-tl-none px-3 py-2 shadow-sm"
                data-testid="whatsapp-prompt-bubble"
              >
                {PROMPT_MESSAGE}
                <span className="block text-[10px] text-slate-500 text-right mt-1">
                  {new Date().toLocaleTimeString('tr-TR', { hour: '2-digit', minute: '2-digit' })}
                </span>
                {/* Bubble tail */}
                <span
                  className="absolute -left-[6px] top-0 w-0 h-0"
                  style={{
                    borderTop: '8px solid #dcf8c6',
                    borderLeft: '8px solid transparent',
                  }}
                />
              </div>
            </div>
          </div>

          {/* Bottom Panel - White with CTA */}
          <div className="px-4 py-4 bg-white border-t border-slate-100">
            <button
              onClick={openWhatsApp}
              data-testid="whatsapp-cta-btn"
              className="w-full flex items-center justify-center gap-2 bg-[#25D366] hover:bg-[#128C7E] text-white font-semibold py-3 rounded-xl transition-colors duration-200 shadow-md hover:shadow-lg"
            >
              <WhatsAppIcon className="w-5 h-5" />
              Bize Yazın
            </button>
          </div>
        </div>
      )}

      {/* Trigger Icon - WhatsApp logo */}
      <button
        onClick={() => setIsOpen((v) => !v)}
        onMouseEnter={() => setIsOpen(true)}
        aria-label={`${agentName} ile WhatsApp üzerinden iletişime geç`}
        data-testid="whatsapp-trigger-btn"
        className="relative w-14 h-14 sm:w-16 sm:h-16 rounded-full shadow-2xl flex items-center justify-center bg-[#25D366] hover:bg-[#128C7E] hover:scale-105 active:scale-95 transition-all duration-200"
      >
        <WhatsAppIcon className="w-7 h-7 sm:w-8 sm:h-8 text-white" />
        {/* Pulse ring (only when closed) */}
        {!isOpen && (
          <span className="absolute inset-0 rounded-full ring-4 ring-green-400/60 animate-ping pointer-events-none" />
        )}
      </button>
    </div>
  );
};

export default WhatsAppButton;
