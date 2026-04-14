import { useState } from "react";
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import AppSidebar from "@/components/AppSidebar";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { apiPut } from "@/lib/api";

const ChangePassword = () => {
    const [currentPassword, setCurrentPassword] = useState("");
    const [newPassword, setNewPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [saving, setSaving] = useState(false);
    const { toast } = useToast();

    const handleSave = async () => {
        if (newPassword !== confirmPassword) {
            toast({
                title: "Error",
                description: "New passwords do not match",
                variant: "destructive",
            });
            return;
        }

        setSaving(true);
        try {
            const response = await apiPut("/auth/change-password", {
                currentPassword,
                newPassword,
            });

            if (response.success) {
                toast({
                    title: "Password updated",
                    description: "Your password has been changed successfully.",
                });
                setCurrentPassword("");
                setNewPassword("");
                setConfirmPassword("");
            }
        } catch (error: any) {
            toast({
                title: "Error",
                description: error.message || "Failed to update password",
                variant: "destructive",
            });
        } finally {
            setSaving(false);
        }
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

                    <div className="p-8 max-w-2xl">
                        <h1 className="text-3xl font-bold mb-8">Security</h1>

                        <Card>
                            <CardHeader>
                                <CardTitle>Change Password</CardTitle>
                                <CardDescription>
                                    Ensure your account is using a long, random password to stay secure.
                                </CardDescription>
                            </CardHeader>
                            <CardContent className="space-y-4">
                                <div className="space-y-2">
                                    <Label htmlFor="currentPassword">Current Password</Label>
                                    <Input
                                        id="currentPassword"
                                        type="password"
                                        value={currentPassword}
                                        onChange={(e) => setCurrentPassword(e.target.value)}
                                    />
                                </div>

                                <div className="space-y-2">
                                    <Label htmlFor="newPassword">New Password</Label>
                                    <Input
                                        id="newPassword"
                                        type="password"
                                        value={newPassword}
                                        onChange={(e) => setNewPassword(e.target.value)}
                                    />
                                </div>

                                <div className="space-y-2">
                                    <Label htmlFor="confirmPassword">Confirm New Password</Label>
                                    <Input
                                        id="confirmPassword"
                                        type="password"
                                        value={confirmPassword}
                                        onChange={(e) => setConfirmPassword(e.target.value)}
                                    />
                                </div>

                                <Button onClick={handleSave} disabled={saving || !currentPassword || !newPassword || !confirmPassword}>
                                    {saving ? "Saving..." : "Change Password"}
                                </Button>
                            </CardContent>
                        </Card>
                    </div>
                </main>
            </div>
        </SidebarProvider>
    );
};

export default ChangePassword;
