import React, { useEffect, useState, useRef, forwardRef, useImperativeHandle } from "react";
import { useToast } from "@/Components/ui/use-toast";
import InputError from "@/Components/InputError";

const styles = `
  .g-recaptcha {
    transform-origin: left top;
    -webkit-transform-origin: left top;
  }

  .g-recaptcha iframe {
    min-width: 360px !important;
    min-height: 580px !important;
    transform: scale(1.2);
    -webkit-transform: scale(1.2);
    transform-origin: center;
    -webkit-transform-origin: center;
  }

  @media screen and (max-width: 480px) {
    .g-recaptcha iframe {
      transform: scale(1);
      -webkit-transform: scale(1);
    }
  }

  .rc-imageselect-popup {
    min-width: 360px !important;
    min-height: 580px !important;
  }
`;

const ReCaptcha = forwardRef(({ 
  enabled = false, 
  siteKey = null, 
  type = 'v2_invisible',
  action = 'submit',
  onVerify = () => {},
  error = null,
}, ref) => {
  const { toast } = useToast();
  const [isLoaded, setIsLoaded] = useState(false);
  const recaptchaRef = useRef(null);
  const widgetIdRef = useRef(null);

  useEffect(() => {
    if (enabled && siteKey) {
      // Store the original callbacks
      const originalSuccess = window.onRecaptchaSuccess;
      const originalExpired = window.onRecaptchaExpired;
      const originalError = window.onRecaptchaError;

      // Define callbacks for reCAPTCHA
      window.onRecaptchaSuccess = (token) => {
        onVerify(token);
      };

      window.onRecaptchaExpired = () => {
        onVerify('');
      };

      window.onRecaptchaError = () => {
        onVerify('');
        toast({
          title: "Error",
          description: "reCAPTCHA verification failed. Please try again.",
          variant: "destructive",
        });
      };

      // Cleanup existing reCAPTCHA
      if (widgetIdRef.current !== null && window.grecaptcha?.reset) {
        window.grecaptcha.reset(widgetIdRef.current);
        widgetIdRef.current = null;
      }

      // Wait for grecaptcha to be ready
      const waitForGrecaptcha = () => {
        if (window.grecaptcha?.ready) {
          window.grecaptcha.ready(() => {
            setIsLoaded(true);
            renderReCaptcha();
          });
        } else {
          setTimeout(waitForGrecaptcha, 100);
        }
      };

      // Load reCAPTCHA script based on type
      if (!document.querySelector('script[src*="recaptcha"]')) {
        const script = document.createElement('script');
        script.src = type === 'v3' 
          ? `https://www.google.com/recaptcha/api.js?render=${siteKey}`
          : 'https://www.google.com/recaptcha/api.js';
        script.async = true;
        script.defer = true;
        script.onload = waitForGrecaptcha;
        document.head.appendChild(script);
      } else {
        waitForGrecaptcha();
      }

      function renderReCaptcha() {
        if (type === 'v2_checkbox' && recaptchaRef.current && window.grecaptcha?.render) {
          try {
            // Reset if already rendered
            if (widgetIdRef.current !== null) {
              window.grecaptcha.reset(widgetIdRef.current);
            } else {
              // Render new widget
              widgetIdRef.current = window.grecaptcha.render(recaptchaRef.current, {
                sitekey: siteKey,
                callback: 'onRecaptchaSuccess',
                'expired-callback': 'onRecaptchaExpired',
                'error-callback': 'onRecaptchaError',
                'isolated': false,
                'size': 'normal',
                'theme': 'light'
              });
            }
          } catch (error) {
            if (!error.message.includes('already been rendered')) {
              console.error('reCAPTCHA render error:', error);
              toast({
                title: "Error",
                description: "Failed to load reCAPTCHA. Please refresh the page.",
                variant: "destructive",
              });
            }
          }
        }
      }

      return () => {
        // Cleanup
        if (widgetIdRef.current !== null && window.grecaptcha?.reset) {
          window.grecaptcha.reset(widgetIdRef.current);
          widgetIdRef.current = null;
        }

        // Restore original callbacks
        window.onRecaptchaSuccess = originalSuccess;
        window.onRecaptchaExpired = originalExpired;
        window.onRecaptchaError = originalError;
      };
    }
  }, [enabled, siteKey, type, onVerify]);

  useEffect(() => {
    // Add custom styles for reCAPTCHA
    const styleSheet = document.createElement('style');
    styleSheet.textContent = styles;
    document.head.appendChild(styleSheet);

    return () => {
      document.head.removeChild(styleSheet);
    };
  }, []);

  // Expose methods to parent component
  useImperativeHandle(ref, () => ({
    resetCaptcha: () => {
      if (window.grecaptcha && widgetIdRef.current !== null) {
        window.grecaptcha.reset(widgetIdRef.current);
        widgetIdRef.current = null;
      }
    },
    executeCaptcha: async () => {
      if (!enabled || !siteKey || !window.grecaptcha) {
        return null;
      }

      try {
        await new Promise(resolve => window.grecaptcha.ready(resolve));

        if (type === 'v3') {
          return await window.grecaptcha.execute(siteKey, { 
            action,
            timeout: 5000
          });
        } else if (type === 'v2_invisible') {
          return new Promise((resolve, reject) => {
            try {
              window.grecaptcha.execute(siteKey, { action })
                .then(resolve)
                .catch(reject);
            } catch (error) {
              reject(error);
            }
          });
        }
        return null;
      } catch (error) {
        console.error('ReCaptcha execution failed:', error);
        return null;
      }
    }
  }));

  if (!enabled) return null;

  return (
    <div className="recaptcha-wrapper">
      {type === 'v2_invisible' && (
        <div 
          className="g-recaptcha"
          data-sitekey={siteKey}
          data-size="invisible"
          data-callback="onRecaptchaSuccess"
          data-expired-callback="onRecaptchaExpired"
          data-error-callback="onRecaptchaError"
        />
      )}

      {type === 'v2_checkbox' && (
        <div className="mb-4">
          <div 
            ref={recaptchaRef}
            className="flex justify-center g-recaptcha-wrapper"
            style={{ minHeight: '78px' }}
          />
          {error && <InputError message={error} className="mt-2" />}
        </div>
      )}
    </div>
  );
});

ReCaptcha.displayName = 'ReCaptcha';

export default ReCaptcha; 