import Navbar from "@/components/Navbar";
import { Button } from "@/components/ui/button";
import { BookOpen, Brain, LineChart, Trophy, Clock, Target, CheckCircle2 } from "lucide-react";

const Features = () => {
  const features = [
    {
      icon: BookOpen,
      title: "Comprehensive QBank",
      description: "Access 600+ high-yield questions covering all major rheumatology board topics and concepts."
    },
    {
      icon: Brain,
      title: "Direct Explanations",
      description: "Learn from evidence-based, Guideline-driven explanations for every single answer option."
    },
    {
      icon: Trophy,
      title: "Award-Winning Method",
      description: "Study using the same techniques that won 1st place at the ACR Knowledge Bowl."
    },
    {
      icon: Target,
      title: "Radiology & Histology",
      description: "Master the visual components of the exam with high-resolution clinical images and diagrams."
    },
    {
      icon: Clock,
      title: "Timed Simulations",
      description: "Practice under pressure with realistic timed exam modes to build board-day stamina."
    },
    {
      icon: LineChart,
      title: "Progress Analytics",
      description: "Track your performance by category to identify and improve your clinical weaknesses."
    }
  ];

  return (
    <div className="min-h-screen mesh-bg-light dark:mesh-bg relative overflow-hidden">
      <Navbar />

      <main className="container mx-auto px-6 py-24 sm:py-32">
        <div className="text-center mb-16 sm:mb-24 animate-fade-in relative">
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[200px] h-[200px] bg-primary/10 rounded-full blur-[80px] -z-10" />
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 border border-primary/20 text-primary text-sm font-bold uppercase tracking-widest mb-6">
            <Trophy className="h-4 w-4" />
            <span>Success Engineered</span>
          </div>
          <h1 className="text-5xl md:text-7xl font-black tracking-tighter mb-8 italic">
            Built For <span className="text-gradient">The Boards</span>
          </h1>
          <p className="text-2xl text-muted-foreground max-w-2xl mx-auto leading-relaxed font-medium">
            Strategic learning for professional certification success.
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-7xl mx-auto">
          {features.map((feature, index) => {
            const Icon = feature.icon;
            return (
              <div key={index} className="glass-card-hover p-10 rounded-[2.5rem] border-white/20 shadow-xl group cursor-default">
                <div className="mb-8 inline-flex p-5 bg-primary/10 rounded-2xl group-hover:bg-primary group-hover:text-primary-foreground group-hover:scale-110 group-hover:rotate-3 transition-all duration-500 shadow-inner">
                  <Icon className="h-10 w-10" />
                </div>
                <h3 className="text-2xl font-black mb-4 tracking-tight uppercase opacity-80">{feature.title}</h3>
                <p className="text-muted-foreground leading-relaxed text-lg font-medium">{feature.description}</p>
              </div>
            );
          })}
        </div>

        <div className="mt-32 sm:mt-48">
          <div className="glass-card p-10 sm:p-20 rounded-[4rem] border-white/20 shadow-2xl relative overflow-hidden">
            <div className="absolute top-[-10%] right-[-10%] opacity-[0.03] pointer-events-none rotate-12">
              <Brain className="h-96 w-96 shadow-2xl" />
            </div>

            <div className="grid lg:grid-cols-2 gap-20 items-center">
              <div className="space-y-10 animate-fade-in">
                <h2 className="text-4xl sm:text-6xl font-black tracking-tighter leading-none">
                  Interactive <br />
                  <span className="text-primary">Board Simulation</span>
                </h2>
                <p className="text-xl text-muted-foreground leading-relaxed font-medium">
                  Experience a platform built by specialists who understand the rigors of the rheumatology boards. Every question is vetted for clinical accuracy and maximum retention.
                </p>

                <div className="space-y-6">
                  {[
                    "Real-time feedback with high-yield teaching pearls",
                    "Advanced medical imaging and histology integration",
                    "ACR 2026 Guideline updates built into core content",
                    "Dynamic study performance heatmaps"
                  ].map((item, i) => (
                    <div key={i} className="flex items-center gap-5 group">
                      <div className="h-8 w-8 rounded-xl bg-primary/15 flex items-center justify-center shrink-0 group-hover:bg-primary group-hover:scale-110 transition-all duration-300">
                        <CheckCircle2 className="h-5 w-5 text-primary group-hover:text-white" />
                      </div>
                      <span className="text-lg font-bold opacity-80 tracking-tight">{item}</span>
                    </div>
                  ))}
                </div>
              </div>

              <div className="relative group">
                <div className="absolute -inset-4 bg-gradient-to-r from-primary to-purple-600 rounded-[3rem] blur-2xl opacity-20 group-hover:opacity-40 transition-opacity duration-500" />
                <div className="relative bg-slate-900 dark:bg-black p-10 rounded-[2.5rem] border border-white/10 shadow-3xl transform group-hover:scale-[1.02] transition-transform duration-500">
                  <div className="space-y-8 text-white">
                    <div className="flex items-center justify-between border-b border-white/10 pb-6">
                      <div className="flex items-center gap-3">
                        <div className="h-3 w-3 rounded-full bg-red-500 animate-pulse" />
                        <div className="font-black uppercase tracking-[0.2em] text-xs opacity-60">Board Practice Mode</div>
                      </div>
                      <div className="text-xs font-mono opacity-40 italic">ID: 69a72bb...</div>
                    </div>

                    <div className="space-y-4">
                      <div className="h-5 w-full bg-white/10 rounded-full" />
                      <div className="h-5 w-[80%] bg-white/10 rounded-full" />
                      <div className="h-5 w-[60%] bg-white/10 rounded-full" />
                    </div>

                    <div className="grid gap-4 pt-4">
                      {['A', 'B', 'C'].map((label, i) => (
                        <div key={i} className="group/opt h-16 border border-white/5 rounded-2xl bg-white/5 flex items-center px-6 text-sm font-bold opacity-40 hover:opacity-100 hover:bg-white/10 hover:border-white/20 transition-all cursor-pointer">
                          <span className="mr-4 text-primary font-black">{label}</span>
                          Clinical diagnosis and management...
                        </div>
                      ))}
                    </div>

                    <div className="pt-8">
                      <Button className="w-full btn-premium rounded-2xl h-18 font-black text-xl shadow-2xl tracking-tight">
                        Check Answer
                      </Button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default Features;