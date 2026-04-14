import { useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import { apiPost } from "@/lib/api";

const ResetPassword = () => {
    const { token } = useParams();
    const [password, setPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();
    const { toast } = useToast();

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (password !== confirmPassword) {
            return toast({
                title: "Error",
                description: "Passwords do not match.",
                variant: "destructive",
            });
        }

        setLoading(true);

        try {
            const response = await apiPost(`/auth/reset-password/${token}`, { password });

            if (response.success) {
                toast({
                    title: "Password reset",
                    description: "Your password has been reset successfully.",
                });
                navigate("/auth");
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
                        <CardTitle>Reset password</CardTitle>
                        <CardDescription>
                            Enter your new password below.
                        </CardDescription>
                    </CardHeader>
                    <CardContent>
                        <form onSubmit={handleSubmit} className="space-y-4">
                            <div className="space-y-2">
                                <Label htmlFor="password">New Password</Label>
                                <Input
                                    id="password"
                                    type="password"
                                    placeholder="••••••••"
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    required
                                />
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="confirmPassword">Confirm Password</Label>
                                <Input
                                    id="confirmPassword"
                                    type="password"
                                    placeholder="••••••••"
                                    value={confirmPassword}
                                    onChange={(e) => setConfirmPassword(e.target.value)}
                                    required
                                />
                            </div>

                            <Button type="submit" className="w-full" disabled={loading}>
                                {loading ? "Please wait..." : "Reset password"}
                            </Button>
                        </form>
                    </CardContent>
                </Card>
            </div>
        </div>
    );
};

export default ResetPassword;
