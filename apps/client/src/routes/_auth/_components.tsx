import { Link } from 'react-router'
import { useClientEnv } from '~/hooks/use-client-env'

interface AuthLayoutProps {
  children: React.ReactNode
}

export function AuthLayout({ children }: AuthLayoutProps) {
  const env = useClientEnv()

  return (
    <div className="text-foreground flex min-h-screen divide-black md:divide-x-6">
      {/* Right column with image */}
      <div className="hidden min-h-[100vh] flex-col overflow-hidden md:flex md:w-1/2">
        <img
          src={`${env.VITE_ASSETS_URL || ''}/automatas/footer_1.webp`}
          alt="Acme Inc."
          className="h-full w-full object-cover"
        />
      </div>

      {/* Left column with auth content */}
      <div className="relative flex w-full flex-col items-center md:w-1/2">
        <Link to="/" className="mx-auto block self-start pt-2 md:mr-auto">
          <img
            src={`${env.VITE_ASSETS_URL}/logo/logo-dark-v2.png`}
            alt="Logo"
            className="hidden w-32 dark:block"
          />
          <img
            src={`${env.VITE_ASSETS_URL}/logo/logo-light-v2.png`}
            alt="Logo"
            className="w-32 dark:hidden"
          />
        </Link>

        <div className="pt-4">{children}</div>
        <AuthFooter />
      </div>
    </div>
  )
}

export function AuthFooter() {
  return (
    <div className="border-border/10 mt-auto w-full pt-10 pb-4">
      <div className="text-muted-foreground container flex justify-center gap-4 text-sm">
        <Link
          to="/privacy"
          className="hover:text-brand-blue dark:hover:text-primary transition-colors"
        >
          Privacy Policy
        </Link>
        <Link
          to="/terms"
          className="hover:text-brand-blue dark:hover:text-primary transition-colors"
        >
          Terms of Service
        </Link>
        <Link
          to="/cookies"
          className="hover:text-brand-blue dark:hover:text-primary transition-colors"
        >
          Cookie Policy
        </Link>
      </div>
    </div>
  )
}
