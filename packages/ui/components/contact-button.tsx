/* eslint-disable react-dom/no-dangerously-set-innerhtml -- needed for cal.com */
import type { ButtonProps } from '@gingga/ui/components/button'
import type { PropsWithChildren } from 'react'
import { Button } from '@gingga/ui/components/button'

export function ContactButton({ children, ...props }: PropsWithChildren<ButtonProps>) {
  const script = `<script type="text/javascript">
  (function (C, A, L) { let p = function (a, ar) { a.q.push(ar); }; let d = C.document; C.Cal = C.Cal || function () { let cal = C.Cal; let ar = arguments; if (!cal.loaded) { cal.ns = {}; cal.q = cal.q || []; d.head.appendChild(d.createElement("script")).src = A; cal.loaded = true; } if (ar[0] === L) { const api = function () { p(api, arguments); }; const namespace = ar[1]; api.q = api.q || []; if(typeof namespace === "string"){cal.ns[namespace] = cal.ns[namespace] || api;p(cal.ns[namespace], ar);p(cal, ["initNamespace", namespace]);} else p(cal, ar); return;} p(cal, ar); }; })(window, "https://app.cal.com/embed/embed.js", "init");
Cal("init", "gingga-session", {origin:"https://cal.com"});

  Cal.ns["gingga-session"]("ui", {"hideEventTypeDetails":false,"layout":"month_view"});
  </script>`

  return (
    <div>
      <div dangerouslySetInnerHTML={{ __html: script }} />
      <Button
        {...props}
        data-cal-link="ninja-squads-ebzydg/gingga-session"
        data-cal-namespace="gingga-session"
        data-cal-config='{"layout":"month_view"}'
      >
        {children}
      </Button>
    </div>
  )
}
