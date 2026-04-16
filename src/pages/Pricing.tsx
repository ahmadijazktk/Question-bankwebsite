import Navbar from "@/components/Navbar";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Check } from "lucide-react";
import { Link } from "react-router-dom";
import medicalSymbol from "@/assets/medical.jpg";

const Pricing = () => {
  const plans = [
    {
      id: "1m",
      name: "1 Month",
      price: "$49.99",
      period: "per month",
      features: [
        "Full access to 600+ questions",
        "High-resolution image zoom",
        "Detailed ACR guideline rationales",
        "Personal progress dashboard"
      ]
    },
    {
      id: "3m",
      name: "3 Months",
      price: "$149.99",
      period: "quarterly",
      features: [
        "All 1 Month features",
        "Discounted multi-month rate",
        "Priority support",
        "New questions included"
      ]
    },
    {
      id: "6m",
      name: "6 Months",
      price: "$199.99",
      period: "standard",
      bestValue: true,
      features: [
        "All 3 Month features",
        "Best value for board prep",
        "Comprehensive review guide",
        "Full study bank access"
      ]
    },
    {
      id: "12m",
      name: "12 Months",
      price: "$299.00",
      period: "per year",
      popular: true,
      features: [
        "All 6 Month features",
        "Lowest monthly average",
        "Full year of updates",
        "Unlimited study sessions"
      ]
    },
  ];

  return (
    <div className="min-h-screen bg-slate-50/50">
      <Navbar />

      <section className="pt-32 pb-20 px-6 max-w-7xl mx-auto">
        <div className="text-center mb-16">
          <h1 className="text-5xl font-extrabold tracking-tight text-slate-900 mb-4">
            Invest in Your Success
          </h1>
          <p className="text-xl text-slate-600 max-w-2xl mx-auto">
            Choose the perfect plan to master rheumatology with our comprehensive high-yield question bank.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {plans.map((plan) => (
            <Card
              key={plan.id}
              className={`relative flex flex-col transition-all duration-300 hover:scale-105 hover:shadow-2xl border-2 overflow-hidden ${plan.popular ? "border-primary ring-4 ring-primary/10" :
                  plan.bestValue ? "border-amber-400" : "border-slate-200"
                }`}
            >
              {plan.popular && (
                <div className="absolute top-0 right-0 bg-primary text-white text-[10px] uppercase font-black py-1 px-3 rounded-bl-lg tracking-widest">
                  Most Popular
                </div>
              )}
              {plan.bestValue && (
                <div className="absolute top-0 right-0 bg-amber-400 text-amber-950 text-[10px] uppercase font-black py-1 px-3 rounded-bl-lg tracking-widest">
                  Best Value
                </div>
              )}

              <CardHeader className={`pb-8 ${plan.popular ? "bg-primary/5" : plan.bestValue ? "bg-amber-400/5" : ""}`}>
                <CardTitle className="text-xl font-bold text-slate-900">{plan.name}</CardTitle>
                <div className="mt-4 flex items-baseline gap-1">
                  <span className="text-4xl font-extrabold text-slate-900">{plan.price}</span>
                  <span className="text-slate-500 text-sm font-medium">/{plan.id === "12m" ? "yr" : "total"}</span>
                </div>
                {plan.id !== "1m" && (
                  <p className="mt-2 text-xs font-semibold text-green-600 uppercase tracking-wider">
                    Save up to {plan.id === "12m" ? "50%" : "30%"}
                  </p>
                )}
              </CardHeader>

              <CardContent className="flex flex-col flex-grow pt-8 pb-8">
                <ul className="space-y-4 mb-8 flex-grow">
                  {plan.features.map((feature) => (
                    <li key={feature} className="flex items-start gap-3 text-sm text-slate-600 leading-tight">
                      <Check className={`h-5 w-5 shrink-0 ${plan.popular ? "text-primary" : "text-slate-400"}`} />
                      <span>{feature}</span>
                    </li>
                  ))}
                </ul>

                <Link to="/auth?mode=signup" className="w-full">
                  <Button
                    size="lg"
                    className={`w-full py-6 rounded-xl font-bold text-base transition-all duration-300 ${plan.popular ? "bg-primary hover:bg-primary/90 shadow-lg shadow-primary/20" :
                        plan.bestValue ? "bg-amber-400 hover:bg-amber-500 text-amber-950 border-none shadow-lg shadow-amber-400/20" :
                          "bg-white border-2 border-slate-200 text-slate-900 hover:bg-slate-50"
                      }`}
                  >
                    Get Started
                  </Button>
                </Link>
              </CardContent>
            </Card>
          ))}
        </div>

        <div className="mt-20 flex flex-col md:flex-row items-center justify-center gap-12 border-t pt-12 border-slate-200">
          <div className="flex items-center gap-4 text-slate-400 grayscale opacity-50">
            <img src={medicalSymbol} alt="Medical" className="h-16 w-16 object-contain" />
            <div className="text-left">
              <p className="font-bold text-slate-900">Expert Verified</p>
              <p className="text-sm">Board-focused content</p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Pricing;
