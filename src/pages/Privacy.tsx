import { Link } from "react-router-dom";
import Navbar from "@/components/Navbar";
import { Lock, Eye, Database, Share2, ShieldCheck, Mail, ArrowLeft } from "lucide-react";

const Privacy = () => {
    const effectiveDate = new Date().toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' });

    return (
        <div className="min-h-screen bg-background relative overflow-hidden">
            <Navbar />

            {/* Background Decorative Elements */}
            <div className="absolute top-0 left-0 w-full h-full overflow-hidden -z-10 opacity-30 dark:opacity-20 pointer-events-none">
                <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-primary/10 rounded-full blur-[120px]" />
                <div className="absolute bottom-[10%] right-[-5%] w-[35%] h-[35%] bg-indigo-500/5 rounded-full blur-[100px]" />
            </div>

            <main className="pt-32 pb-24 px-6">
                <div className="container mx-auto max-w-4xl">
                    <Link to="/" className="inline-flex items-center gap-2 text-muted-foreground hover:text-primary transition-colors mb-8 group">
                        <ArrowLeft className="h-4 w-4 group-hover:-translate-x-1 transition-transform" />
                        <span>Back to Home</span>
                    </Link>

                    <div className="glass-card p-8 md:p-12 rounded-[2rem] shadow-2xl border border-white/20 relative overflow-hidden">
                        <div className="absolute top-0 right-0 p-8 opacity-5">
                            <Lock className="h-32 w-32" />
                        </div>

                        <h1 className="text-4xl md:text-5xl font-bold mb-4">Privacy Policy</h1>
                        <p className="text-muted-foreground mb-8">Effective Date: {effectiveDate}</p>

                        <div className="space-y-12 text-foreground/80">
                            <section>
                                <p className="text-lg leading-relaxed italic border-l-4 border-primary pl-6 py-2 bg-primary/5 rounded-r-xl">
                                    RheumZoom (“we,” “our,” or “us”) respects your privacy and is committed to protecting your information.
                                    This policy outlines how we handle your data when you use our services.
                                </p>
                            </section>

                            <div className="grid gap-12 sm:grid-cols-2">
                                <section className="space-y-4">
                                    <h2 className="text-xl font-bold text-foreground flex items-center gap-3">
                                        <div className="p-2 bg-primary/10 rounded-lg text-primary">
                                            <Database className="h-5 w-5" />
                                        </div>
                                        1. Information We Collect
                                    </h2>
                                    <ul className="list-disc pl-5 space-y-2 text-sm sm:text-base">
                                        <li>Name and demographic info</li>
                                        <li>Email address</li>
                                        <li>Payment information (processed securely via Stripe)</li>
                                        <li>Account activity and usage data</li>
                                        <li>Device and browser information</li>
                                    </ul>
                                    <p className="text-xs bg-muted p-3 rounded-lg">Note: We do not store full payment card details on our servers.</p>
                                </section>

                                <section className="space-y-4">
                                    <h2 className="text-xl font-bold text-foreground flex items-center gap-3">
                                        <div className="p-2 bg-primary/10 rounded-lg text-primary">
                                            <Eye className="h-5 w-5" />
                                        </div>
                                        2. How We Use Information
                                    </h2>
                                    <ul className="list-disc pl-5 space-y-2 text-sm sm:text-base">
                                        <li>Grant access to subscriptions</li>
                                        <li>Process payments securely</li>
                                        <li>Improve educational content</li>
                                        <li>Communicate service updates</li>
                                    </ul>
                                </section>

                                <section className="space-y-4">
                                    <h2 className="text-xl font-bold text-foreground flex items-center gap-3">
                                        <div className="p-2 bg-primary/10 rounded-lg text-primary">
                                            <Share2 className="h-5 w-5" />
                                        </div>
                                        3. Data Sharing
                                    </h2>
                                    <p className="font-semibold text-primary">We do not sell personal information.</p>
                                    <p className="text-sm">Information is only shared with trusted partners (e.g., payment processors, hosting) necessary for operation.</p>
                                </section>

                                <section className="space-y-4">
                                    <h2 className="text-xl font-bold text-foreground flex items-center gap-3">
                                        <div className="p-2 bg-primary/10 rounded-lg text-primary">
                                            <ShieldCheck className="h-5 w-5" />
                                        </div>
                                        4. Data Security
                                    </h2>
                                    <p className="text-sm">We implement standard safeguards to protect your data, though no system is 100% impenetrable.</p>
                                </section>
                            </div>

                            <div className="h-px bg-border" />

                            <div className="grid gap-8 md:grid-cols-2 bg-slate-50 dark:bg-slate-900/50 p-6 rounded-2xl border border-border">
                                <section className="space-y-3">
                                    <h3 className="font-bold">5. Cookies</h3>
                                    <p className="text-sm">We use minimal cookies for essential functionality and to understand site usage via basic analytics.</p>
                                </section>
                                <section className="space-y-3">
                                    <h3 className="font-bold">6. User Rights</h3>
                                    <p className="text-sm">You may request account deletion or data removal at any time by reaching out to us.</p>
                                </section>
                            </div>

                            <section className="space-y-4">
                                <h2 className="text-2xl font-bold">Contact Us</h2>
                                <div className="flex items-center gap-3 text-primary">
                                    <Mail className="h-6 w-6" />
                                    <a href="mailto:rheumzoom@gmail.com" className="hover:underline text-lg font-medium">rheumzoom@gmail.com</a>
                                </div>
                            </section>
                        </div>
                    </div>
                </div>
            </main>

            <footer className="py-12 px-6 border-t border-border bg-slate-50 dark:bg-slate-950">
                <div className="container mx-auto text-center text-muted-foreground text-sm">
                    <p>© 2025 RheumZoom. All rights reserved.</p>
                </div>
            </footer>
        </div>
    );
};

export default Privacy;
