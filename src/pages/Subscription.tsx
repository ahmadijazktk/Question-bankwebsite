import { useState, useEffect } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import AppSidebar from "@/components/AppSidebar";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
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

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [plansRes, subscriptionRes] = await Promise.all([
          apiGet<{ plans: Record<string, Record<string, number>> }>("/subscriptions/plans"),
          apiGet<{ subscription: any }>("/subscriptions/current"),
        ]);

        if (plansRes.success && plansRes.data) {
          // Flatten the plans into a unified list since category is just 'all-access'
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
          toast({
            title: "Processing your subscription...",
            description: "Please wait while we activate your account.",
          });

          const confirmRes = await apiPost("/payments/confirm-checkout-session", { sessionId });

          if (!confirmRes.success) {
            toast({
              title: "Subscription Activation Pending",
              description: "Your payment was successful. If your subscription doesn't activate in a few minutes, please refresh the page or contact support.",
              variant: "default",
            });
          } else {
            toast({
              title: "🎉 Subscription Activated!",
              description: "Your subscription is now active. Enjoy unlimited access to all questions!",
            });
          }
        }

        // Refresh user data
        const meRes = await apiGet<{ user: any }>("/auth/me");
        if (meRes.success && meRes.data?.user) {
          saveAuthData(token, meRes.data.user);
        }

        // Refresh subscription data
        const subscriptionRes = await apiGet<{ subscription: any }>("/subscriptions/current");
        if (subscriptionRes.success && subscriptionRes.data) {
          setCurrentSubscription(subscriptionRes.data.subscription);

          if (subscriptionRes.data.subscription) {
            toast({
              title: "✅ All Set!",
              description: "You can now access all premium features. Head to the Exam page to start learning!",
            });
          }
        }
      } catch (error: any) {
        toast({
          title: "Error",
          description: error.message || "Failed to confirm subscription. Please refresh the page or contact support.",
          variant: "destructive",
        });
      }
    };

    refresh();
  }, [searchParams, toast]);

  const handlePurchase = (planId: string) => {
    navigate(`/checkout?category=all-access&plan=${planId}`);
  };

  return (
    <SidebarProvider>
      <div className="min-h-screen flex w-full">
        <AppSidebar />
        <main className="flex-1">
          <div className="border-b border-border">
            <div className="flex items-center h-16 px-6">
              <SidebarTrigger />
            </div>
          </div>

          <div className="p-8">
            <div className="grid lg:grid-cols-3 gap-8 mb-8">
              <div className="lg:col-span-2">
                <h1 className="text-3xl font-bold mb-4">Subscription Plan</h1>

                <p className="text-xl mb-6">
                  I would provide access to all questions, with the following prices:
                </p>

                {currentSubscription ? (
                  <div className="mb-4 p-4 bg-primary/10 rounded-lg">
                    <p className="text-lg font-semibold mb-2">Active Subscription</p>
                    <p className="text-muted-foreground">
                      Access to all questions - {currentSubscription.plan} plan
                    </p>
                    <p className="text-sm text-muted-foreground mt-1">
                      Expires: {new Date(currentSubscription.endDate).toLocaleDateString()}
                    </p>
                  </div>
                ) : null}
              </div>
              <div className="flex items-center justify-center">
                <img src={medicalSymbol} alt="Medical symbol" className="w-64 h-64 object-contain opacity-80" />
              </div>
            </div>

            {loading ? (
              <p className="text-muted-foreground">Loading subscription plans...</p>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {plans.map((plan, index) => {
                  const isPopular = plan.id === "6m" || plan.id === "12m"; // Highlight the longer ones usually
                  return (
                    <Card key={plan.id} className={`flex flex-col border-2 relative ${isPopular ? "border-primary shadow-lg" : "border-border"}`}>
                      {isPopular && (
                        <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-primary text-primary-foreground text-xs font-bold px-3 py-1 rounded-full text-center">
                          Best Value
                        </div>
                      )}
                      <CardHeader className="text-center pt-8">
                        <CardTitle className="text-2xl font-bold">{plan.label}</CardTitle>
                      </CardHeader>
                      <CardContent className="flex flex-col flex-grow items-center justify-center text-center gap-6">
                        <div>
                          <span className="text-4xl font-extrabold">${plan.price.toFixed(2)}</span>
                        </div>
                        <Button
                          size="lg"
                          className="w-full mt-4"
                          variant={isPopular ? "default" : "outline"}
                          onClick={() => handlePurchase(plan.id)}
                        >
                          {currentSubscription && currentSubscription.plan === plan.id ? "Renew Subscription" : "Buy Subscription"}
                        </Button>
                      </CardContent>
                    </Card>
                  );
                })}
              </div>
            )}
          </div>
        </main>
      </div>
    </SidebarProvider>
  );
};

export default Subscription;
