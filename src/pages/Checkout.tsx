import { useState, useEffect } from "react";
import { useNavigate, useSearchParams, Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Checkbox } from "@/components/ui/checkbox";
import { ArrowLeft, CreditCard, Smartphone, Building2, Search } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { apiGet, apiPost } from "@/lib/api";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

const Checkout = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [email, setEmail] = useState("");
  const [paymentMethod, setPaymentMethod] = useState("card");
  const [saveInfo, setSaveInfo] = useState(false);
  const [country, setCountry] = useState("Pakistan");
  const [selectedBank, setSelectedBank] = useState("");

  const category = searchParams.get("category");
  const plan = searchParams.get("plan");
  const [planDetails, setPlanDetails] = useState<{ name: string; price: number; period: string } | null>(null);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    const fetchPlanDetails = async () => {
      if (!plan || !category) {
        setLoading(false);
        return;
      }

      try {
        const response = await apiGet<{ plans: Record<string, Record<string, number>> }>("/subscriptions/plans");
        if (response.success && response.data) {
          const plans = response.data.plans;
          const categoryPlans = plans[category];

          if (categoryPlans && categoryPlans[plan]) {
            const categoryTitles: Record<string, string> = {
              "anatomic-clinical": "Vasculitides and Dermatology",
              "anatomic": "Histology essentials",
              "clinical": "Rheumatology radiology",
              "forensic": "Management & medication guidelines",
              "cytopathology": "Osteoporosis ( Per ACR guidelines )",
            };

            setPlanDetails({
              name: categoryTitles[category] || category,
              price: categoryPlans[plan],
              period: plan === "1m" ? "month" : `${plan.replace("m", "")} months`,
            });
          }
        }
      } catch (error: any) {
        toast({
          title: "Error",
          description: error.message || "Failed to load plan details",
          variant: "destructive",
        });
      } finally {
        setLoading(false);
      }
    };

    fetchPlanDetails();
  }, [category, plan, toast]);

  const handleSubscribe = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!category || !plan) {
      toast({
        title: "Error",
        description: "Invalid subscription details",
        variant: "destructive",
      });
      return;
    }

    if (paymentMethod !== "card") {
      toast({
        title: "Use card via Stripe",
        description: "For now, please use card. We'll add more methods soon.",
      });
      return;
    }

    setSubmitting(true);
    toast({
      title: "Redirecting to Stripe...",
      description: "You'll complete your payment securely on Stripe.",
    });

    try {
      const response = await apiPost<{ url: string; sessionId: string }>("/payments/create-checkout-session", {
        category,
        plan,
      });

      if (response.success && response.data?.url) {
        window.location.href = response.data.url;
        return;
      }

      throw new Error(response.message || "Failed to start checkout session");
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message || "Failed to start checkout",
        variant: "destructive",
      });
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <p className="text-muted-foreground">Loading...</p>
      </div>
    );
  }

  if (!planDetails) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold mb-4">Invalid subscription details</h2>
          <Link to="/subscription">
            <Button>Return to Subscription Page</Button>
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-muted/30">
      <div className="container mx-auto px-6 py-8">
        <div className="max-w-5xl mx-auto">
          <Link
            to="/subscription"
            className="inline-flex items-center gap-2 text-muted-foreground hover:text-foreground mb-8"
          >
            <ArrowLeft className="h-4 w-4" />
            <span>Back</span>
          </Link>

          <div className="grid lg:grid-cols-2 gap-8">
            {/* Left Column - Order Summary */}
            <div className="space-y-6">

              <div className="flex items-center gap-3 mb-6">
                <div className="w-10 h-10 bg-primary rounded flex items-center justify-center">
                  <span className="text-primary-foreground font-bold">R</span>
                </div>
                <span className="font-semibold text-lg">RheumZoom</span>
              </div>

              <div>
                <h1 className="text-2xl font-semibold mb-2">
                  Subscribe to {planDetails.name}
                </h1>
                <div className="flex items-baseline gap-2">
                  <span className="text-4xl font-bold">${planDetails.price.toFixed(2)}</span>
                  <span className="text-muted-foreground">per {planDetails.period}</span>
                </div>
              </div>

              <div className="border-t border-border pt-6 space-y-4">
                <div className="flex justify-between">
                  <div>
                    <p className="font-medium">{planDetails.name}</p>
                    <p className="text-sm text-muted-foreground">Billed monthly</p>
                  </div>
                  <span className="font-medium">${planDetails.price.toFixed(2)}</span>
                </div>

                <div className="border-t border-border pt-4">
                  <button className="text-primary text-sm hover:underline">
                    Add promotion code
                  </button>
                </div>

                <div className="border-t border-border pt-4">
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Tax</span>
                    <span>$0.00</span>
                  </div>
                </div>

                <div className="border-t border-border pt-4">
                  <div className="flex justify-between text-lg font-bold">
                    <span>Total due today</span>
                    <span>${planDetails.price.toFixed(2)}</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Right Column - Payment Form */}
            <div className="bg-card rounded-lg p-6 border border-border">
              <form onSubmit={handleSubscribe} className="space-y-6">
                <div>
                  <h2 className="text-lg font-semibold mb-4">Contact information</h2>
                  <div className="space-y-2">
                    <Label htmlFor="email">Email</Label>
                    <Input
                      id="email"
                      type="email"
                      placeholder="you@example.com"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      required
                    />
                  </div>
                </div>

                <div>
                  <h2 className="text-lg font-semibold mb-4">Payment method</h2>
                  <RadioGroup value={paymentMethod} onValueChange={setPaymentMethod}>
                    <div className="space-y-3">
                      <div className="flex items-center justify-between p-4 border border-border rounded-lg hover:bg-muted/50 cursor-pointer">
                        <div className="flex items-center gap-3">
                          <RadioGroupItem value="card" id="card" />
                          <Label htmlFor="card" className="flex items-center gap-2 cursor-pointer">
                            <CreditCard className="h-4 w-4" />
                            <span>Card</span>
                          </Label>
                        </div>
                        <div className="flex gap-1">
                          <img src="https://js.stripe.com/v3/fingerprinted/img/visa-729c05c240c4bdb47b03ac81d9945bfe.svg" alt="Visa" className="h-5" />
                          <img src="https://js.stripe.com/v3/fingerprinted/img/mastercard-4d8844094130711885b5e41b28c9848f.svg" alt="Mastercard" className="h-5" />
                          <img src="https://js.stripe.com/v3/fingerprinted/img/amex-a49b82f46c5cd6a96a6e418a6ca1717c.svg" alt="Amex" className="h-5" />
                        </div>
                      </div>

                      <div className="flex items-center justify-between p-4 border border-border rounded-lg hover:bg-muted/50 cursor-pointer">
                        <div className="flex items-center gap-3">
                          <RadioGroupItem value="cashapp" id="cashapp" />
                          <Label htmlFor="cashapp" className="flex items-center gap-2 cursor-pointer">
                            <div className="w-5 h-5 bg-green-500 rounded flex items-center justify-center">
                              <span className="text-white text-xs font-bold">$</span>
                            </div>
                            <span>Cash App Pay</span>
                          </Label>
                        </div>
                      </div>

                      <div className="flex items-center justify-between p-4 border border-border rounded-lg hover:bg-muted/50 cursor-pointer">
                        <div className="flex items-center gap-3">
                          <RadioGroupItem value="bank" id="bank" />
                          <Label htmlFor="bank" className="flex items-center gap-2 cursor-pointer">
                            <Building2 className="h-4 w-4" />
                            <span>Bank</span>
                          </Label>
                        </div>
                        <span className="text-green-600 text-sm font-medium">$5 back</span>
                      </div>
                    </div>
                  </RadioGroup>
                </div>

                <div className="p-6 border border-primary/20 rounded-lg bg-primary/5">
                  <p className="text-sm text-center font-medium">
                    You will be redirected to Stripe's secure checkout to complete your payment.
                    We never see or store your card details.
                  </p>
                </div>

                <div className="flex items-start gap-2">
                  <Checkbox
                    id="saveInfo"
                    checked={saveInfo}
                    onCheckedChange={(checked) => setSaveInfo(checked as boolean)}
                  />
                  <Label htmlFor="saveInfo" className="text-sm cursor-pointer">
                    Save my information for faster checkout. Pay securely at RheumZoom and everywhere{" "}
                    <span className="text-primary hover:underline">Link</span> is accepted.
                  </Label>
                </div>

                <Button type="submit" className="w-full" size="lg" disabled={submitting}>
                  {submitting ? "Processing..." : "Subscribe"}
                </Button>

                <p className="text-xs text-center text-muted-foreground">
                  By subscribing, you authorize RheumZoom to charge you according to the terms until you cancel.
                </p>

                <div className="flex justify-center gap-4 text-xs text-muted-foreground">
                  <span>Powered by <span className="font-semibold">stripe</span></span>
                  <a href="#" className="hover:text-foreground">Terms</a>
                  <a href="#" className="hover:text-foreground">Privacy</a>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Checkout;
