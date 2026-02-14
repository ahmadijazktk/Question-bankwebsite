import { useState, useEffect } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import { Link } from "react-router-dom";
import { apiPost } from "@/lib/api";
import { saveAuthData, isAuthenticated } from "@/lib/auth";

const Auth = () => {
  const [searchParams] = useSearchParams();
  const isSignUp = searchParams.get("mode") === "signup";
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const { toast } = useToast();

  // Redirect if already authenticated
  useEffect(() => {
    if (isAuthenticated()) {
      navigate("/dashboard");
    }
  }, [navigate]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const endpoint = isSignUp ? "/auth/register" : "/auth/login";
      const body = isSignUp
        ? { name, email, password }
        : { email, password };

      const response = await apiPost(endpoint, body);

      if (response.success && response.data) {
        saveAuthData(response.data.token, response.data.user);

        toast({
          title: isSignUp ? "Account created!" : "Welcome back!",
          description: isSignUp
            ? "Your account has been created successfully."
            : "You have been logged in successfully.",
        });

        navigate("/dashboard");
      }
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message || "Something went wrong. Please try again.",
        variant: "destructive",
      });
    }
    finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-background flex items-center justify-center px-6 py-12">
      <div className="w-full max-w-md space-y-8">
        <div className="text-center">
          <Link to="/" className="inline-flex items-center gap-2 mb-8">
            <div className="w-10 h-10 bg-primary rounded flex items-center justify-center font-bold text-primary-foreground text-xl">
              Pd
            </div>
            <span className="text-xl font-bold text-foreground">Rheumzoom™</span>
          </Link>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>{isSignUp ? "Create an account" : "Welcome back"}</CardTitle>
            <CardDescription>
              {isSignUp
                ? "Enter your information to create an account"
                : "Enter your credentials to sign in"}
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              {isSignUp && (
                <div className="space-y-2">
                  <Label htmlFor="name">Full Name</Label>
                  <Input
                    id="name"
                    type="text"
                    placeholder="John Doe"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    required
                  />
                </div>
              )}

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

              <div className="space-y-2">
                <Label htmlFor="password">Password</Label>
                <Input
                  id="password"
                  type="password"
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                />
              </div>

              {!isSignUp && (
                <div className="text-right">
                  <Link to="/forgot-password" className="text-sm text-primary hover:underline">
                    Forgot password?
                  </Link>
                </div>
              )}

              <Button type="submit" className="w-full" disabled={loading}>
                {loading ? "Please wait..." : isSignUp ? "Create account" : "Sign in"}
              </Button>

              <div className="text-center text-sm">
                {isSignUp ? (
                  <span>
                    Already have an account?{" "}
                    <Link to="/auth" className="text-primary hover:underline">
                      Sign in
                    </Link>
                  </span>
                ) : (
                  <span>
                    Don't have an account?{" "}
                    <Link to="/auth?mode=signup" className="text-primary hover:underline">
                      Sign up
                    </Link>
                  </span>
                )}
              </div>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Auth;
