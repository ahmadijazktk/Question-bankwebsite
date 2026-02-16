import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import AppSidebar from "@/components/AppSidebar";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import medicalSymbol from "@/assets/medical.jpg";
import { apiGet } from "@/lib/api";
import { useToast } from "@/hooks/use-toast";

interface Plan {
  label: string;
  price: number;
}

interface Category {
  id: string;
  title: string;
  questions: string;
  featured: boolean;
  plans: Record<string, Plan>;
}

const Subscription = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [billingPeriod, setBillingPeriod] = useState<"monthly" | "annual">("monthly");
  const [selectedPlans, setSelectedPlans] = useState<Record<string, string>>({});
  const [categories, setCategories] = useState<Category[]>([]);
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
          const plansData = plansRes.data.plans;

          const categoryTitles: Record<string, string> = {
            "anatomic-clinical": "Vasculitides and Dermatology",
            "anatomic": "Histology essentials",
            "clinical": "Rheumatology radiology",
            "forensic": "Management & medication guidelines",
            "cytopathology": "Osteoporosis ( Per ACR guidelines )",
          };

          const questionCounts: Record<string, string> = {
            "anatomic-clinical": "Over 1700 questions",
            "anatomic": "Over 1050 questions",
            "clinical": "Over 800 questions",
            "forensic": "Over 300 questions",
            "cytopathology": "Over 250 questions",
          };

          const planLabels: Record<string, string> = {
            "1m": "1 Month",
            "3m": "3 Months",
            "12m": "12 Months",
          };

          const cats: Category[] = Object.entries(plansData).map(([id, plans]) => ({
            id,
            title: categoryTitles[id] || id,
            questions: questionCounts[id] || "Questions available",
            featured: id === "anatomic-clinical",
            plans: Object.entries(plans).reduce((acc, [key, price]) => {
              acc[key] = { label: planLabels[key] || key, price };
              return acc;
            }, {} as Record<string, Plan>),
          }));

          setCategories(cats);
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

  const handlePlanSelect = (categoryId: string, planValue: string) => {
    setSelectedPlans(prev => ({
      ...prev,
      [categoryId]: planValue
    }));
  };

  const handleUpgrade = () => {
    const selectedCategory = Object.keys(selectedPlans)[0];
    const selectedPlan = selectedPlans[selectedCategory];

    if (selectedCategory && selectedPlan) {
      const category = categories.find(c => c.id === selectedCategory);
      navigate(`/checkout?category=${encodeURIComponent(category?.id || '')}&plan=${selectedPlan}`);
    }
  };

  const hasSelectedPlan = Object.keys(selectedPlans).length > 0;

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
                <h1 className="text-3xl font-bold mb-4">My Subscription</h1>
                {currentSubscription ? (
                  <div className="mb-4 p-4 bg-primary/10 rounded-lg">
                    <p className="text-lg font-semibold mb-2">Active Subscription</p>
                    <p className="text-muted-foreground">
                      {currentSubscription.category} - {currentSubscription.plan} plan
                    </p>
                    <p className="text-sm text-muted-foreground mt-1">
                      Expires: {new Date(currentSubscription.endDate).toLocaleDateString()}
                    </p>
                  </div>
                ) : (
                  <p className="text-lg mb-4">You're not currently subscribed to a plan.</p>
                )}
                <ul className="space-y-2 text-muted-foreground">
                  <li>• Choose the plan that best fits your needs below, then click the Upgrade button.</li>
                  <li>• The plan will <span className="italic">automatically cancel</span> at the end of the subscription time period.</li>
                  <li>• You can optionally extend the subscription, or opt-in to automatically renew after the subscription is created.</li>
                  <li>• The subscription can be delayed up to 6 months using the functionality below.</li>
                </ul>
              </div>
              <div className="flex items-center justify-center">
                <img src={medicalSymbol} alt="Medical symbol" className="w-64 h-64 object-contain" />
              </div>
            </div>

            <div className="mb-6 flex justify-center gap-2">
              <Button
                variant={billingPeriod === "monthly" ? "default" : "outline"}
                onClick={() => setBillingPeriod("monthly")}
              >
                Monthly
              </Button>
              <Button
                variant={billingPeriod === "annual" ? "default" : "outline"}
                onClick={() => setBillingPeriod("annual")}
              >
                Annual
              </Button>
            </div>

            {loading ? (
              <p className="text-muted-foreground">Loading subscription plans...</p>
            ) : (
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                {categories.map((category) => (
                  <Card key={category.id} className={category.featured ? "border-primary border-2" : ""}>
                    <CardHeader>
                      <CardTitle className="text-lg">{category.title}</CardTitle>
                      <p className="text-sm text-muted-foreground">{category.questions}</p>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-4">
                        <div>
                          <label className="text-sm font-medium mb-2 block">Select an option</label>
                          <Select
                            value={selectedPlans[category.id]}
                            onValueChange={(value) => handlePlanSelect(category.id, value)}
                          >
                            <SelectTrigger>
                              <SelectValue placeholder="Select a plan:" />
                            </SelectTrigger>
                            <SelectContent>
                              {Object.entries(category.plans).map(([key, plan]) => (
                                <SelectItem key={key} value={key}>
                                  {plan.label} - ${plan.price} USD
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}

            <div className="mt-8 flex justify-center">
              <Button
                size="lg"
                className="px-12"
                disabled={!hasSelectedPlan}
                onClick={handleUpgrade}
              >
                Upgrade Now
              </Button>
            </div>
          </div>
        </main>
      </div>
    </SidebarProvider>
  );
};

export default Subscription;
