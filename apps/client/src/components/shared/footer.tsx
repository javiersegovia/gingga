import {
  GithubIcon,
  LinkedInIcon,
  XTwitterIcon,
} from '@gingga/ui/components/social-icons'
import { cn } from '@gingga/ui/lib/utils'
import { Link } from 'react-router'
import { useClientEnv } from '~/hooks/use-client-env'

export function Footer({ className }: { className?: string }) {
  const env = useClientEnv()

  return (
    <footer
      className={cn('w-full border-t border-white/10 bg-black text-white', className)}
    >
      <div className="container py-12 md:py-16">
        <div className="flex flex-col justify-between gap-8 md:flex-row">
          {/* Company Info */}
          <div className="space-y-4 md:max-w-md">
            <Link to="/" className="inline-block">
              <img
                src={`${env.VITE_ASSETS_URL || ''}/logo/logo-dark-v2.png`}
                alt="Gingga Logo"
                className="h-8"
              />
            </Link>
            <p className="text-muted-foreground text-sm">
              Transforming businesses with AI-first solutions.
              {' '}
              <br />
              We help founders automate processes and build digital products that leverage
              the power of artificial intelligence.
            </p>
            <div className="flex space-x-4">
              <a
                href="https://twitter.com"
                target="_blank"
                rel="noopener noreferrer"
                className="text-muted-foreground hover:text-primary transition-colors"
              >
                <XTwitterIcon className="h-5 w-5" />
              </a>
              <a
                href="https://linkedin.com"
                target="_blank"
                rel="noopener noreferrer"
                className="text-muted-foreground hover:text-primary transition-colors"
              >
                <LinkedInIcon className="h-5 w-5" />
              </a>
              <a
                href="https://github.com"
                target="_blank"
                rel="noopener noreferrer"
                className="text-muted-foreground hover:text-primary transition-colors"
              >
                <GithubIcon className="h-5 w-5" />
              </a>
            </div>
          </div>

          {/* Services */}
          {/* <div>
            <h3 className="mb-4 text-base font-medium text-white">Services</h3>
            <ul className="text-muted-foreground space-y-2 text-sm">
              <li>
                <Link to="/" className="hover:text-primary transition-colors">
                  AI Agents
                </Link>
              </li>
            </ul>
          </div> */}
        </div>
      </div>

      {/* Bottom Bar */}
      <div className="border-t border-white/10">
        <div className="container flex flex-col items-center justify-between py-6 md:flex-row">
          <p className="text-muted-foreground mb-4 text-sm md:mb-0">
            ©
            {' '}
            {new Date().getFullYear()}
            {' '}
            Gingga. All rights reserved.
          </p>
          <div className="text-muted-foreground flex flex-col items-center gap-4 text-sm md:flex-row">
            <Link to="/privacy" className="hover:text-primary transition-colors">
              Privacy Policy
            </Link>
            <Link to="/terms" className="hover:text-primary transition-colors">
              Terms of Service
            </Link>
            <Link to="/cookies" className="hover:text-primary transition-colors">
              Cookie Policy
            </Link>
            <a
              href="mailto:hello@gingga.com"
              className="text-primary hover:text-primary/80 transition-colors"
            >
              hello@gingga.com
            </a>
          </div>
        </div>
      </div>
    </footer>
  )
}
