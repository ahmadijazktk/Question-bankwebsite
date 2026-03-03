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
        "Access to all question banks",
        "Detailed explanations",
        "Performance tracking",
        "Mobile access",
      ],
    },
    {
      name: "3 Months",
      price: "$99.99",
      period: "one-time",
      popular: true,
      features: [
        "Everything in 1 Month",
        "Save 23%",
        "Extended study time",
        "Priority support",
      ],
    },
    {
      name: "12 Months",
      price: "$149.99",
      period: "per year",
      features: [
        "Everything in 3 Months",
        "Save 44%",
        "Full year access",
        "Exam preparation mode",
      ],
    },
  ];

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      
      <section className="pt-32 pb-20 px-6">
        <div className="container mx-auto">
          <div className="text-center mb-16">
            <h1 className="text-5xl font-bold mb-4">Choose Your Plan</h1>
            <p className="text-xl text-muted-foreground">
              Select the perfect plan for your pathology learning journey
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto">
            {plans.map((plan) => (
              <Card 
                key={plan.name} 
                className={plan.popular ? "border-primary border-2 relative" : ""}
              >
                {plan.popular && (
                  <div className="absolute -top-4 left-1/2 -translate-x-1/2 bg-primary text-primary-foreground px-4 py-1 rounded-full text-sm font-medium">
                    Most Popular
                  </div>
                )}
                <CardHeader>
                  <CardTitle className="text-2xl">{plan.name}</CardTitle>
                  <div className="mt-4">
                    <span className="text-4xl font-bold">{plan.price}</span>
                    <span className="text-muted-foreground ml-2">{plan.period}</span>
                  </div>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-3 mb-6">
                    {plan.features.map((feature) => (
                      <li key={feature} className="flex items-center gap-2">
                        <Check className="h-5 w-5 text-primary flex-shrink-0" />
                        <span>{feature}</span>
                      </li>
                    ))}
                  </ul>
                  <Link to="/auth?mode=signup">
                    <Button 
                      className="w-full" 
                      variant={plan.popular ? "default" : "outline"}
                    >
                      Get Started
                    </Button>
                  </Link>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
};

export default Pricing;
