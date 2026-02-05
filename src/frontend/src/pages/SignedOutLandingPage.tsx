import LoginButton from '../components/auth/LoginButton';
import { BookOpen, Clock, Users, Shield } from 'lucide-react';

export default function SignedOutLandingPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-accent/5">
      <div className="container mx-auto px-4 py-12">
        <div className="text-center mb-12">
          <div className="flex flex-col items-center justify-center gap-4 mb-4">
            <img 
              src="/assets/BPS_LOGO_PNG.png" 
              alt="BPS Mahila Vishwavidyalaya Logo" 
              className="w-20 h-20 sm:w-24 sm:h-24 object-contain" 
            />
            <div className="text-center max-w-2xl">
              <h1 className="text-2xl sm:text-3xl font-bold text-foreground leading-tight mb-2">
                Bhagat Phool Singh Mahila Vishwavidyalaya
              </h1>
              <p className="text-sm text-muted-foreground leading-relaxed">
                Khanpur Kalan, Sonepat, Haryana (India) Pin- 131305
              </p>
              <p className="text-sm text-muted-foreground leading-relaxed mt-1">
                Accredited with 'B++' grade by NAAC
              </p>
              <p className="text-xs text-muted-foreground leading-relaxed mt-2">
                A State University established by an Act of Haryana Legislature & recognized by U.G.C. under Section 2(f) and 12(B) of the U.G.C. Act 1956
              </p>
            </div>
          </div>
        </div>

        <div className="max-w-5xl mx-auto">
          <div className="bg-card rounded-2xl shadow-lg overflow-hidden border border-border">
            <div className="grid md:grid-cols-2 gap-0">
              <div className="p-8 md:p-12 flex flex-col justify-center">
                <h2 className="text-3xl font-bold text-foreground mb-4">
                  Welcome to Our Digital Library
                </h2>
                <p className="text-muted-foreground mb-8 leading-relaxed">
                  Book your seat in advance and enjoy a comfortable study environment. Our modern e-library management system makes it easy to reserve your preferred computer station.
                </p>
                <div className="space-y-4 mb-8">
                  <div className="flex items-start gap-3">
                    <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center flex-shrink-0">
                      <Clock className="w-5 h-5 text-primary" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-foreground mb-1">2-Hour Slots</h3>
                      <p className="text-sm text-muted-foreground">Book convenient 2-hour time slots that fit your schedule</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center flex-shrink-0">
                      <Users className="w-5 h-5 text-primary" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-foreground mb-1">120 Seats Available</h3>
                      <p className="text-sm text-muted-foreground">Choose from general or reserved research scholar seats</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center flex-shrink-0">
                      <Shield className="w-5 h-5 text-primary" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-foreground mb-1">Secure Access</h3>
                      <p className="text-sm text-muted-foreground">Sign in securely with Internet Identity</p>
                    </div>
                  </div>
                </div>
                <div>
                  <LoginButton />
                </div>
              </div>
              <div className="relative h-64 md:h-auto">
                <img
                  src="/assets/ELibrary.jpeg"
                  alt="Library Reading Room"
                  className="absolute inset-0 w-full h-full object-cover"
                />
              </div>
            </div>
          </div>

          <div className="mt-12 text-center">
            <p className="text-sm text-muted-foreground">
              Need help? Contact the library administration for assistance.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
