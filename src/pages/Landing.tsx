import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Clock, Database, Smartphone, ArrowRight, Sparkles, CheckCircle2, Star, Users } from "lucide-react";
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
      <section className="relative pt-40 pb-24 px-6 mesh-bg-light dark:mesh-bg">
        <div className="container mx-auto">
          <div className="grid lg:grid-cols-2 gap-16 items-center">
            <div className="space-y-10 animate-fade-in text-left">
              <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 border border-primary/20 text-primary text-sm font-medium animate-bounce shadow-sm">
                <Sparkles className="h-4 w-4" />
                <span>The #1 Rheumatology Board Prep</span>
              </div>

              <h1 className="text-6xl lg:text-7xl font-extrabold tracking-tight text-foreground leading-[1.1]">
                Master the Boards with <span className="text-gradient">RheumZoom</span>
              </h1>

              <p className="text-xl text-muted-foreground leading-relaxed max-w-xl">
                Evidence-Based, Exam-Focused, Fellowship-Approved. <br className="hidden md:block" />
                Guideline-Driven Content for Real-World Success.
              </p>

              <div className="flex flex-col sm:flex-row gap-5 mt-10">
                <Link to="/auth?mode=signup" className="w-full sm:w-auto">
                  <Button size="lg" className="btn-premium text-lg px-10 py-7 rounded-2xl w-full">
                    Create account
                    <ArrowRight className="ml-2 h-5 w-5 group-hover:translate-x-1 transition-transform" />
                  </Button>
                </Link>
                <Link to="/free-trial" className="w-full sm:w-auto">
                  <Button size="lg" variant="outline" className="text-lg px-10 py-7 rounded-2xl border-2 border-primary/20 hover:border-primary w-full transition-all duration-300">
                    Try Free Demo
                  </Button>
                </Link>
              </div>

              <div className="pt-8 flex flex-wrap gap-8 items-center text-sm font-medium text-muted-foreground opacity-80">
                <div className="flex items-center gap-2">
                  <Users className="h-5 w-5 text-primary" />
                  <span>600+ Questions</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="h-5 w-5 text-green-500" />
                  <span>ACR Guideline Aligned</span>
                </div>
              </div>
            </div>

            <div className="relative animate-in slide-in-from-right duration-1000 flex justify-center">
              <div className="relative z-10 floating">
                <div className="absolute -inset-1 bg-gradient-to-r from-primary to-indigo-600 rounded-3xl blur opacity-30 animate-pulse" />
                <img
                  src={heroImage}
                  alt="Board Prep Hero"
                  className="relative rounded-3xl shadow-2xl w-full border border-white/10"
                />
              </div>
              {/* Decorative Card */}
              <div className="absolute -bottom-10 -left-10 glass-card p-6 rounded-2xl shadow-2xl animate-fade-in hidden xl:block border border-white/20">
                <div className="flex items-center gap-4">
                  <div className="p-3 bg-green-500/20 rounded-xl">
                    <CheckCircle2 className="h-6 w-6 text-green-500" />
                  </div>
                  <div>
                    <div className="font-bold text-lg">98% Success Rate</div>
                    <div className="text-sm opacity-70">Among active users</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="section-padding px-6 bg-slate-50/50 dark:bg-slate-900/50 border-y border-border/50">
        <div className="container mx-auto">
          <div className="text-center mb-20 space-y-4">
            <h2 className="text-4xl md:text-5xl font-bold">Engineered for your Success</h2>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              We provide the most focused study material to ensure you pass your boards the first time.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-10">
            {[
              {
                icon: Clock,
                title: "Timed Simulations",
                desc: "Simulate the pressure of the real exam with our timed test environment and detailed post-test analytics."
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
              <div key={i} className="glass-card-hover p-10 rounded-3xl border border-white/10 group">
                <div className="w-16 h-16 bg-primary/10 rounded-2xl flex items-center justify-center mb-8 group-hover:bg-primary group-hover:text-primary-foreground transition-colors">
                  <f.icon className="h-8 w-8" />
                </div>
                <h3 className="text-2xl font-bold mb-4">{f.title}</h3>
                <p className="text-muted-foreground leading-relaxed text-lg">
                  {f.desc}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Categories / Content Section */}
      <section className="section-padding px-6">
        <div className="container mx-auto">
          <div className="glass-card p-12 md:p-20 rounded-[3rem] overflow-hidden relative">
            <div className="absolute top-0 right-0 w-64 h-64 bg-primary/5 rounded-full blur-[80px] -mr-32 -mt-32" />
            <div className="grid lg:grid-cols-2 gap-16 items-center relative z-10">
              <div className="space-y-8">
                <h2 className="text-4xl font-bold leading-tight">Comprehensive Board Content</h2>
                <div className="grid sm:grid-cols-2 gap-6">
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
                      <CheckCircle2 className="h-5 w-5 text-primary shrink-0" />
                      <span className="font-medium text-lg">{item}</span>
                    </div>
                  ))}
                </div>
                <Link to="/auth?mode=signup" className="inline-block pt-6">
                  <Button size="lg" className="rounded-2xl px-10 h-16 text-lg">Start Practicing</Button>
                </Link>
              </div>
              <div className="grid grid-cols-2 gap-6">
                <div className="space-y-6 pt-12">
                  <div className="glass-card p-8 rounded-3xl border border-white/20 shadow-2xl hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors">
                    <Database className="h-10 w-10 text-primary mb-4" />
                    <div className="text-3xl font-bold">600+</div>
                    <div className="text-muted-foreground font-medium">Flashcards</div>
                  </div>
                  <div className="glass-card p-8 rounded-3xl border border-white/20 shadow-2xl hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors">
                    <Star className="h-10 w-10 text-orange-500 mb-4" />
                    <div className="text-3xl font-bold">4.9/5</div>
                    <div className="text-muted-foreground font-medium">User Rating</div>
                  </div>
                </div>
                <div className="space-y-6">
                  <div className="glass-card p-8 rounded-3xl border border-white/20 shadow-2xl hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors">
                    <Users className="h-10 w-10 text-indigo-500 mb-4" />
                    <div className="text-3xl font-bold">1000+</div>
                    <div className="text-muted-foreground font-medium">Active Fellows</div>
                  </div>
                  <div className="glass-card p-8 rounded-3xl border border-white/20 shadow-2xl hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors">
                    <CheckCircle2 className="h-10 w-10 text-green-500 mb-4" />
                    <div className="text-3xl font-bold">100%</div>
                    <div className="text-muted-foreground font-medium">Focused Material</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section className="section-padding bg-slate-900 text-white overflow-hidden relative">
        <div className="absolute top-0 right-0 w-[50%] h-full bg-primary/10 rounded-full blur-[150px] pointer-events-none" />
        <div className="container mx-auto">
          <div className="text-center mb-20 space-y-4">
            <h2 className="text-4xl md:text-5xl font-bold">Hear from your Colleagues</h2>
            <div className="flex justify-center gap-1">
              {[1, 2, 3, 4, 5].map(i => <Star key={i} className="h-6 w-6 text-yellow-400 fill-yellow-400" />)}
            </div>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {[
              { img: icon1, name: "Dr. LM", text: "passed my boards, and I know using this deck was immensely helpful, so thank you." },
              { img: icon2, name: "Dr. AK", text: "Hello, I just wanted to thank you for creating and sharing the rheumatology study cards. I found out today that I passed the boards." },
              { img: icon3, name: "Dr. SM", text: "I cannot stress enough how vital it was for my study prep, how much money you saved me... and I passed!" }
            ].map((t, i) => (
              <div key={i} className="bg-white/5 backdrop-blur-lg p-10 rounded-[2rem] border border-white/10 hover:border-white/20 transition-all flex flex-col h-full">
                <div className="flex items-center gap-4 mb-8">
                  <img src={t.img} alt={t.name} className="w-16 h-16 rounded-full border-2 border-primary/50 object-cover" />
                  <div>
                    <h3 className="font-bold text-xl">{t.name}</h3>
                    <div className="text-primary text-sm font-semibold">Verified Board Pass</div>
                  </div>
                </div>
                <p className="text-lg italic opacity-80 leading-relaxed">
                  "{t.text}"
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* About Section */}
      <section className="section-padding px-6 relative">
        <div className="container mx-auto max-w-5xl">
          <div className="text-center space-y-12">
            <h2 className="text-4xl font-bold">Built by Fellows, for Fellows</h2>
            <div className="glass-card p-12 md:p-16 rounded-[3rem] text-xl leading-relaxed text-muted-foreground shadow-2xl relative overflow-hidden">
              <div className="absolute left-0 top-0 w-2 h-full bg-primary" />
              <p className="relative z-10">
                The Rheumatology Board Exam is notoriously difficult — review courses that cost hundreds to thousands of dollars.
                <span className="text-foreground font-semibold"> Fellows and test-takers deserve better.</span>
              </p>
              <div className="h-px bg-border my-10" />
              <p className="relative z-10">
                I built this digital flashcard deck and question bank tailored for passing the
                Rheumatology Board Certification Exam after graduating from a respected program and winning 1st place at the ACR Knowledge Bowl.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-border bg-slate-50 dark:bg-slate-950 px-6 pt-20 pb-10">
        <div className="container mx-auto">
          <div className="flex flex-col md:flex-row justify-between items-center gap-12 mb-16 px-4">
            <Link to="/" className="flex items-center gap-2">
              <div className="w-12 h-12 bg-primary rounded-2xl flex items-center justify-center font-bold text-white text-2xl shadow-lg shadow-primary/20">
                RZ
              </div>
              <span className="text-2xl font-bold tracking-tight">RheumZoom™</span>
            </Link>
            <div className="flex flex-wrap justify-center gap-10 font-semibold text-muted-foreground">
              <Link to="/" className="hover:text-primary transition-colors">Home</Link>
              <Link to="/pricing" className="hover:text-primary transition-colors">Pricing</Link>
              <Link to="/features" className="hover:text-primary transition-colors">Features</Link>
              <Link to="/contact" className="hover:text-primary transition-colors">Contact</Link>
            </div>
          </div>
          <div className="h-px bg-border w-full mb-10" />
          <div className="flex flex-col md:flex-row justify-between items-center gap-6 text-sm text-muted-foreground font-medium px-4">
            <div>Copyright © 2025 RheumZoom. All rights reserved.</div>
            <div className="flex gap-8">
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
