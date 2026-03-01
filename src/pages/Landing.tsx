import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Clock, Database, Smartphone, ArrowRight, Sparkles, CheckCircle2, Star, Users, Trophy, Target } from "lucide-react";
import Navbar from "@/components/Navbar";
import heroImage from "@/assets/heroimage.jpg";
import icon1 from "@/assets/testimonial.png";
import icon2 from "@/assets/testimonial1.png";
import icon3 from "@/assets/testimonial2.png";

const Landing = () => {
  return (
    <div className="min-h-screen bg-background relative overflow-hidden">
      <Navbar />

      {/* Background Decorative Elements */}
      <div className="absolute top-0 left-0 w-full h-full overflow-hidden -z-10 opacity-30 dark:opacity-20 pointer-events-none">
        <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-primary/20 rounded-full blur-[120px] animate-pulse" />
        <div className="absolute bottom-[10%] right-[-5%] w-[35%] h-[35%] bg-indigo-500/10 rounded-full blur-[100px]" />
      </div>

      {/* Hero Section */}
      <section className="relative pt-32 sm:pt-40 pb-16 sm:pb-24 px-6 mesh-bg-light dark:mesh-bg">
        <div className="container mx-auto">
          <div className="grid lg:grid-cols-2 gap-12 sm:gap-16 items-center">
            <div className="space-y-6 sm:space-y-10 animate-fade-in text-center lg:text-left">
              <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 border border-primary/20 text-primary text-xs sm:text-sm font-medium animate-bounce shadow-sm mx-auto lg:mx-0">
                <Sparkles className="h-4 w-4" />
                <span>The #1 Rheumatology Board Prep</span>
              </div>

              <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-extrabold tracking-tight text-foreground leading-[1.2] sm:leading-[1.1]">
                Master the Boards with <span className="text-gradient">RheumZoom</span>
              </h1>

              <p className="text-lg sm:text-xl text-muted-foreground leading-relaxed max-w-xl mx-auto lg:mx-0">
                Evidence-Based, Exam-Focused, Fellowship-Approved. <br className="hidden md:block" />
                Guideline-Driven Content for Real-World Success.
              </p>

              <div className="flex flex-col sm:flex-row gap-4 sm:gap-5 mt-8 sm:mt-10 max-w-md mx-auto lg:mx-0">
                <Link to="/auth?mode=signup" className="w-full sm:w-auto">
                  <Button size="lg" className="btn-premium text-lg px-8 sm:px-10 py-6 sm:py-7 rounded-2xl w-full">
                    Create account
                    <ArrowRight className="ml-2 h-5 w-5 group-hover:translate-x-1 transition-transform" />
                  </Button>
                </Link>
                <Link to="/free-trial" className="w-full sm:w-auto">
                  <Button size="lg" variant="outline" className="text-lg px-8 sm:px-10 py-6 sm:py-7 rounded-2xl border-2 border-primary/20 hover:border-primary w-full transition-all duration-300">
                    Try Free Demo
                  </Button>
                </Link>
              </div>

              <div className="pt-8 flex flex-wrap gap-4 sm:gap-8 items-center justify-center lg:justify-start text-xs sm:text-sm font-medium text-muted-foreground opacity-80">
                <div className="flex items-center gap-2">
                  <Users className="h-4 w-4 sm:h-5 sm:w-5 text-primary" />
                  <span>600+ Questions</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="h-4 w-4 sm:h-5 sm:w-5 text-green-500" />
                  <span>ACR Guideline Aligned</span>
                </div>
              </div>
            </div>

            <div className="relative animate-in slide-in-from-bottom lg:slide-in-from-right duration-1000 flex justify-center mt-12 lg:mt-0">
              <div className="relative z-10 floating w-full max-w-[500px] lg:max-w-none">
                <div className="absolute -inset-1 bg-gradient-to-r from-primary to-indigo-600 rounded-2xl sm:rounded-3xl blur opacity-30 animate-pulse" />
                <img
                  src={heroImage}
                  alt="Board Prep Hero"
                  className="relative rounded-2xl sm:rounded-3xl shadow-2xl w-full border border-white/10"
                />
              </div>
              {/* Decorative Card */}
              <div className="absolute -bottom-6 -left-6 sm:-bottom-10 sm:-left-10 glass-card p-4 sm:p-6 rounded-xl sm:rounded-2xl shadow-2xl animate-fade-in hidden xl:block border border-white/20">
                <div className="flex items-center gap-4">
                  <div className="p-2 sm:p-3 bg-green-500/20 rounded-lg sm:rounded-xl">
                    <CheckCircle2 className="h-5 w-5 sm:h-6 sm:w-6 text-green-500" />
                  </div>
                  <div>
                    <div className="font-bold text-base sm:text-lg">98% Success Rate</div>
                    <div className="text-xs sm:text-sm opacity-70">Among active users</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Content Section */}
      <section className="py-16 sm:py-24 px-6 bg-slate-50/50 dark:bg-slate-900/50 border-y border-border/50">
        <div className="container mx-auto">
          <div className="text-center mb-12 sm:mb-20 space-y-4">
            <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold">Engineered for your Success</h2>
            <p className="text-lg sm:text-xl text-muted-foreground max-w-2xl mx-auto">
              We provide the most focused study material to ensure you pass your boards the first time.
            </p>
          </div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-10">
            {[
              {
                icon: Clock,
                title: "Timed Simulations",
                desc: "Simulate the pressure of the real exam with our timed test environment and detailed analytics."
              },
              {
                icon: Database,
                title: "Evidence-Based QBank",
                desc: "600+ questions covering RA, SLE, PsA, and more, all with deep medical explanations and references."
              },
              {
                icon: Smartphone,
                title: "Portable Learning",
                desc: "Study anywhere, anytime. Our platform is perfectly optimized for tablets and smartphones."
              }
            ].map((f, i) => (
              <div key={i} className="glass-card-hover p-8 sm:p-10 rounded-2xl sm:rounded-3xl border border-white/10 group">
                <div className="w-12 h-12 sm:w-16 sm:h-16 bg-primary/10 rounded-xl sm:rounded-2xl flex items-center justify-center mb-6 sm:mb-8 group-hover:bg-primary group-hover:text-primary-foreground transition-colors">
                  <f.icon className="h-6 w-6 sm:h-8 sm:w-8" />
                </div>
                <h3 className="text-xl sm:text-2xl font-bold mb-3 sm:mb-4">{f.title}</h3>
                <p className="text-muted-foreground leading-relaxed text-base sm:text-lg">
                  {f.desc}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Categories / Content Section */}
      <section className="py-16 sm:py-24 px-6">
        <div className="container mx-auto">
          <div className="glass-card p-8 sm:p-12 md:p-20 rounded-[2rem] sm:rounded-[3rem] overflow-hidden relative">
            <div className="absolute top-0 right-0 w-64 h-64 bg-primary/5 rounded-full blur-[80px] -mr-32 -mt-32" />
            <div className="grid lg:grid-cols-2 gap-12 sm:gap-16 items-center relative z-10">
              <div className="space-y-6 sm:space-y-8 text-center lg:text-left">
                <h2 className="text-3xl sm:text-4xl font-bold leading-tight">Comprehensive Board Content</h2>
                <div className="grid sm:grid-cols-2 gap-4 sm:gap-6 text-left">
                  {[
                    "RA, SLE & PsA",
                    "Crystal Diseases",
                    "Vasculitides",
                    "Derm in Rheum",
                    "Histology Essentials",
                    "Rheumatology Radiology",
                    "ACR Guidelines",
                    "Osteoporosis"
                  ].map((item, idx) => (
                    <div key={idx} className="flex items-center gap-3">
                      <CheckCircle2 className="h-4 w-4 sm:h-5 sm:w-5 text-primary shrink-0" />
                      <span className="font-medium text-base sm:text-lg">{item}</span>
                    </div>
                  ))}
                </div>
                <Link to="/auth?mode=signup" className="inline-block pt-4 sm:pt-6 w-full sm:w-auto">
                  <Button size="lg" className="rounded-2xl px-10 h-14 sm:h-16 text-lg w-full sm:w-auto">Start Practicing</Button>
                </Link>
              </div>
              <div className="grid grid-cols-2 gap-4 sm:gap-6 mt-8 sm:mt-0">
                <div className="space-y-4 sm:space-y-6 pt-6 sm:pt-12">
                  <div className="glass-card p-5 sm:p-8 rounded-2xl sm:rounded-3xl border border-white/20 shadow-xl sm:shadow-2xl hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors">
                    <Database className="h-8 w-8 sm:h-10 sm:w-10 text-primary mb-3 sm:mb-4" />
                    <div className="text-2xl sm:text-3xl font-bold">600+</div>
                    <div className="text-xs sm:text-sm text-muted-foreground font-medium">Flashcards</div>
                  </div>
                  <div className="glass-card p-5 sm:p-8 rounded-2xl sm:rounded-3xl border border-white/20 shadow-xl sm:shadow-2xl hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors">
                    <Star className="h-8 w-8 sm:h-10 sm:w-10 text-orange-500 mb-3 sm:mb-4" />
                    <div className="text-2xl sm:text-3xl font-bold">4.9/5</div>
                    <div className="text-xs sm:text-sm text-muted-foreground font-medium">User Rating</div>
                  </div>
                </div>
                <div className="space-y-4 sm:space-y-6">
                  <div className="glass-card p-5 sm:p-8 rounded-2xl sm:rounded-3xl border border-white/20 shadow-xl sm:shadow-2xl hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors">
                    <Users className="h-8 w-8 sm:h-10 sm:w-10 text-indigo-500 mb-3 sm:mb-4" />
                    <div className="text-2xl sm:text-3xl font-bold">1000+</div>
                    <div className="text-xs sm:text-sm text-muted-foreground font-medium">Active Fellows</div>
                  </div>
                  <div className="glass-card p-5 sm:p-8 rounded-2xl sm:rounded-3xl border border-white/20 shadow-xl sm:shadow-2xl hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors">
                    <CheckCircle2 className="h-8 w-8 sm:h-10 sm:w-10 text-green-500 mb-3 sm:mb-4" />
                    <div className="text-2xl sm:text-3xl font-bold">100%</div>
                    <div className="text-xs sm:text-sm text-muted-foreground font-medium">Focused Material</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section className="py-16 sm:py-24 bg-slate-900 text-white overflow-hidden relative px-6">
        <div className="absolute top-0 right-0 w-[50%] h-full bg-primary/10 rounded-full blur-[150px] pointer-events-none" />
        <div className="container mx-auto">
          <div className="text-center mb-12 sm:mb-20 space-y-4">
            <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold">Hear from your Colleagues</h2>
            <div className="flex justify-center gap-1">
              {[1, 2, 3, 4, 5].map(i => <Star key={i} className="h-5 w-5 sm:h-6 sm:w-6 text-yellow-400 fill-yellow-400" />)}
            </div>
          </div>

          <div className="grid md:grid-cols-3 gap-6 sm:gap-8">
            {[
              { img: icon1, name: "Dr. LM", text: "passed my boards, and I know using this deck was immensely helpful, so thank you." },
              { img: icon2, name: "Dr. AK", text: "Hello, I just wanted to thank you for creating the rheumatology study cards. I found out today that I passed the boards." },
              { img: icon3, name: "Dr. SM", text: "I cannot stress enough how vital it was for my study prep... and I passed!" }
            ].map((t, i) => (
              <div key={i} className="bg-white/5 backdrop-blur-lg p-8 sm:p-10 rounded-2xl sm:rounded-[2rem] border border-white/10 hover:border-white/20 transition-all flex flex-col items-center sm:items-start text-center sm:text-left h-full">
                <div className="flex flex-col sm:flex-row items-center gap-4 mb-6 sm:mb-8">
                  <img src={t.img} alt={t.name} className="w-14 h-14 sm:w-16 sm:h-16 rounded-full border-2 border-primary/50 object-cover" />
                  <div>
                    <h3 className="font-bold text-lg sm:text-xl">{t.name}</h3>
                    <div className="text-primary text-xs sm:text-sm font-semibold">Verified Board Pass</div>
                  </div>
                </div>
                <p className="text-base sm:text-lg italic opacity-80 leading-relaxed">
                  "{t.text}"
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Meet the Creator Section */}
      <section className="py-16 sm:py-24 px-6 relative">
        <div className="container mx-auto max-w-5xl">
          <div className="text-center space-y-8 sm:space-y-12">
            <h2 className="text-3xl sm:text-4xl font-bold italic text-primary/80">Meet the Creator</h2>
            <div className="glass-card p-8 sm:p-12 md:p-16 rounded-2xl sm:rounded-[3rem] text-left shadow-2xl relative overflow-hidden">
              <div className="absolute left-0 top-0 w-1 sm:w-2 h-full bg-primary" />

              <div className="space-y-6 sm:space-y-8 relative z-10">
                <p className="text-lg sm:text-xl leading-relaxed text-muted-foreground uppercase tracking-widest font-bold">
                  Fellows and test-takers deserve better.
                </p>

                <div className="h-px bg-border" />

                <div className="space-y-6">
                  <p className="text-lg leading-relaxed text-foreground/90">
                    RheumZoom was created by a <span className="text-primary font-bold underline decoration-primary/30 decoration-2 underline-offset-4">practicing board-certified rheumatologist</span> who recently went through the rheumatology board process and saw how little focused, high-yield preparation existed.
                  </p>
                  <p className="text-lg leading-relaxed text-foreground/90 font-medium">
                    This platform was built to help residents, fellows, and re-certifying practicing physicians study efficiently — <span className="text-primary">focusing only on what actually matters for the boards.</span>
                  </p>
                </div>

                <div className="grid sm:grid-cols-3 gap-6 pt-4">
                  {[
                    { icon: CheckCircle2, text: "Board-Certified expert" },
                    { icon: Star, text: "ACR Knowledge Bowl Winner" },
                    { icon: Database, text: "Published Academic Author" }
                  ].map((item, i) => (
                    <div key={i} className="flex items-center gap-3 bg-primary/5 p-4 rounded-xl border border-primary/10 hover:bg-primary/10 transition-colors">
                      <item.icon className="h-5 w-5 text-primary shrink-0" />
                      <span className="text-sm font-bold tracking-tight">{item.text}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-border bg-slate-50 dark:bg-slate-950 px-6 pt-16 sm:pt-20 pb-10">
        <div className="container mx-auto">
          <div className="flex flex-col md:flex-row justify-between items-center gap-8 md:gap-12 mb-12 sm:mb-16 px-4">
            <Link to="/" className="flex items-center gap-2">
              <div className="w-10 h-10 sm:w-12 sm:h-12 bg-primary rounded-xl sm:rounded-2xl flex items-center justify-center font-bold text-white text-xl sm:text-2xl shadow-lg shadow-primary/20">
                RZ
              </div>
              <span className="text-xl sm:text-2xl font-bold tracking-tight">RheumZoom™</span>
            </Link>
            <div className="flex flex-wrap justify-center gap-6 sm:gap-10 font-semibold text-muted-foreground text-sm sm:text-base">
              <Link to="/" className="hover:text-primary transition-colors">Home</Link>
              <Link to="/pricing" className="hover:text-primary transition-colors">Pricing</Link>
              <Link to="/features" className="hover:text-primary transition-colors">Features</Link>
              <Link to="/contact" className="hover:text-primary transition-colors">Contact</Link>
            </div>
          </div>
          <div className="h-px bg-border w-full mb-8 sm:mb-10" />
          <div className="flex flex-col md:flex-row justify-between items-center gap-6 text-xs sm:text-sm text-muted-foreground font-medium px-4 text-center sm:text-left">
            <div>Copyright © 2025 RheumZoom. All rights reserved.</div>
            <div className="flex gap-4 sm:gap-8">
              <Link to="/terms" className="hover:text-foreground">Terms</Link>
              <Link to="/privacy" className="hover:text-foreground">Privacy</Link>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Landing;
