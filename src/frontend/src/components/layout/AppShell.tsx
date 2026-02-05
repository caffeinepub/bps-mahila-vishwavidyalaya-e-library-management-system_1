import { Link, useRouterState } from '@tanstack/react-router';
import { useGetCallerUserProfile, useIsCallerAdmin } from '../../hooks/useCallerContext';
import LoginButton from '../auth/LoginButton';
import { BookOpen, LayoutDashboard, Settings } from 'lucide-react';
import { SiCaffeine } from 'react-icons/si';

export default function AppShell({ children }: { children: React.ReactNode }) {
  const { data: userProfile } = useGetCallerUserProfile();
  const { data: isAdmin } = useIsCallerAdmin();
  const router = useRouterState();
  const currentPath = router.location.pathname;

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <header className="border-b border-border bg-card sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between gap-4">
            <div className="flex items-center gap-3 flex-1 min-w-0">
              <img 
                src="/assets/BPS_LOGO_PNG.png" 
                alt="BPS Mahila Vishwavidyalaya Logo" 
                className="w-12 h-12 sm:w-14 sm:h-14 object-contain flex-shrink-0" 
              />
              <div className="min-w-0">
                <h1 className="text-base sm:text-lg font-bold text-foreground leading-tight">
                  Bhagat Phool Singh Mahila Vishwavidyalaya
                </h1>
                <p className="text-xs text-muted-foreground leading-tight mt-0.5">
                  Khanpur Kalan, Sonepat, Haryana (India) Pin- 131305
                </p>
                <p className="text-xs text-muted-foreground leading-tight mt-0.5">
                  Accredited with 'B++' grade by NAAC
                </p>
                <p className="text-xs text-muted-foreground leading-tight mt-0.5 hidden sm:block">
                  A State University established by an Act of Haryana Legislature & recognized by U.G.C. under Section 2(f) and 12(B) of the U.G.C. Act 1956
                </p>
              </div>
            </div>
            <div className="flex items-center gap-4 flex-shrink-0">
              {userProfile && (
                <span className="text-sm text-muted-foreground hidden lg:inline">
                  Welcome, <span className="font-medium text-foreground">{userProfile.name}</span>
                </span>
              )}
              <LoginButton />
            </div>
          </div>
          <nav className="flex gap-2 mt-4">
            <Link
              to="/"
              className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                currentPath === '/'
                  ? 'bg-primary text-primary-foreground'
                  : 'text-muted-foreground hover:text-foreground hover:bg-accent'
              }`}
            >
              <LayoutDashboard className="w-4 h-4" />
              My Dashboard
            </Link>
            {isAdmin && (
              <Link
                to="/admin"
                className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                  currentPath === '/admin'
                    ? 'bg-primary text-primary-foreground'
                    : 'text-muted-foreground hover:text-foreground hover:bg-accent'
                }`}
              >
                <Settings className="w-4 h-4" />
                Admin Dashboard
              </Link>
            )}
          </nav>
        </div>
      </header>
      <main className="flex-1 container mx-auto px-4 py-8">{children}</main>
      <footer className="border-t border-border bg-card py-6 mt-auto">
        <div className="container mx-auto px-4 text-center text-sm text-muted-foreground">
          <p className="flex items-center justify-center gap-2">
            © 2026. Built with <BookOpen className="w-4 h-4 text-primary" /> using{' '}
            <a
              href="https://caffeine.ai"
              target="_blank"
              rel="noopener noreferrer"
              className="text-primary hover:underline inline-flex items-center gap-1"
            >
              <SiCaffeine className="w-4 h-4" />
              caffeine.ai
            </a>
          </p>
        </div>
      </footer>
    </div>
  );
}
