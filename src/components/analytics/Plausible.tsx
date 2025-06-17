import { useEffect } from "react";
import { useOrganization } from "../../lib/api/organization";
import { useMe } from "../../lib/api/user";

interface AnalyticsEvent {
  n: string; // event name
  u: string; // url
  d: string; // domain
  r: string | null; // referrer
  m?: string; // meta (JSON string)
  p?: Record<string, string>; // props
}

interface EventOptions {
  meta?: Record<string, any>;
  props?: Record<string, string>;
  callback?: (response: { status: number }) => void;
}

export function Plausible() {
  const me = useMe();
  const organization = useOrganization();

  useEffect(() => {
    if (!me?.primaryEmail || !organization?.tenantId) return;

    // Custom analytics implementation
    function sendEvent(eventName: string, options: EventOptions = {}) {
      try {
        // Check if analytics is disabled in localStorage
        if (window.localStorage.getItem('plausible_ignore') === 'true') {
          console.warn('Ignoring Event: localStorage flag');
          if (options.callback) options.callback({ status: 200 });
          return;
        }
      } catch (e) {
        // localStorage not available
      }

      const eventData: AnalyticsEvent = {
        n: eventName,
        u: window.location.href,
        d: "app.deingpt.com",
        r: document.referrer || null,
      };

      // Add meta data if provided
      if (options.meta) {
        eventData.m = JSON.stringify(options.meta);
      }

      // Add props including user data
      const props: Record<string, string> = {
        'user-email': me.primaryEmail || '',
        'tenant-id': organization.tenantId || '',
        ...options.props,
      };
      eventData.p = props;

      // Send the event
      const xhr = new XMLHttpRequest();
      xhr.open('POST', '/api/analytics/event', true);
      xhr.setRequestHeader('Content-Type', 'text/plain');
      xhr.send(JSON.stringify(eventData));
      
      xhr.onreadystatechange = function() {
        if (xhr.readyState === 4 && options.callback) {
          options.callback({ status: xhr.status });
        }
      };
    }

    // Track page views
    let currentPath = window.location.pathname;

    function trackPageView() {
      if (currentPath !== window.location.pathname) {
        currentPath = window.location.pathname;
        sendEvent('pageview');
      }
    }

    function handleRouteChange() {
      trackPageView();
    }

    // Override history.pushState to track navigation
    const originalPushState = window.history.pushState;
    if (originalPushState) {
      window.history.pushState = function(...args) {
        originalPushState.apply(this, args);
        handleRouteChange();
      };
      window.addEventListener('popstate', handleRouteChange);
    }

    // Handle initial page load
    if (document.visibilityState === 'prerender') {
      document.addEventListener('visibilitychange', function() {
        if (!currentPath && document.visibilityState === 'visible') {
          trackPageView();
        }
      });
    } else {
      trackPageView();
    }

    // Make analytics function globally available
    window.plausible = sendEvent;

    // Cleanup function
    return () => {
      if (originalPushState) {
        window.history.pushState = originalPushState;
        window.removeEventListener('popstate', handleRouteChange);
      }
    };
  }, [me?.primaryEmail, organization?.tenantId]);

  return null;
}

// Extend window type for TypeScript
declare global {
  interface Window {
    plausible?: (eventName: string, options?: EventOptions) => void;
  }
}
