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
    <div className="min-h-screen mesh-bg-light dark:mesh-bg relative overflow-hidden">
      <Navbar />

      {/* Hero Section */}
      <section className="relative pt-32 sm:pt-48 pb-16 sm:pb-32 px-6">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-7xl h-full -z-10 opacity-40">
          <div className="absolute top-[10%] left-[-5%] w-[40%] h-[40%] bg-primary/20 rounded-full blur-[140px] animate-pulse" />
          <div className="absolute bottom-[20%] right-[-10%] w-[50%] h-[50%] bg-indigo-500/10 rounded-full blur-[120px]" />
        </div>

        <div className="container mx-auto">
          <div className="grid lg:grid-cols-2 gap-20 items-center">
            <div className="space-y-10 animate-fade-in text-center lg:text-left">
              <div className="inline-flex items-center gap-2 px-6 py-2.5 rounded-full bg-primary/10 border border-primary/20 text-primary text-sm font-black uppercase tracking-[0.2em] shadow-sm mx-auto lg:mx-0">
                <Sparkles className="h-4 w-4" />
                <span>Success Engineered</span>
              </div>

              <h1 className="text-5xl sm:text-6xl md:text-8xl font-black tracking-tighter text-foreground leading-[0.9] italic">
                Master The <br />
                <span className="text-gradient">Boards.</span>
              </h1>

              <p className="text-2xl text-muted-foreground leading-relaxed max-w-xl mx-auto lg:mx-0 font-medium opacity-80">
                The high-yield rheumatology platform trusted by the nation's top fellows. ACR 2026 Guideline Aligned.
              </p>

              <div className="flex flex-col sm:flex-row gap-6 mt-12 max-w-md mx-auto lg:mx-0">
                <Link to="/auth?mode=signup" className="w-full sm:w-auto">
                  <Button size="lg" className="btn-premium text-xl px-12 py-8 rounded-[2rem] w-full shadow-2xl font-black italic">
                    Get Started
                    <ArrowRight className="ml-2 h-6 w-6 group-hover:translate-x-1 transition-transform" />
                  </Button>
                </Link>
                <Link to="/free-trial" className="w-full sm:w-auto">
                  <Button size="lg" variant="outline" className="text-xl px-10 py-8 rounded-[2rem] border-2 border-primary/20 hover:border-primary w-full transition-all duration-300 font-bold glass-card">
                    Demo Mode
                  </Button>
                </Link>
              </div>

              <div className="pt-12 flex flex-wrap gap-10 items-center justify-center lg:justify-start text-sm font-black uppercase tracking-wider text-muted-foreground opacity-60">
                <div className="flex items-center gap-3">
                  <Users className="h-5 w-5 text-primary" />
                  <span>600+ QBank Questions</span>
                </div>
                <div className="flex items-center gap-3">
                  <Trophy className="h-5 w-5 text-primary" />
                  <span>Knowledge Bowl Tested</span>
                </div>
              </div>
            </div>

            <div className="relative group animate-in slide-in-from-right duration-1000 hidden lg:block">
              <div className="absolute -inset-10 bg-gradient-to-r from-primary to-purple-600 rounded-[4rem] blur-[100px] opacity-20 animate-pulse" />
              <div className="relative z-10 floating">
                <img
                  src={heroImage}
                  alt="Board Prep Hero"
                  className="relative rounded-[3rem] shadow-3xl w-full border border-white/20 grayscale-[0.2] hover:grayscale-0 transition-all duration-700"
                />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Legacy Stats Section Removed for Cleaner UI per User Request */}

      {/* Main Content Sections */}
      <section className="py-32 px-6">
        <div className="container mx-auto">
          <div className="glass-card p-12 sm:p-24 rounded-[4rem] border-white/20 shadow-3xl relative overflow-hidden">
            <div className="absolute top-[-20%] right-[-10%] w-[600px] h-[600px] bg-primary/5 rounded-full blur-[120px] -z-10" />

            <div className="grid lg:grid-cols-2 gap-24 items-center">
              <div className="space-y-12">
                <h2 className="text-4xl sm:text-6xl font-black tracking-tighter italic opacity-90">
                  Comprehensive <br />
                  <span className="text-gradient">Board Coverage</span>
                </h2>

                <div className="grid sm:grid-cols-2 gap-8 text-left">
                  {[
                    "Clinical RA & SLE",
                    "Crystal Arthropathies",
                    "Systemic Vasculitis",
                    "Derm-Rheum Atlas",
                    "Histology Mastery",
                    "Advanced Radiology",
                    "ACR 2026 Updates",
                    "Bone Metabolism"
                  ].map((item, idx) => (
                    <div key={idx} className="flex items-center gap-4 group">
                      <div className="h-2 w-2 rounded-full bg-primary group-hover:scale-[3] transition-transform duration-300" />
                      <span className="font-bold text-xl opacity-70 group-hover:opacity-100 transition-opacity tracking-tight">{item}</span>
                    </div>
                  ))}
                </div>

                <div className="pt-8">
                  <Link to="/features">
                    <Button variant="link" className="text-primary font-black text-xl p-0 h-auto group">
                      Explore all features <ArrowRight className="ml-2 h-5 w-5 group-hover:translate-x-2 transition-transform" />
                    </Button>
                  </Link>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-8 lg:rotate-3">
                <div className="glass-card-hover p-10 rounded-[3rem] border-white/30 shadow-2xl space-y-4">
                  <Database className="h-12 w-12 text-primary" />
                  <div className="text-4xl font-black tracking-tighter leading-none">600+</div>
                  <div className="text-sm font-black uppercase tracking-widest opacity-50">Proven Questions</div>
                </div>
                <div className="glass-card-hover p-10 rounded-[3rem] border-white/30 shadow-2xl mt-12 space-y-4">
                  <CheckCircle2 className="h-12 w-12 text-green-500" />
                  <div className="text-4xl font-black tracking-tighter leading-none">100%</div>
                  <div className="text-sm font-black uppercase tracking-widest opacity-50">Pass-Oriented</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="py-32 px-6 relative bg-slate-900 overflow-hidden">
        <div className="container mx-auto relative z-10">
          <div className="text-center mb-24">
            <h2 className="text-4xl md:text-7xl font-black text-white italic tracking-tighter mb-6">Colleague <span className="opacity-40">Insights</span></h2>
            <div className="h-1.5 w-24 bg-primary mx-auto rounded-full" />
          </div>

          <div className="grid md:grid-cols-3 gap-12">
            {[
              { img: icon1, name: "Dr. LM", text: "Passed my boards. This deck was immensely helpful. Thank you." },
              { img: icon2, name: "Dr. AK", text: "Found out today that I passed the boards. The study cards were vital." },
              { img: icon3, name: "Dr. SM", text: "I cannot stress enough how vital this was for my prep... and I passed!" }
            ].map((t, i) => (
              <div key={i} className="bg-white/5 backdrop-blur-2xl p-12 rounded-[3.5rem] border border-white/10 hover:border-white/20 transition-all group">
                <div className="flex items-center gap-5 mb-10">
                  <img src={t.img} alt={t.name} className="w-16 h-16 rounded-full border-2 border-primary/50 grayscale group-hover:grayscale-0 transition-all duration-500" />
                  <div>
                    <h3 className="font-black text-white tracking-tight italic">{t.name}</h3>
                    <div className="text-primary text-xs font-black uppercase tracking-widest opacity-80">Verified Pass</div>
                  </div>
                </div>
                <p className="text-xl text-white/70 italic font-medium leading-relaxed leading-snug">
                  "{t.text}"
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Meet the Creator */}
      <section className="py-32 px-6">
        <div className="container mx-auto max-w-5xl">
          <div className="text-center space-y-12">
            <h2 className="text-4xl font-black tracking-tighter uppercase opacity-40 italic">Meet Your Specialist</h2>
            <div className="glass-card p-12 sm:p-24 rounded-[4rem] border-white/20 shadow-3xl text-left relative overflow-hidden group">
              <div className="absolute top-[-20%] left-[-20%] w-[500px] h-[500px] bg-primary/5 rounded-full blur-[100px] group-hover:bg-primary/10 transition-colors duration-700" />

              <div className="space-y-12 relative z-10">
                <p className="text-2xl italic font-black text-primary leading-none tracking-tight">
                  Fellows deserve a resource that respects their time.
                </p>

                <div className="h-px bg-gradient-to-r from-border via-primary/20 to-transparent" />

                <p className="text-2xl leading-relaxed text-foreground opacity-80 font-medium">
                  RheumZoom was built by a <span className="text-primary font-black underline decoration-4 underline-offset-8">Board-Certified Rheumatologist</span> who saw the need for high-yield, interactive board prep that focuses purely on clinical mastery.
                </p>

                <div className="grid sm:grid-cols-3 gap-8">
                  {[
                    { icon: CheckCircle2, text: "Specialist Vetted" },
                    { icon: Star, text: "Knowledge Bowl Winner" },
                    { icon: Sparkles, text: "Academic Excellence" }
                  ].map((item, i) => (
                    <div key={i} className="flex items-center gap-4 bg-primary/5 px-8 py-5 rounded-[2rem] border border-primary/10 group-hover:bg-primary/10 transition-colors">
                      <item.icon className="h-5 w-5 text-primary" />
                      <span className="text-sm font-black uppercase tracking-widest">{item.text}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-border bg-slate-50 dark:bg-slate-950 px-6 pt-24 pb-12">
        <div className="container mx-auto">
          <div className="flex flex-col md:flex-row justify-between items-center gap-16 mb-20 px-8">
            <Link to="/" className="flex items-center gap-4 group">
              <div className="w-14 h-14 bg-primary rounded-[1.25rem] flex items-center justify-center font-black text-white text-2xl shadow-2xl group-hover:scale-110 transition-transform">
                RZ
              </div>
              <span className="text-3xl font-black italic tracking-tighter">RheumZoom™</span>
            </Link>
            <div className="flex flex-wrap justify-center gap-12 font-black uppercase tracking-[0.15em] text-xs text-muted-foreground">
              <Link to="/pricing" className="hover:text-primary transition-colors">Pricing</Link>
              <Link to="/features" className="hover:text-primary transition-colors">Features</Link>
              <Link to="/contact" className="hover:text-primary transition-colors">Contact</Link>
            </div>
          </div>
          <div className="flex flex-col md:flex-row justify-between items-center gap-8 text-[10px] font-black uppercase tracking-[0.2em] opacity-40 px-8">
            <div>© 2025 RheumZoom Studio</div>
            <div className="flex gap-12">
              <Link to="/terms">Terms</Link>
              <Link to="/privacy">Privacy Policy</Link>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Landing;
