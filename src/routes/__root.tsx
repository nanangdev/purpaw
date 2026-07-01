import { HeadContent, Scripts, createRootRoute } from "@tanstack/react-router"
import { TanStackRouterDevtoolsPanel } from "@tanstack/react-router-devtools"
import { TanStackDevtools } from "@tanstack/react-devtools"
import { TooltipProvider } from "@/components/ui/tooltip"
import { ThemeProvider } from "@/components/theme/theme-provider"
import { TopLoadingBar } from "@/components/layout/top-loading-bar"
import { NotFound } from "@/components/not-found"

import appCss from "../styles.css?url"

export const Route = createRootRoute({
  head: () => ({
    meta: [
      {
        charSet: "utf-8",
      },
      {
        name: "viewport",
        content: "width=device-width, initial-scale=1",
      },
      {
        title: "Purpaw — Perawatan Kucing Cerdas dengan AI",
      },
    ],
    links: [
      {
        rel: "stylesheet",
        href: appCss,
      },
    ],
  }),
  notFoundComponent: NotFound,
  shellComponent: RootDocument,
})

function RootDocument({ children }: { children: React.ReactNode }) {
  return (
    <html lang="id" suppressHydrationWarning>
      <head>
        <HeadContent />
        <script
          dangerouslySetInnerHTML={{
            __html:
              "(function(){try{var t=localStorage.getItem('theme')||'auto';var d=t==='dark'||(t==='auto'&&window.matchMedia('(prefers-color-scheme: dark)').matches);var r=document.documentElement;r.classList.toggle('dark',d);r.style.colorScheme=d?'dark':'light';}catch(e){}})();",
          }}
        />
      </head>
      <body>
        <TopLoadingBar />
        <noscript
          dangerouslySetInnerHTML={{
            __html:
              '<div style="position:fixed;inset-inline:0;bottom:0;z-index:200;padding:0.75rem 1rem;background-color:var(--destructive);color:#fff;text-align:center;font-size:0.875rem;font-weight:500;">JavaScript dinonaktifkan. Aktifkan JavaScript untuk pengalaman terbaik di Purpaw.</div>',
          }}
        />
        <ThemeProvider>
          <TooltipProvider>{children}</TooltipProvider>
        </ThemeProvider>
        <TanStackDevtools
          config={{
            position: "bottom-right",
          }}
          plugins={[
            {
              name: "Tanstack Router",
              render: <TanStackRouterDevtoolsPanel />,
            },
          ]}
        />
        <Scripts />
      </body>
    </html>
  )
}
