import { Link } from "react-router-dom";
import Navbar from "@/components/Navbar";
import { FileText, ShieldCheck, Mail, ArrowLeft } from "lucide-react";

const Terms = () => {
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
                            <FileText className="h-32 w-32" />
                        </div>

                        <h1 className="text-4xl md:text-5xl font-bold mb-4">Terms of Service</h1>
                        <p className="text-muted-foreground mb-8">Effective Date: {effectiveDate}</p>

                        <div className="prose prose-slate dark:prose-invert max-w-none space-y-8 text-foreground/80">
                            <section>
                                <p className="text-lg leading-relaxed italic border-l-4 border-primary pl-6 py-2 bg-primary/5 rounded-r-xl">
                                    Welcome to RheumZoom (“Company,” “we,” “our,” or “us”). By accessing or using the
                                    RheumZoom website and educational platform (“Service”), you agree to the following Terms of
                                    Service.
                                </p>
                            </section>

                            <section className="space-y-4">
                                <h2 className="text-2xl font-bold text-foreground flex items-center gap-3">
                                    <span className="flex items-center justify-center w-8 h-8 rounded-lg bg-primary/10 text-primary text-sm">1</span>
                                    Educational Purpose Only
                                </h2>
                                <div className="space-y-3 pl-11">
                                    <p>RheumZoom provides medical educational content intended for learning and board examination preparation purposes only.</p>
                                    <p>The content is not medical advice, does not establish a physician-patient relationship, and must not be used to diagnose or treat any medical condition.</p>
                                    <p>Users are responsible for applying independent clinical judgment and verifying information with current guidelines and primary sources.</p>
                                </div>
                            </section>

                            <section className="space-y-4">
                                <h2 className="text-2xl font-bold text-foreground flex items-center gap-3">
                                    <span className="flex items-center justify-center w-8 h-8 rounded-lg bg-primary/10 text-primary text-sm">2</span>
                                    Eligibility
                                </h2>
                                <p className="pl-11">You must be at least 18 years old to use the Service.</p>
                            </section>

                            <section className="space-y-4">
                                <h2 className="text-2xl font-bold text-foreground flex items-center gap-3">
                                    <span className="flex items-center justify-center w-8 h-8 rounded-lg bg-primary/10 text-primary text-sm">3</span>
                                    Accounts and Access
                                </h2>
                                <div className="pl-11 space-y-3">
                                    <p>Users may create accounts to access subscription content. You agree to:</p>
                                    <ul className="list-disc pl-5 space-y-2">
                                        <li>Provide accurate information</li>
                                        <li>Maintain confidentiality of login credentials</li>
                                        <li>Be responsible for all activity under your account</li>
                                    </ul>
                                    <p className="text-destructive font-medium pt-2">Sharing login credentials or distributing access is prohibited.</p>
                                </div>
                            </section>

                            <section className="space-y-4">
                                <h2 className="text-2xl font-bold text-foreground flex items-center gap-3">
                                    <span className="flex items-center justify-center w-8 h-8 rounded-lg bg-primary/10 text-primary text-sm">4</span>
                                    Subscription and Payments
                                </h2>
                                <div className="pl-11 space-y-3">
                                    <p>Access is provided via paid subscription plans (e.g., 3-month, 6-month, 12-month).</p>
                                    <ul className="list-disc pl-5 space-y-2">
                                        <li>Fees are billed in advance.</li>
                                        <li>Subscription terms and pricing are displayed at checkout.</li>
                                        <li>Unless otherwise stated, subscriptions are non-refundable.</li>
                                    </ul>
                                    <p>We reserve the right to change pricing with advance notice.</p>
                                </div>
                            </section>

                            <section className="space-y-4">
                                <h2 className="text-2xl font-bold text-foreground flex items-center gap-3">
                                    <span className="flex items-center justify-center w-8 h-8 rounded-lg bg-primary/10 text-primary text-sm">5</span>
                                    Intellectual Property
                                </h2>
                                <div className="pl-11 space-y-3">
                                    <p>All content, including flashcards, text, graphics, and educational materials, is the intellectual property of RheumZoom.</p>
                                    <p>Users may not copy, distribute, resell, reproduce, upload or share content publicly without written permission.</p>
                                </div>
                            </section>

                            <section className="space-y-4">
                                <h2 className="text-2xl font-bold text-foreground flex items-center gap-3">
                                    <span className="flex items-center justify-center w-8 h-8 rounded-lg bg-primary/10 text-primary text-sm">6</span>
                                    No Guarantee of Results
                                </h2>
                                <p className="pl-11">We do not guarantee exam performance, certification outcomes, or clinical competency.</p>
                            </section>

                            <section className="space-y-4">
                                <h2 className="text-2xl font-bold text-foreground flex items-center gap-3">
                                    <span className="flex items-center justify-center w-8 h-8 rounded-lg bg-primary/10 text-primary text-sm">7</span>
                                    Limitation of Liability
                                </h2>
                                <p className="pl-11">To the fullest extent permitted by law, RheumZoom and its owners shall not be liable for any direct, indirect, incidental, or consequential damages arising from use of the Service.</p>
                            </section>

                            <div className="h-px bg-border my-12" />

                            <section className="bg-primary/5 p-8 rounded-2xl border border-primary/10">
                                <h2 className="text-2xl font-bold mb-6 flex items-center gap-3 text-primary">
                                    <ShieldCheck className="h-6 w-6" />
                                    Medical Disclaimer
                                </h2>
                                <div className="space-y-4 text-sm md:text-base">
                                    <p>RheumZoom provides educational materials intended solely for medical learning and examination preparation.</p>
                                    <ul className="list-disc pl-5 space-y-2">
                                        <li>Is not medical advice</li>
                                        <li>Does not replace professional medical judgment</li>
                                        <li>Does not establish a physician-patient relationship</li>
                                        <li>Should not be used for diagnosis or treatment decisions</li>
                                    </ul>
                                    <p className="font-semibold pt-2">Medical knowledge evolves rapidly. Users are responsible for verifying information with primary literature, official guidelines, and institutional policies.</p>
                                </div>
                            </section>

                            <section className="pt-8">
                                <h2 className="text-2xl font-bold mb-4">Contact</h2>
                                <div className="flex items-center gap-3 text-primary">
                                    <Mail className="h-5 w-5" />
                                    <a href="mailto:rheumzoom@gmail.com" className="hover:underline font-medium">rheumzoom@gmail.com</a>
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

export default Terms;
