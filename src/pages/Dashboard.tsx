import { useState, useEffect } from "react";
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import AppSidebar from "@/components/AppSidebar";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { PenTool, BarChart3, RefreshCw } from "lucide-react";
import { Link } from "react-router-dom";
import { apiGet } from "@/lib/api";
import { getCurrentUser } from "@/lib/auth";

const Dashboard = () => {
  const [subscription, setSubscription] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchSubscription = async () => {
      try {
        const response = await apiGet<{ subscription: any }>("/subscriptions/current");
        if (response.success && response.data) {
          setSubscription(response.data.subscription);
        }
      } catch (error) {
        // Subscription might not exist, that's okay
      } finally {
        setLoading(false);
      }
    };

    fetchSubscription();
  }, []);

  const user = getCurrentUser();
  const hasActiveSubscription = subscription && new Date(subscription.endDate) > new Date();

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
            <div className="mb-8">
              <h1 className="text-3xl font-bold mb-2">Dashboard</h1>
              <p className="text-muted-foreground">
                Welcome{user ? `, ${user.name}` : ""}.
              </p>
              {!loading && !hasActiveSubscription && (
                <p className="text-primary mt-2">
                  It doesn't look like you're subscribed.{" "}
                  <Link to="/subscription" className="underline font-medium">
                    Upgrade Here!
                  </Link>
                </p>
              )}
              {hasActiveSubscription && (
                <p className="text-green-600 mt-2">
                  ✓ You have an active subscription until {new Date(subscription.endDate).toLocaleDateString()}
                </p>
              )}
            </div>

            <div className="grid md:grid-cols-3 gap-6">
              <Link to="/exam">
                <Card className="hover:shadow-lg transition-shadow cursor-pointer">
                  <CardContent className="p-8 text-center">
                    <PenTool className="h-12 w-12 text-primary mx-auto mb-4" />
                    <h3 className="text-xl font-semibold text-primary">Take Exam</h3>
                  </CardContent>
                </Card>
              </Link>

              <Link to="/stats">
                <Card className="hover:shadow-lg transition-shadow cursor-pointer">
                  <CardContent className="p-8 text-center">
                    <BarChart3 className="h-12 w-12 text-primary mx-auto mb-4" />
                    <h3 className="text-xl font-semibold text-primary">View Statistics</h3>
                  </CardContent>
                </Card>
              </Link>

              <Link to="/subscription">
                <Card className="hover:shadow-lg transition-shadow cursor-pointer">
                  <CardContent className="p-8 text-center">
                    <RefreshCw className="h-12 w-12 text-primary mx-auto mb-4" />
                    <h3 className="text-xl font-semibold text-primary">Subscription</h3>
                  </CardContent>
                </Card>
              </Link>
            </div>
          </div>
        </main>
      </div>
    </SidebarProvider>
  );
};

export default Dashboard;
