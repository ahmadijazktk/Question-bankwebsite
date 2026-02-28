import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Clock, Database, Smartphone, ArrowRight } from "lucide-react";
import Navbar from "@/components/Navbar";
import heroImage from "@/assets/heroimage.jpg";
import icon1 from "@/assets/testimonial.png";
import icon2 from "@/assets/testimonial1.png";
import icon3 from "@/assets/testimonial2.png";

const Landing = () => {
  return (
    <div className="min-h-screen bg-background">
      <Navbar />

      {/* Hero Section */}
      <section className="pt-32 pb-20 px-6">
        <div className="container mx-auto">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div className="space-y-8 animate-fade-in">
              <h1 className="text-5xl lg:text-6xl font-bold text-foreground leading-tight">
                RheumZoom Digital Flashcards and Question Bank              </h1>
              <p className="text-xl text-muted-foreground ">
                Guideline-Driven Content for Real-World and Exam Success.<br />
                Evidence-Based, Exam-Focused, Fellowship-Approved.
              </p>

              <Link to="/auth?mode=signup">
                <Button size="lg" className="text-lg px-8 py-6 group mt-4">
                  Create account
                  <ArrowRight className="ml-2 h-5 w-5 group-hover:translate-x-1 transition-transform" />
                </Button>
              </Link>
            </div>
            <div className="animate-fade-in">
              <img
                src={heroImage}
                alt="Pathology microscope slide"
                className="rounded-2xl shadow-2xl w-full"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 px-6 bg-muted/30">
        <div className="container mx-auto">
          <div className="grid md:grid-cols-3 gap-8">
            <div className="bg-card p-8 rounded-xl shadow-sm border border-border">
              <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center mb-4">
                <Clock className="h-6 w-6 text-primary" />
              </div>
              <h3 className="text-xl font-semibold mb-3">Timed Tests & Helpful Tutorials</h3>
              <p className="text-muted-foreground">
                Simulate the exam environment and practice with 600+ RA, SLE, PsA, crystal disease, autoinflammatory conditions
                questions with detailed explanations.
              </p>
            </div>

            <div className="bg-card p-8 rounded-xl shadow-sm border border-border">
              <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center mb-4">
                <Database className="h-6 w-6 text-primary" />
              </div>
              <h3 className="text-xl font-semibold mb-3">Large QBank & Detailed Answers</h3>
              <p className="text-muted-foreground">
                Practice with 600+ RA, SLE, PsA, crystal disease, autoinflammatory conditions
                questions with detailed answers and explanations.
              </p>
            </div>

            <div className="bg-card p-8 rounded-xl shadow-sm border border-border">
              <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center mb-4">
                <Smartphone className="h-6 w-6 text-primary" />
              </div>
              <h3 className="text-xl font-semibold mb-3">Mobile Friendly & Portable Learning</h3>
              <p className="text-muted-foreground">
                Every major point from current ACR guidelines is covered.
                This deck is designed to help you study smarter, retain faster, and walk into the boards prepared.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 px-6">
        <div className="container mx-auto text-center">
          <h2 className="text-4xl font-bold mb-6">Ready to start learning?</h2>
          <p className="text-xl text-muted-foreground mb-8">
            The flashcards are organized by high-yield topics, including: <br />

            RA, SLE, PsA, crystal disease, autoinflammatory conditions,<br />

            Vasculitides,

            Dermatology relevant to rheumatology,

            Histology essentials,

            Rheumatology radiology,<br />

            Management and medication guidelines,

            Osteoporosis (per ACR guidelines)

          </p>
          <Link to="/auth?mode=signup">
            <Button size="lg" className="text-lg px-8 py-6">
              Get Started Now
            </Button>
          </Link>
        </div>
      </section>

      {/* Testimonials Section */}
      <section className="py-20 px-6 bg-muted/30">
        <h2 className="text-center py-2 text-4xl font-bold mb-6">Testimonials</h2>
        <div className="container mx-auto">
          <div className="grid md:grid-cols-3 gap-8">
            <div className="bg-card p-8 rounded-xl shadow-sm border border-border">
              <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center mb-4">
                <img
                  src={icon1}
                  alt="Pathology microscope slide"
                  className="rounded-2xl shadow-2xl w-full"
                />
              </div>
              <h3 className="text-xl font-semibold mb-3">-LM
              </h3>
              <p className="text-muted-foreground">
                Hi RheumZoom. Just wanted to let you know I passed my boards, and I know using this deck was immensely helpful, so thank you              </p>
            </div>

            <div className="bg-card p-8 rounded-xl shadow-sm border border-border">
              <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center mb-4">
                <Database className="h-6 w-6 text-primary" />
                <img
                  src={icon2}
                  alt="Pathology microscope slide"
                  className="rounded-2xl shadow-2xl w-full"
                />
              </div>
              <h3 className="text-xl font-semibold mb-3">-AK
              </h3>
              <p className="text-muted-foreground">
                Hello, I just wanted to thank you for creating and sharing the rheumatology study cards. I found out today that I passed the boards, and your cards were a great help. Thank you!
              </p>
            </div>

            <div className="bg-card p-8 rounded-xl shadow-sm border border-border">
              <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center mb-4">
                <img
                  src={icon3}
                  alt="Pathology microscope slide"
                  className="rounded-2xl shadow-2xl w-full"
                />
              </div>
              <h3 className="text-xl font-semibold mb-3">-SM</h3>
              <p className="text-muted-foreground">
                Hi. Just wanted to say how grateful I am for the time you spent putting to create this deck. I cannot stress enough how vital it was for my study prep, how much money you saved me...and I passed!
              </p>
            </div>
          </div>
        </div>
      </section>
      { /* About us section */}
      <section className="py-20 px-6 bg-muted/30">
        <h2 className="text-center py-2 text-4xl font-bold mb-10">About Us</h2>
        <div className="container mx-auto">
          <div className="grid md:grid-cols-1 gap-5 align-middle">
            <div className="bg-card p-8 rounded-xl shadow-sm border border-border">
              <p className="text-muted-foreground text-center">
                The Rheumatology Board Exam is notoriously difficult — no UWORLD, no true board-style book (beyond Rheum Secrets), and review courses that cost hundreds to thousands of dollars. Fellows and board test-takers deserve better.
                <br />
                I’m a recent graduate from a respected rheumatology program who scored well on the boards and trained on the team that won 1st place at the ACR Knowledge Bowl. I built this digital flashcard deck and question bank tailored for passing the Rheumatology Board Certification Exam.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-border py-8 px-6">
        <div className="container mx-auto">
          <div className="flex flex-wrap justify-center gap-6 text-sm text-muted-foreground">
            <Link to="/" className="hover:text-foreground transition-colors">Home</Link>
            <Link to="/terms" className="hover:text-foreground transition-colors">Terms and Conditions</Link>
            <Link to="/privacy" className="hover:text-foreground transition-colors">Privacy</Link>
            <Link to="/contact" className="hover:text-foreground transition-colors">Contact</Link>
          </div>
          <div className="text-center mt-4 text-sm text-muted-foreground">
            Copyright © 2025 Rheumzoom. All rights reserved.
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Landing;
