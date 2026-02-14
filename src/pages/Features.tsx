import Navbar from "@/components/Navbar";
import { Card, CardContent } from "@/components/ui/card";
import { BookOpen, Brain, LineChart, Trophy, Clock, Target } from "lucide-react";

const Features = () => {
  const features = [
    {
      icon: BookOpen,
      title: "Comprehensive Question Bank",
      description: "Access 50+ pathology questions covering all major topics and concepts"
    },
    {
      icon: Brain,
      title: "Detailed Explanations",
      description: "Learn from in-depth explanations for every answer option to deepen your understanding"
    },
    {
      icon: LineChart,
      title: "Track Your Progress",
      description: "Monitor your performance with detailed statistics and progress tracking"
    },
    {
      icon: Trophy,
      title: "Multiple Subscription Tiers",
      description: "Choose from Basic, Standard, or Premium plans to match your study needs"
    },
    {
      icon: Clock,
      title: "Study at Your Pace",
      description: "Navigate through questions one at a time with full control over your learning speed"
    },
    {
      icon: Target,
      title: "Visual Diagrams",
      description: "Understand complex concepts with clear, illustrative diagrams"
    }
  ];

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      
      <main className="container mx-auto px-4 py-16">
        <div className="text-center mb-16">
          <h1 className="text-4xl md:text-5xl font-bold mb-4 mt-8">
            Powerful Features for Your Success
          </h1>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Everything you need to master pathology and ace your exams
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-6xl mx-auto">
          {features.map((feature, index) => {
            const Icon = feature.icon;
            return (
              <Card key={index} className="border-2 hover:border-primary transition-colors">
                <CardContent className="p-6">
                  <div className="mb-4 inline-flex p-3 bg-primary/10 rounded-lg">
                    <Icon className="h-6 w-6 text-primary" />
                  </div>
                  <h3 className="text-xl font-semibold mb-2">{feature.title}</h3>
                  <p className="text-muted-foreground">{feature.description}</p>
                </CardContent>
              </Card>
            );
          })}
        </div>

        <div className="mt-16 text-center">
          <h2 className="text-3xl font-bold mb-8">See How It Works</h2>
          <p className="text-muted-foreground mb-8">
            This deck is designed to help you study smarter, retain faster, and walk into the boards prepared & experience our interactive learning platform
          </p>
          <Card className="max-w-4xl mx-auto">
            <CardContent className="p-8">
              <div className="space-y-6">
                <div className="text-left">
                  <h3 className="text-xl font-semibold mb-4">Interactive Learning Experience</h3>
                  <ul className="space-y-3 text-muted-foreground">
                    <li className="flex items-start gap-2">
                      <span className="text-primary mt-1">✓</span>
                      <span>Select your answer from multiple choice options</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-primary mt-1">✓</span>
                      <span>Click "Show Answer" to reveal detailed explanations</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-primary mt-1">✓</span>
                      <span>Navigate through questions with Previous/Next buttons</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-primary mt-1">✓</span>
                      <span>Review summaries that tie all concepts together</span>
                    </li>
                  </ul>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  );
};

export default Features;