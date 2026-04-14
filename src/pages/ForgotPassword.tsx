import { useState } from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import { apiPost } from "@/lib/api";

const ForgotPassword = () => {
    const [email, setEmail] = useState("");
    const [loading, setLoading] = useState(false);
    const [submitted, setSubmitted] = useState(false);
    const { toast } = useToast();

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);

        try {
            const response = await apiPost("/auth/forgot-password", { email });

            if (response.success) {
                setSubmitted(true);
                toast({
                    title: "Check your email",
                    description: "We've sent a password reset link to your email address.",
                });

                // In this simulated environment, we might show the token for testing
                if ((response as any).debugToken) {
                    console.log("DEBUG: Reset token is", (response as any).debugToken);
                }
            }
        } catch (error: any) {
            toast({
                title: "Error",
                description: error.message || "Something went wrong. Please try again.",
                variant: "destructive",
            });
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-background flex items-center justify-center px-6 py-12">
            <div className="w-full max-w-md space-y-8">
                <div className="text-center">
                    <Link to="/" className="inline-flex items-center gap-2 mb-8">
                        <div className="w-10 h-10 bg-primary rounded flex items-center justify-center font-bold text-primary-foreground text-xl">
                            RZ
                        </div>
                        <span className="text-xl font-bold text-foreground">Rheumzoom™</span>
                    </Link>
                </div>

                <Card>
                    <CardHeader>
                        <CardTitle>Forgot password?</CardTitle>
                        <CardDescription>
                            {submitted
                                ? "Check your email for a reset link."
                                : "Enter your email address and we'll send you a link to reset your password."}
                        </CardDescription>
                    </CardHeader>
                    <CardContent>
                        {!submitted ? (
                            <form onSubmit={handleSubmit} className="space-y-4">
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

                                <Button type="submit" className="w-full" disabled={loading}>
                                    {loading ? "Please wait..." : "Send reset link"}
                                </Button>

                                <div className="text-center text-sm">
                                    <Link to="/auth" className="text-primary hover:underline">
                                        Back to sign in
                                    </Link>
                                </div>
                            </form>
                        ) : (
                            <div className="space-y-4">
                                <div className="p-4 bg-primary/10 rounded-lg text-sm text-primary text-center">
                                    If an account exists for {email}, you will receive a password reset link shortly.
                                </div>
                                <Button asChild variant="outline" className="w-full">
                                    <Link to="/auth">Back to sign in</Link>
                                </Button>
                            </div>
                        )}
                    </CardContent>
                </Card>
            </div>
        </div>
    );
};

export default ForgotPassword;
