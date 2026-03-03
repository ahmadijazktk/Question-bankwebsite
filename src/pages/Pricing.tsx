import Navbar from "@/components/Navbar";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Check } from "lucide-react";
import { Link } from "react-router-dom";

const Pricing = () => {
  const plans = [
    {
      name: "1 Month",
      price: "$59.99",
      period: "per month",
      features: [
        "Full access to 600+ board-style questions",
        "Evidence-based, guideline-driven explanations",
        "High-resolution clinical images & charts",
        "Interactive flashcard display mode",
        "Immediate performance feedback"
      ],
    },
    {
      name: "3 Months",
      price: "$99.99",
      period: "one-time",
      popular: true,
      features: [
        "All 1 Month features included",
        "Comprehensive Radiology & Histology QBank",
        "ACR Knowledge Bowl Study Method",
        "Full Board Simulation practice exams",
        "Priority content updates"
      ],
    },
    {
      name: "12 Months",
      price: "$149.99",
      period: "per year",
      features: [
        "All 3 Months features included",
        "Personalized progress tracking dashboard",
        "Category-specific weakness analysis",
        "Full mobile-optimized experience",
        "Locked-in price for recertification"
      ],
    },
  ];

  return (
    <div className="min-h-screen mesh-bg-light dark:mesh-bg">
      <Navbar />

      <section className="pt-32 pb-20 px-6 relative overflow-hidden">
        {/* Abstract Background Shapes */}
        <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-primary/5 rounded-full blur-[100px] -z-10" />
        <div className="absolute bottom-0 left-0 w-[300px] h-[300px] bg-indigo-500/5 rounded-full blur-[80px] -z-10" />

        <div className="container mx-auto">
          <div className="text-center mb-16 animate-fade-in">
            <h1 className="text-5xl md:text-6xl font-extrabold mb-6 tracking-tight">
              Invest in Your <span className="text-gradient">Success</span>
            </h1>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto leading-relaxed">
              Choose the plan that fits your study timeline. All plans include
              complete access to our evidence-based rheumatology question bank.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto">
            {plans.map((plan) => (
              <Card
                key={plan.name}
                className={`glass-card-hover rounded-[2rem] p-4 transition-all duration-500 border-white/20 shadow-2xl ${plan.popular ? "scale-105 border-primary/30 z-10" : "scale-100"
                  }`}
              >
                {plan.popular && (
                  <div className="absolute -top-5 left-1/2 -translate-x-1/2 bg-primary text-primary-foreground px-6 py-1.5 rounded-full text-sm font-bold shadow-lg uppercase tracking-wider">
                    Most Popular
                  </div>
                )}
                <CardHeader className="text-center">
                  <CardTitle className="text-2xl font-bold uppercase tracking-wide opacity-70">
                    {plan.name}
                  </CardTitle>
                  <div className="mt-6">
                    <span className="text-5xl font-extrabold tracking-tight">{plan.price}</span>
                    <div className="text-muted-foreground mt-2 font-medium">{plan.period}</div>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="my-8 h-px bg-gradient-to-r from-transparent via-border to-transparent" />
                  <ul className="space-y-4 mb-8">
                    {plan.features.map((feature) => (
                      <li key={feature} className="flex items-start gap-3">
                        <div className="mt-1 bg-primary/20 rounded-full p-0.5">
                          <Check className="h-4 w-4 text-primary" />
                        </div>
                        <span className="text-sm font-medium leading-tight">{feature}</span>
                      </li>
                    ))}
                  </ul>
                  <Link to="/auth?mode=signup">
                    <Button
                      className={`w-full rounded-xl h-14 font-extrabold text-lg transition-transform active:scale-95 shadow-xl ${plan.popular ? "btn-premium" : "bg-card hover:bg-muted text-foreground border border-border"
                        }`}
                    >
                      Get Started
                    </Button>
                  </Link>
                </CardContent>
              </Card>
            ))}
          </div>

          <div className="mt-20 text-center text-muted-foreground">
            <p className="text-sm">Secure payment processing. Instant access to all content after registration.</p>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Pricing;
