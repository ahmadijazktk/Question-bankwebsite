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
      icon: LineChart,
      title: "Performance Analytics",
      description: "Monitor your strengths and weaknesses with detailed statistics and progress tracking."
    },
    {
      icon: Trophy,
      title: "Award-Winning Method",
      description: "Study using the same techniques that won 1st place at the ACR Knowledge Bowl."
    },
    {
      icon: Clock,
      title: "Flexible Learning",
      description: "Navigate through questions at your own pace with timed and untimed simulation modes."
    },
    {
      icon: Target,
      title: "Radiology & Histology",
      description: "Master the visual components of the exam with high-resolution clinical images and diagrams."
    }
  ];

  return (
    <div className="min-h-screen bg-background relative overflow-hidden">
      <Navbar />

      {/* Decorative Background */}
      <div className="absolute top-0 left-0 w-full h-full overflow-hidden -z-10 opacity-30 pointer-events-none">
        <div className="absolute top-[10%] left-[-5%] w-[30%] h-[30%] bg-primary/20 rounded-full blur-[120px]" />
        <div className="absolute bottom-[20%] right-[-10%] w-[40%] h-[40%] bg-indigo-500/10 rounded-full blur-[100px]" />
      </div>

      <main className="container mx-auto px-6 py-24 sm:py-32">
        <div className="text-center mb-16 sm:mb-24 animate-fade-in">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 border border-primary/20 text-primary text-sm font-medium mb-6">
            <Trophy className="h-4 w-4" />
            <span>Success Engineered</span>
          </div>
          <h1 className="text-4xl md:text-6xl font-extrabold tracking-tight mb-6">
            Built For  <span className="text-gradient">Boards</span>
          </h1>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto leading-relaxed">
            Focused learning for certification and recertification success.          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-7xl mx-auto">
          {features.map((feature, index) => {
            const Icon = feature.icon;
            return (
              <div key={index} className="glass-card-hover p-8 rounded-[2rem] border border-white/10 group">
                <div className="mb-6 inline-flex p-4 bg-primary/10 rounded-2xl group-hover:bg-primary group-hover:text-primary-foreground transition-all duration-300">
                  <Icon className="h-8 w-8" />
                </div>
                <h3 className="text-2xl font-bold mb-4">{feature.title}</h3>
                <p className="text-muted-foreground leading-relaxed text-lg">{feature.description}</p>
              </div>
            );
          })}
        </div>

        <div className="mt-24 sm:mt-32">
          <div className="glass-card p-8 sm:p-16 rounded-[3rem] border border-white/20 shadow-2xl relative overflow-hidden">
            <div className="absolute top-0 right-0 p-12 opacity-5 pointer-events-none">
              <Target className="h-48 w-48" />
            </div>

            <div className="grid lg:grid-cols-2 gap-12 items-center">
              <div className="space-y-8">
                <h2 className="text-3xl sm:text-4xl font-bold">Interactive Board Simulation</h2>
                <p className="text-lg text-muted-foreground leading-relaxed">
                  Designed to help you study smarter, retain faster, and walk into the boards prepared. Experience a platform built by someone who has been exactly where you are.
                </p>

                <div className="space-y-4">
                  {[
                    "Real-time answer feedback with high-yield teaching points",
                    "Visual diagrams for complex radiographic and pathology findings",
                    "ACR Guideline-driven content updated for 2026",
                    "Flexible study modes: timed or un-timed"
                  ].map((item, i) => (
                    <div key={i} className="flex items-center gap-4">
                      <div className="h-6 w-6 rounded-full bg-green-500/20 flex items-center justify-center shrink-0">
                        <CheckCircle2 className="h-3 w-3 text-green-500" />
                      </div>
                      <span className="font-medium">{item}</span>
                    </div>
                  ))}
                </div>
              </div>

              <div className="bg-slate-900/50 dark:bg-black/50 p-8 rounded-3xl border border-white/10 shadow-inner">
                <div className="space-y-6 text-white">
                  <div className="flex items-center justify-between border-b border-white/10 pb-4">
                    <div className="font-bold uppercase tracking-wider text-xs opacity-50">Exam Practice Mode</div>
                    <div className="h-2 w-2 rounded-full bg-red-500 animate-pulse" />
                  </div>
                  <div className="space-y-3">
                    <div className="h-4 w-[90%] bg-white/20 rounded" />
                    <div className="h-4 w-[70%] bg-white/20 rounded" />
                  </div>
                  <div className="grid gap-3 pt-4">
                    {[1, 2, 3].map(i => (
                      <div key={i} className="h-12 border border-white/10 rounded-xl bg-white/5 flex items-center px-4 text-sm opacity-60">
                        Option {String.fromCharCode(64 + i)}...
                      </div>
                    ))}
                  </div>
                  <div className="pt-6">
                    <Button className="w-full btn-premium rounded-xl h-14 font-bold text-lg">Check Answer</Button>
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