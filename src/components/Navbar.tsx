import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Moon, Sun, Menu, X } from "lucide-react";
import { useTheme } from "next-themes";
import { useState } from "react";
import {
  Sheet,
  SheetContent,
  SheetTrigger,
} from "@/components/ui/sheet";

const Navbar = () => {
  const { theme, setTheme } = useTheme();
  const [isOpen, setIsOpen] = useState(false);

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-white/70 dark:bg-slate-950/70 backdrop-blur-xl border-b border-border/40">
      <div className="container mx-auto px-6 py-4">
        <div className="flex items-center justify-between">
          <Link to="/" className="flex items-center gap-2 group">
            <div className="w-10 h-10 bg-primary rounded-xl flex items-center justify-center font-bold text-white text-xl shadow-lg shadow-primary/20 group-hover:scale-110 transition-transform">
              RZ
            </div>
            <span className="text-xl font-bold tracking-tight text-foreground">RheumZoom™</span>
          </Link>

          <div className="hidden md:flex items-center gap-8 font-medium">
            <Link to="/" className="text-muted-foreground hover:text-primary transition-colors">
              Home
            </Link>
            <Link to="/pricing" className="text-muted-foreground hover:text-primary transition-colors">
              Pricing
            </Link>
            <Link to="/features" className="text-muted-foreground hover:text-primary transition-colors">
              Features
            </Link>
            <Link to="/contact" className="text-muted-foreground hover:text-primary transition-colors">
              Contact
            </Link>
          </div>

          <div className="flex items-center gap-4">
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
              className="rounded-xl hover:bg-muted"
            >
              {theme === "dark" ? <Sun className="h-5 w-5" /> : <Moon className="h-5 w-5" />}
            </Button>
            <div className="hidden md:flex items-center gap-4">
              <Link to="/auth">
                <Button variant="ghost" className="rounded-xl font-semibold">
                  Sign In
                </Button>
              </Link>
              <Link to="/auth?mode=signup">
                <Button className="rounded-xl px-6 bg-primary font-semibold shadow-lg shadow-primary/20 transition-all hover:scale-105 active:scale-95">
                  Get started
                </Button>
              </Link>
            </div>

            <Sheet open={isOpen} onOpenChange={setIsOpen}>
              <SheetTrigger asChild className="md:hidden">
                <Button
                  variant="ghost"
                  size="icon"
                  className="rounded-xl hover:bg-muted"
                >
                  <Menu className="h-6 w-6" />
                </Button>
              </SheetTrigger>
              <SheetContent side="right" className="w-[300px] border-l border-border/40 bg-background/95 backdrop-blur-2xl">
                <div className="flex flex-col gap-6 mt-12 px-2">
                  <Link
                    to="/"
                    className="text-foreground/80 hover:text-primary transition-colors text-xl font-bold tracking-tight"
                    onClick={() => setIsOpen(false)}
                  >
                    Home
                  </Link>
                  <Link
                    to="/pricing"
                    className="text-foreground/80 hover:text-primary transition-colors text-xl font-bold tracking-tight"
                    onClick={() => setIsOpen(false)}
                  >
                    Pricing
                  </Link>
                  <Link
                    to="/features"
                    className="text-foreground/80 hover:text-primary transition-colors text-xl font-bold tracking-tight"
                    onClick={() => setIsOpen(false)}
                  >
                    Features
                  </Link>
                  <Link
                    to="/contact"
                    className="text-foreground/80 hover:text-primary transition-colors text-xl font-bold tracking-tight"
                    onClick={() => setIsOpen(false)}
                  >
                    Contact
                  </Link>
                  <Link
                    to="/terms"
                    className="text-foreground/60 hover:text-primary transition-colors text-sm font-medium"
                    onClick={() => setIsOpen(false)}
                  >
                    Terms of Service
                  </Link>
                  <Link
                    to="/privacy"
                    className="text-foreground/60 hover:text-primary transition-colors text-sm font-medium"
                    onClick={() => setIsOpen(false)}
                  >
                    Privacy Policy
                  </Link>
                  <div className="pt-8 mt-4 border-t border-border/40 flex flex-col gap-4">
                    <Link to="/auth" onClick={() => setIsOpen(false)} className="w-full">
                      <Button variant="ghost" className="w-full h-14 rounded-2xl font-bold text-lg">
                        Sign In
                      </Button>
                    </Link>
                    <Link to="/auth?mode=signup" onClick={() => setIsOpen(false)} className="w-full">
                      <Button className="btn-premium w-full h-14 rounded-2xl font-bold text-lg">
                        Get started
                      </Button>
                    </Link>
                  </div>
                </div>
              </SheetContent>
            </Sheet>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
