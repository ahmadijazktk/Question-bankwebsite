import { useState, useEffect } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import AppSidebar from "@/components/AppSidebar";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Check } from "lucide-react";
import medicalSymbol from "@/assets/medical.jpg";
import { apiGet, apiPost } from "@/lib/api";
import { useToast } from "@/hooks/use-toast";
import { saveAuthData } from "@/lib/auth";

interface Plan {
  id: string;
  label: string;
  price: number;
}

const Subscription = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const { toast } = useToast();

  const [plans, setPlans] = useState<Plan[]>([]);
  const [currentSubscription, setCurrentSubscription] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  const features = [
    "Unlimited access to all questions",
    "High-resolution image zoom"
  ];

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [plansRes, subscriptionRes] = await Promise.all([
          apiGet<{ plans: Record<string, Record<string, number>> }>("/subscriptions/plans"),
          apiGet<{ subscription: any }>("/subscriptions/current"),
        ]);

        if (plansRes.success && plansRes.data) {
          const serverPlans = plansRes.data.plans['all-access'] || {};
          const planLabels: Record<string, string> = {
            "1m": "1 Month",
            "3m": "3 Months",
            "6m": "6 Months",
            "12m": "12 Months",
          };

          const sortedPlanKeys = ["1m", "3m", "6m", "12m"];
          const formattedPlans: Plan[] = [];

          sortedPlanKeys.forEach(key => {
            if (serverPlans[key] !== undefined) {
              formattedPlans.push({
                id: key,
                label: planLabels[key],
                price: serverPlans[key]
              });
            }
          });

          setPlans(formattedPlans);
        }

        if (subscriptionRes.success && subscriptionRes.data) {
          setCurrentSubscription(subscriptionRes.data.subscription);
        }
      } catch (error: any) {
        toast({
          title: "Error",
          description: error.message || "Failed to load subscription plans",
          variant: "destructive",
        });
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [toast]);

  useEffect(() => {
    const status = searchParams.get("status");
    if (status !== "success") return;

    const sessionId = searchParams.get("session_id");

    const refresh = async () => {
      try {
        const token = localStorage.getItem("token") || "";

        if (sessionId) {
          const confirmRes = await apiPost("/payments/confirm-checkout-session", { sessionId });

          if (confirmRes.success) {
            toast({
              title: "🎉 Subscription Activated!",
              description: "Your subscription is now active. Enjoy unlimited access!",
            });
          }
        }

        const meRes = await apiGet<{ user: any }>("/auth/me");
        if (meRes.success && meRes.data?.user) {
          saveAuthData(token, meRes.data.user);
        }

        const subscriptionRes = await apiGet<{ subscription: any }>("/subscriptions/current");
        if (subscriptionRes.success && subscriptionRes.data) {
          setCurrentSubscription(subscriptionRes.data.subscription);
        }
      } catch (error: any) {
        console.error(error);
      }
    };

    refresh();
  }, [searchParams, toast]);

  const handlePurchase = (planId: string) => {
    navigate(`/checkout?category=all-access&plan=${planId}`);
  };

  return (
    <SidebarProvider>
      <div className="min-h-screen flex w-full bg-slate-50/50">
        <AppSidebar />
        <main className="flex-1">
          <div className="border-b bg-white/50 backdrop-blur-md sticky top-0 z-10">
            <div className="flex items-center h-16 px-6">
              <SidebarTrigger />
              <h2 className="ml-4 font-semibold text-lg">Billing & Plans</h2>
            </div>
          </div>

          <div className="p-8 max-w-7xl mx-auto">
            <div className="text-center mb-12">
              <h1 className="text-4xl font-extrabold tracking-tight text-slate-900 mb-4">
                Unlock Full Access
              </h1>
              <p className="text-xl text-slate-600 max-w-2xl mx-auto">
                Gain unlimited access to all rheumatology questions and detailed clinical explanations with our premium plans.
              </p>
            </div>

            {currentSubscription && (
              <div className="mb-12 bg-blue-50 border border-blue-100 rounded-2xl p-6 flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                  <h3 className="text-blue-900 font-bold text-lg mb-1 flex items-center gap-2">
                    <span className="relative flex h-3 w-3">
                      <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-blue-400 opacity-75"></span>
                      <span className="relative inline-flex rounded-full h-3 w-3 bg-blue-500"></span>
                    </span>
                    Active Subscription
                  </h3>
                  <p className="text-blue-700">
                    You currently have the <span className="font-semibold">{currentSubscription.plan} Full Access</span> plan.
                  </p>
                </div>
                <div className="bg-white/50 backdrop-blur px-4 py-2 rounded-xl border border-blue-200">
                  <p className="text-sm text-blue-800">
                    Valid until <span className="font-bold">{new Date(currentSubscription.endDate).toLocaleDateString()}</span>
                  </p>
                </div>
              </div>
            )}

            {loading ? (
              <div className="flex items-center justify-center min-h-[400px]">
                <p className="text-slate-400 animate-pulse">Loading plans...</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-8">
                {plans.map((plan) => {
                  const isPopular = plan.id === "12m";
                  const isBestValue = plan.id === "6m";

                  return (
                    <Card
                      key={plan.id}
                      className={`relative flex flex-col transition-all duration-300 hover:scale-105 hover:shadow-2xl border-2 overflow-hidden ${isPopular ? "border-primary ring-4 ring-primary/10" :
                        isBestValue ? "border-amber-400" : "border-slate-200"
                        }`}
                    >
                      {isPopular && (
                        <div className="absolute top-0 right-0 bg-primary text-white text-[10px] uppercase tracking-widest font-black py-1 px-3 rounded-bl-lg">
                          Most Popular
                        </div>
                      )}
                      {isBestValue && (
                        <div className="absolute top-0 right-0 bg-amber-400 text-amber-950 text-[10px] uppercase tracking-widest font-black py-1 px-3 rounded-bl-lg">
                          Best Value
                        </div>
                      )}

                      <CardHeader className={`pb-8 ${isPopular ? "bg-primary/5" : isBestValue ? "bg-amber-400/5" : ""}`}>
                        <CardTitle className="text-xl font-bold text-slate-900">{plan.label}</CardTitle>
                        <div className="mt-4 flex items-baseline gap-1">
                          <span className="text-4xl font-extrabold text-slate-900">${plan.price}</span>
                          <span className="text-slate-500 text-sm font-medium">total</span>
                        </div>
                        {plan.id !== "1m" && (
                          <p className="mt-2 text-xs font-semibold text-green-600 uppercase tracking-wider">
                            Save up to {plan.id === "12m" ? "50%" : "30%"}
                          </p>
                        )}
                      </CardHeader>

                      <CardContent className="flex flex-col flex-grow pt-8 pb-8">
                        <ul className="space-y-4 mb-8 flex-grow">
                          {features.map((feature, fIndex) => (
                            <li key={fIndex} className="flex items-start gap-3 text-sm text-slate-600">
                              <Check className={`h-5 w-5 shrink-0 ${isPopular ? "text-primary" : "text-slate-400"}`} />
                              {feature}
                            </li>
                          ))}
                        </ul>

                        <Button
                          size="lg"
                          className={`w-full py-6 rounded-xl font-bold text-base transition-all duration-300 ${isPopular ? "bg-primary hover:bg-primary/90 shadow-lg shadow-primary/20" :
                            isBestValue ? "bg-amber-400 hover:bg-amber-500 text-amber-950 border-none shadow-lg shadow-amber-400/20" :
                              "bg-white border-2 border-slate-200 text-slate-900 hover:bg-slate-50"
                            }`}
                          onClick={() => handlePurchase(plan.id)}
                        >
                          {currentSubscription && currentSubscription.plan === plan.id ? "Renew Plan" : "Get Full Access"}
                        </Button>
                      </CardContent>
                    </Card>
                  );
                })}
              </div>
            )}

            <div className="mt-20 flex flex-col md:flex-row items-center justify-center gap-12 border-t pt-12 border-slate-200">
              <div className="flex items-center gap-4 text-slate-400 grayscale opacity-50">
                <img src={medicalSymbol} alt="Medical" className="h-16 w-16 object-contain" />
                <div className="text-left">
                  <p className="font-bold text-slate-900">Certified Content</p>
                  <p className="text-sm">Verified by specialists</p>
                </div>
              </div>
              <div className="h-1 w-1 bg-slate-300 rounded-full hidden md:block"></div>
              <div className="text-center md:text-left">
                <p className="text-slate-500 text-sm mb-2 font-medium uppercase tracking-widest">Secure Payment</p>
                <div className="flex gap-4 items-center justify-center md:justify-start grayscale opacity-60">
                  <span className="font-black text-xl italic text-slate-700">visa</span>
                  <span className="font-black text-xl italic text-slate-700">mastercard</span>
                  <span className="font-black text-xl italic text-slate-700">stripe</span>
                </div>
              </div>
            </div>
          </div>
        </main>
      </div>
    </SidebarProvider>
  );
};

export default Subscription;
