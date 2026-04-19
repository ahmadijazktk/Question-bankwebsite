import { useState, useEffect, useMemo } from "react";
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import AppSidebar from "@/components/AppSidebar";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { ChevronLeft, ChevronRight, ZoomIn, CheckCircle, Search, Sparkles } from "lucide-react";
import { apiGet, apiPost } from "@/lib/api";
import { useToast } from "@/hooks/use-toast";
import { saveAuthData, hasActiveSubscription } from "@/lib/auth";
import { Link } from "react-router-dom";
import {
  Dialog,
  DialogContent,
  DialogTrigger,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";

interface QuestionOption {
  text: string;
  explanation: string;
  isCorrect: boolean;
}

interface ApiQuestion {
  _id: string;
  text?: string;
  options: QuestionOption[];
  category?: string;
  difficulty?: string;
  diagram?: boolean;
  summary?: string;
  image?: string;
  image2?: string;
  isFreeTrialQuestion?: boolean;
  freeTrialOrder?: number;
  showImageWithQuestion?: boolean;
  tags?: string[];
}

interface Question {
  _id: string;
  text: string;
  options: QuestionOption[];
  summary?: string;
  diagram?: boolean;
  imageSrc?: string;
  imageAlt?: string;
  image2Src?: string;
  isFreeTrial?: boolean;
  freeTrialOrder?: number;
  showImageWithQuestion?: boolean;
  tags?: string[];
}

// Collect available images and helpers to map one unique image per question 
const imageModules = import.meta.glob([
  "/src/images/*.{png,jpg,jpeg,webp,svg}",
], { eager: true, as: "url" }) as Record<string, string>;

// Build a basename -> url index for resolving <img src> provided in question HTML
const imageBasenameToUrl: Record<string, string> = Object.entries(imageModules).reduce((acc, [path, url]) => {
  const base = path.split('/').pop()?.toLowerCase() || "";
  if (base) acc[base] = url;
  return acc;
}, {} as Record<string, string>);

// Replace <img src="filename.png"> in HTML with the correct Vite URL using our map
const resolveAnkiHtml = (html: string): string => {
  if (!html) return "";
  // rule 6: All images must load from /collection.media/
  // rule 1: Do not escape or modify except for the src path as required by rule 6
  return html.replace(/<img\b([^>]*?)\bsrc=(?:["']{1,2})([^"']+)["']{1,2}([^>]*)>/gi, (match, pre, src, post) => {
    const s = (src || "").trim();
    // If it's already an absolute URL or data URI, we keep it as is, 
    // but the rule says "All images must load from /collection.media/" 
    // In Anki context, this usually means local media files.
    if (/^(https?:)?\/\//i.test(s) || /^data:/i.test(s) || s.startsWith('/')) {
      // However, if it starts with /images/ (from old imports), we fix it
      if (s.startsWith('/images/')) {
        const base = s.split('/').pop() || s;
        return `<img${pre}src="/collection.media/${base}"${post}>`;
      }
      return match;
    }
    const base = s.split('/').pop() || s;
    return `<img${pre}src="/collection.media/${base}"${post}>`;
  });
};

const Exam = () => {
  const [questions, setQuestions] = useState<Question[]>([]);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [showAnswer, setShowAnswer] = useState(false);
  const [selectedAnswer, setSelectedAnswer] = useState("");
  const [correctAnswer, setCorrectAnswer] = useState<string | null>(null);
  const [correctExplanation, setCorrectExplanation] = useState<string | null>(null);
  const [selectedExplanation, setSelectedExplanation] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [timeSpent, setTimeSpent] = useState(0);
  const [isSubscribed, setIsSubscribed] = useState(hasActiveSubscription());
  const [refreshing, setRefreshing] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [isFreeTrialMode, setIsFreeTrialMode] = useState(false);
  const [showTrialEndDialog, setShowTrialEndDialog] = useState(false);
  const [zoomedImageUrl, setZoomedImageUrl] = useState<string | null>(null);
  const { toast } = useToast();

  const filteredQuestions = useMemo(() => {
    if (!searchQuery) return questions;
    const lower = searchQuery.toLowerCase();
    return questions.filter(q => q.text.toLowerCase().includes(lower));
  }, [questions, searchQuery]);

  const question = filteredQuestions[currentQuestionIndex];
  const canViewAnswer = isSubscribed || currentQuestionIndex === 0 || isFreeTrialMode;

  useEffect(() => {
    setCurrentQuestionIndex(0);
    resetState();
  }, [searchQuery]);

  useEffect(() => {
    const fetchQuestions = async () => {
      try {
        // 1. SILENT PROFILE REFRESH (Never blocks the page)
        const token = localStorage.getItem('token');
        if (token) {
          try {
            const [profileResponse, subRes] = await Promise.all([
              apiGet<any>("/auth/me"),
              apiGet<{ subscription: any }>("/subscriptions/current"),
            ]);

            if (profileResponse.success && profileResponse.data?.user) {
              const user = profileResponse.data.user;
              localStorage.setItem('user', JSON.stringify(user));

              const active = !!(subRes.success && subRes.data?.subscription && new Date(subRes.data.subscription.endDate) > new Date());
              setIsSubscribed(active || !!user.subscriptionStatus?.isActive);
            }
          } catch (authErr) {
            console.warn("Silent profile refresh failed:", authErr);
          }
        }

        // 2. LOAD QUESTIONS
        const params = new URLSearchParams(window.location.search);
        const category = params.get("category");
        const categoryFilter = category ? `&category=${category}` : "";
        const catFilterId = params.get("categoryFilter");
        const startId = params.get("startId");
        const isTrial = window.location.pathname.includes("/free-trial");
        setIsFreeTrialMode(isTrial);

        const CATEGORY_KEYWORDS: Record<string, string[]> = {
          RA: ["rheumatoid", "RA ", "MTX", "methotrexate", "synovitis", "anti-CCP", "RF ", "felty", "DAS28", "ACR/EULAR", "erosion"],
          SLE: ["lupus", "SLE", "nephritis", "anti-dsDNA", "anti-Smith", "ANA", "malar", "butterfly rash", "hydroxychloroquine", "HCQ", "discoid"],
          PsA: ["psoriatic", "PsA", "psoriasis", "dactylitis", "enthesitis", "CASPAR", "nail pitting"],
          Crystal: ["gout", "uric acid", "urate", "pseudogout", "CPPD", "tophi", "colchicine", "allopurinol", "febuxostat", "crystal", "MSU"],
          Vasculitis: ["vasculitis", "GPA", "EGPA", "MPA", "giant cell", "GCA", "Takayasu", "ANCA", "Behcet", "PAN", "IgA vasculitis", "Henoch"],
          Myositis: ["myositis", "dermatomyositis", "polymyositis", "IBM", "antisynthetase", "MDA5", "Jo-1", "ragged red", "myopathy", "CK ", "IIM"],
          ILD: ["ILD", "interstitial lung", "pulmonary fibrosis", "RP-ILD", "NSIP", "UIP", "nintedanib", "pirfenidone", "6MWD", "SARD"],
          SpA: ["ankylosing", "axial spondylo", "SpA", "HLA-B27", "sacroiliitis", "BASDAI", "reactive arthritis", "Reiter"],
          Osteoporosis: ["osteoporosis", "DEXA", "bisphosphonate", "denosumab", "fracture", "T-score", "Z-score", "bone mineral"],
          Medications: ["TNFi", "rituximab", "abatacept", "tocilizumab", "JAKi", "belimumab", "anifrolumab", "steroid", "glucocorticoid", "DMARDs", "biologics", "vaccine", "ACR guideline", "recommendation"],
          Radiology: ["X-ray", "MRI", "CT ", "radiograph", "biopsy", "histopathology", "stain", "microscopy", "ultrasound", "shown here", "figure"],
          Pregnancy: ["pregnant", "pregnancy", "contraception", "conception", "MMF", "teratogenic", "lactation", "breastfeed"],
          Infectious: ["infection", "septic arthritis", "prosthetic joint", "lyme", "viral", "bacteria", "fever", "yellow fever", "HBV", "HCV"],
        };

        console.log(`Fetching questions (isTrial: ${isTrial})...`);
        // Use the new backend filter for trial questions
        const trialFilter = isTrial ? "&isFreeTrialQuestion=true" : "";
        const response = await apiGet<any>(`/questions?limit=${isTrial ? 1000 : 10000}${categoryFilter}${trialFilter}`);
        const questionsList = response.data?.questions || [];

        const transformed = questionsList.map((q: any): Question => {
          let imageSrc = undefined;
          let image2Src = undefined;

          if (q.image) {
            if (/^(https?:)?\/\//i.test(q.image) || /^data:/i.test(q.image)) {
              imageSrc = q.image;
            } else {
              const base = q.image.split('/').pop() || q.image;
              imageSrc = `/collection.media/${base}`;
            }
          }

          if (q.image2) {
            if (/^(https?:)?\/\//i.test(q.image2) || /^data:/i.test(q.image2)) {
              image2Src = q.image2;
            } else {
              const base2 = q.image2.split('/').pop() || q.image2;
              image2Src = `/collection.media/${base2}`;
            }
          }

          return {
            _id: q._id,
            text: q.text || "",
            options: q.options,
            summary: q.summary,
            diagram: q.diagram,
            imageSrc: imageSrc,
            image2Src: image2Src,
            imageAlt: q.image ? `Diagram for question` : undefined,
            isFreeTrial: q.isFreeTrialQuestion || isTrial,
            freeTrialOrder: q.freeTrialOrder,
            showImageWithQuestion: q.showImageWithQuestion || q.text?.includes("Spine imaging"),
            tags: q.tags || []
          };
        });

        let finalQuestions = transformed;

        if (isTrial) {
          finalQuestions = [...transformed].sort((a, b) => (a.freeTrialOrder || 0) - (b.freeTrialOrder || 0));
        } else if (catFilterId && CATEGORY_KEYWORDS[catFilterId]) {
          const keywords = CATEGORY_KEYWORDS[catFilterId];
          finalQuestions = transformed.filter((q) =>
            keywords.some((kw) => q.text.toLowerCase().includes(kw.toLowerCase()))
          );
        }

        console.log(`Loaded ${finalQuestions.length} questions`);
        setQuestions(finalQuestions);

        // Jump to startId if provided
        if (startId) {
          const startIndex = finalQuestions.findIndex((q) => q._id === startId);
          if (startIndex !== -1) setCurrentQuestionIndex(startIndex);
        }
      } catch (error: any) {
        toast({
          title: "Error fetching questions",
          description: error.message || "Please try again later.",
          variant: "destructive",
        });
      } finally {
        setLoading(false);
      }
    };

    fetchQuestions();
  }, [toast]);

  useEffect(() => {
    if (!question) return;
    const startTime = Date.now();
    return () => {
      const endTime = Date.now();
      setTimeSpent(prev => Math.floor((endTime - startTime) / 1000));
    };
  }, [currentQuestionIndex, question]);

  const refreshSubscriptionStatus = async () => {
    setRefreshing(true);
    try {
      console.log("🔄 Manually refreshing subscription status...");
      const token = localStorage.getItem("token") || "";

      const [meRes, subRes] = await Promise.all([
        apiGet<{ user: any }>("/auth/me"),
        apiGet<{ subscription: any }>("/subscriptions/current"),
      ]);

      if (meRes.success && meRes.data?.user) {
        saveAuthData(token, meRes.data.user);
      }

      const active = !!(subRes.success && subRes.data?.subscription && new Date(subRes.data.subscription.endDate) > new Date());
      setIsSubscribed(active);

      if (active) {
        toast({
          title: "✅ Subscription Active!",
          description: "You now have full access to all questions and answers!",
        });
      } else {
        toast({
          title: "No Active Subscription",
          description: "Please purchase a subscription to unlock all features.",
          variant: "default",
        });
      }
    } catch (error: any) {
      console.error("❌ Error refreshing subscription:", error);
      toast({
        title: "Error",
        description: error.message || "Failed to refresh subscription status",
        variant: "destructive",
      });
    } finally {
      setRefreshing(false);
    }
  };

  const handleShowAnswer = async () => {
    if (!selectedAnswer || !question) return;
    setSubmitting(true);
    try {
      const response = await apiPost<{ attempt: { isCorrect: boolean; correctAnswer: string; explanation: string } }>("/exam/answer", {
        questionId: question._id,
        selectedAnswer,
        timeSpent,
      });

      if (response.success && response.data) {
        const attemptData = response.data.attempt;
        // CLEAN THE ANSWER TEXT (Hide "Show Answer" placeholders)
        let correctAnswerText = attemptData.correctAnswer ||
          question.options.find(opt => opt.isCorrect)?.text || "N/A";

        if (correctAnswerText.toLowerCase() === "show answer" && question.options.length === 1) {
          correctAnswerText = ""; // Hide it if it's just a placeholder for flashcards
        }

        setCorrectAnswer(correctAnswerText);

        // BUILD THE FULL EXPLANATION - MERGE ALL SOURCES
        const correctOption = question.options.find(opt => opt.isCorrect) ||
          question.options.find(opt => opt.text === attemptData.correctAnswer);

        const optionExplanation = correctOption?.explanation || "";
        const serverExplanation = attemptData.explanation || "";
        const sourceSummary = question.summary || "";

        // Merge them logically
        let finalExplanation = "";

        // If the "Answer" was actually hidden in the explanation field, use it.
        if (serverExplanation && serverExplanation.toLowerCase() !== "show answer") {
          finalExplanation += serverExplanation;
        }

        if (optionExplanation && optionExplanation !== serverExplanation && optionExplanation.toLowerCase() !== "show answer") {
          finalExplanation += (finalExplanation ? "\n\n" : "") + optionExplanation;
        }

        if (sourceSummary) {
          finalExplanation += (finalExplanation ? "\n\n" : "") + sourceSummary;
        }

        setCorrectExplanation(finalExplanation || optionExplanation || serverExplanation || "");

        const selectedOption = question.options.find(opt => opt.text === selectedAnswer);
        setSelectedExplanation(selectedOption?.explanation || null);
        setShowAnswer(true);
      }
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message || "Failed to submit answer",
        variant: "destructive",
      });
    } finally {
      setSubmitting(false);
    }
  };

  const handleNext = () => {
    if (currentQuestionIndex < filteredQuestions.length - 1) {
      setCurrentQuestionIndex(currentQuestionIndex + 1);
      resetState();
    } else if (isFreeTrialMode) {
      setShowTrialEndDialog(true);
    }
  };

  const handlePrevious = () => {
    if (currentQuestionIndex > 0) {
      setCurrentQuestionIndex(currentQuestionIndex - 1);
      resetState();
    }
  };

  const resetState = () => {
    setShowAnswer(false);
    setSelectedAnswer("");
    setCorrectAnswer(null);
    setCorrectExplanation(null);
    setSelectedExplanation(null);
    setTimeSpent(0);
  };

  if (loading) {
    return (
      <SidebarProvider>
        <div className="min-h-screen flex w-full">
          <AppSidebar />
          <main className="flex-1 flex items-center justify-center">
            <p className="text-muted-foreground">Loading questions...</p>
          </main>
        </div>
      </SidebarProvider>
    );
  }

  if (!question) {
    return (
      <SidebarProvider>
        <div className="min-h-screen flex w-full">
          <AppSidebar />
          <main className="flex-1 flex items-center justify-center">
            <p className="text-muted-foreground">No questions available</p>
          </main>
        </div>
      </SidebarProvider>
    );
  }

  const getOptionLetter = (index: number) => String.fromCharCode(65 + index);
  const correctOptionIndex = question.options.findIndex(opt => opt.text === correctAnswer);

  const urlParams = new URLSearchParams(window.location.search);
  const catFilterId = urlParams.get("categoryFilter");
  const categoryLabels: Record<string, string> = {
    RA: "Rheumatoid Arthritis", SLE: "SLE / Lupus", PsA: "Psoriatic Arthritis",
    Crystal: "Crystal Disease", Vasculitis: "Vasculitis", Myositis: "Myositis / IIM",
    ILD: "ILD / Pulmonary", SpA: "Spondyloarthropathy", Osteoporosis: "Osteoporosis",
    Medications: "Medications & Guidelines", Radiology: "Radiology / Histology",
    Pregnancy: "Pregnancy & Contraception", Infectious: "Infectious / Other",
  };

  return (
    <SidebarProvider>
      <div className="min-h-screen flex w-full">
        <AppSidebar />
        <main className="flex-1 bg-background/50">
          <div className="border-b border-border bg-background">
            <div className="flex items-center h-16 px-6 gap-3">
              <SidebarTrigger />
              {isFreeTrialMode ? (
                <div className="flex items-center gap-2">
                  <Badge className="bg-orange-500 hover:bg-orange-600">Free Trial</Badge>
                  <span className="text-sm text-muted-foreground hidden sm:inline">20 Essential Questions</span>
                </div>
              ) : catFilterId && categoryLabels[catFilterId] ? (
                <div className="flex items-center gap-2 text-sm">
                  <span className="text-muted-foreground">Category:</span>
                  <span className="font-semibold text-primary">{categoryLabels[catFilterId]}</span>
                  <span className="text-muted-foreground text-xs">({questions.length} questions)</span>
                </div>
              ) : null}
              <div className="flex-1 ml-4 relative max-w-md hidden md:block">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search questions..."
                  className="pl-9 bg-muted/50 border-none h-9"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </div>
            </div>
          </div>

          <div className="p-4 md:p-8 max-w-7xl mx-auto">
            <div className="mb-6 flex items-center justify-between">
              <p className="text-sm text-muted-foreground font-medium">
                Question <span className="text-foreground">{currentQuestionIndex + 1}</span> of {filteredQuestions.length}
              </p>
              <div className="flex gap-2">
                <Button variant="outline" size="sm" onClick={handlePrevious} disabled={currentQuestionIndex === 0}>
                  <ChevronLeft className="h-4 w-4 mr-1" />
                  Previous
                </Button>
                <Button variant="outline" size="sm" onClick={handleNext} disabled={currentQuestionIndex === filteredQuestions.length - 1 && !isFreeTrialMode}>
                  Next
                  <ChevronRight className="h-4 w-4 ml-1" />
                </Button>
              </div>
            </div>

            <div className={`grid ${question.imageSrc && question.options.length > 1 ? 'lg:grid-cols-2' : 'grid-cols-1'} gap-8 items-start`}>
              <Card className="shadow-sm border-border">
                <CardContent className="p-6">
                  <div className={question.options.length === 1 ? "flashcard-container" : ""}>
                    <div
                      className={`prose dark:prose-invert max-w-none text-lg font-normal leading-relaxed text-foreground/90 anki-content ${question.options.length === 1 ? "flashcard-content text-2xl font-medium" : "mb-8"}`}
                      dangerouslySetInnerHTML={{ __html: resolveAnkiHtml(question.text) }}
                    />
                  </div>

                  {question.options.length === 1 && (
                    <div className="flex flex-col items-center justify-center p-4 mt-4">
                      {!showAnswer ? (
                        <Button
                          onClick={() => {
                            setSelectedAnswer(question.options[0].text);
                            setTimeout(() => handleShowAnswer(), 50);
                          }}
                          className="w-full sm:w-auto btn-premium"
                          size="lg"
                          disabled={submitting}
                        >
                          {submitting ? "Revealing..." : "Reveal Answer"}
                        </Button>
                      ) : (
                        <div className="text-primary/70 font-medium flex items-center gap-2 text-sm uppercase tracking-widest animate-in fade-in slide-in-from-bottom-2">
                          <CheckCircle className="w-4 h-4" /> Answer revealed
                        </div>
                      )}
                    </div>
                  )}
                  {question.options.length > 1 && (
                    <RadioGroup value={selectedAnswer} onValueChange={setSelectedAnswer} disabled={showAnswer}>
                      <div className="space-y-3">
                        {question.options.map((option, idx) => {
                          const letter = getOptionLetter(idx);
                          const isSelected = selectedAnswer === option.text;
                          const isCorrect = showAnswer && canViewAnswer && (correctAnswer === option.text);
                          const isWrong = showAnswer && canViewAnswer && isSelected && !isCorrect;

                          return (
                            <div key={option.text + idx}
                              className={`flex items-start p-3 rounded-lg border transition-all ${isCorrect
                                ? 'border-green-500 bg-green-50/50 dark:bg-green-900/20'
                                : isWrong
                                  ? 'border-red-500 bg-red-50/50 dark:bg-red-900/20'
                                  : isSelected
                                    ? 'border-primary bg-primary/5'
                                    : 'border-border/60 hover:bg-muted/50'
                                }`}
                            >
                              <RadioGroupItem value={option.text} id={option.text + idx} />
                              <Label htmlFor={option.text + idx} className="cursor-pointer flex-1 ml-3 text-base font-normal leading-relaxed">
                                <span className="font-semibold mr-2 opacity-70">{letter})</span>
                                <span
                                  dangerouslySetInnerHTML={{ __html: resolveAnkiHtml(option.text) }}
                                />
                              </Label>
                            </div>
                          );
                        })}
                      </div>
                    </RadioGroup>
                  )}

                  {question.tags && question.tags.length > 0 && (
                    <div className="mt-6 flex flex-wrap gap-2">
                      {question.tags.map((tag, i) => (
                        <Badge key={i} variant="outline" className="text-[10px] opacity-60 font-normal uppercase tracking-wider bg-muted/30">
                          <span dangerouslySetInnerHTML={{ __html: resolveAnkiHtml(tag) }} />
                        </Badge>
                      ))}
                    </div>
                  )}

                  <div className="mt-8">
                    {/* Show Answer button only for Multiple Choice (options > 1) */}
                    {!showAnswer && question.options.length > 1 && (
                      <div className="flex flex-col gap-4">
                        <Button onClick={handleShowAnswer} disabled={!selectedAnswer || submitting} className="w-full sm:w-auto" size="lg">
                          {submitting ? "Checking..." : "Show Answer"}
                        </Button>
                      </div>
                    )}

                    {showAnswer && (
                      <div className="animate-in fade-in zoom-in-95 duration-300">
                        {canViewAnswer ? (
                          <div className="space-y-6">
                            <div className={`p-6 rounded-2xl ${question.options.length === 1 ? 'border-2 border-primary/20 bg-primary/5 shadow-inner' : 'bg-muted/30 border border-border'}`}>
                              <div className="flex items-center gap-2 text-primary font-bold text-lg mb-4 uppercase tracking-tight">
                                <Sparkles className="w-5 h-5" /> {question.options.length === 1 ? "The Answer" : "Correct Answer"}
                              </div>
                              <div className={`font-semibold leading-snug ${question.options.length === 1 ? 'text-2xl text-center' : 'text-lg'}`}>
                                {correctOptionIndex !== -1 && question.options.length > 1 && (
                                  <span className="font-bold mr-1">{getOptionLetter(correctOptionIndex)})</span>
                                )}
                                <div
                                  className="anki-content inline-block text-left"
                                  dangerouslySetInnerHTML={{
                                    __html: resolveAnkiHtml(correctAnswer || "")
                                  }}
                                />
                              </div>
                              {correctExplanation && correctExplanation !== correctAnswer && (
                                <div
                                  className={`mt-6 pt-6 border-t border-dashed border-primary/20 text-foreground/90 leading-relaxed anki-content ${question.options.length === 1 ? 'text-xl' : ''}`}
                                  dangerouslySetInnerHTML={{ __html: resolveAnkiHtml(correctExplanation) }}
                                />
                              )}
                            </div>
                          </div>
                        ) : (
                          <div className="p-6 bg-gradient-to-br from-indigo-50 to-purple-50 dark:from-indigo-950/30 dark:to-purple-950/30 border border-indigo-100 dark:border-indigo-900 rounded-xl text-center space-y-4 shadow-sm">
                            <h3 className="font-bold text-lg text-indigo-950 dark:text-indigo-100">Want to see the correct answer?</h3>
                            <p className="text-sm text-muted-foreground">Just purchased a subscription? Click refresh below to update your access.</p>
                            <div className="flex flex-col sm:flex-row gap-2 justify-center">
                              <Button asChild size="lg" className="bg-indigo-600 hover:bg-indigo-700">
                                <Link to="/pricing">Upgrade to Premium</Link>
                              </Button>
                              <Button
                                onClick={refreshSubscriptionStatus}
                                disabled={refreshing}
                                variant="outline"
                                size="lg"
                              >
                                {refreshing ? "Checking..." : "Refresh Subscription"}
                              </Button>
                            </div>
                          </div>
                        )}
                        <div className="mt-6 flex justify-between items-center">
                          <Button variant="ghost" onClick={() => setShowAnswer(false)} size="sm">Try Again</Button>
                          <Button onClick={handleNext} className="gap-2">Next <ChevronRight className="w-4 h-4" /></Button>
                        </div>
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>

              {question.imageSrc && (
                <div className="sticky top-6">
                  <Dialog open={!!zoomedImageUrl} onOpenChange={(open) => !open && setZoomedImageUrl(null)}>
                    <Card className="overflow-hidden border-border/80 shadow-md">
                      <CardContent className="relative p-0 flex flex-col items-center justify-center min-h-[600px]">
                        {!(showAnswer && canViewAnswer) && question.options.length === 1 && !question.showImageWithQuestion ? (
                          <div className="flex flex-col items-center justify-center text-center p-8 bg-muted/20 w-full h-[600px]">
                            <ZoomIn className="w-12 h-12 text-muted-foreground mb-4 opacity-50" />
                            <h3 className="font-semibold text-lg text-foreground/80 mb-2">Image Answer Hidden</h3>
                            <p className="text-sm text-muted-foreground max-w-[250px]">
                              {canViewAnswer ? "Click 'Reveal Answer' on the left to view the image for this flashcard." : "Subscribe to view the image answer."}
                            </p>
                          </div>
                        ) : (
                          <div className={`p-4 w-full ${question.image2Src ? 'grid grid-cols-2 gap-4' : 'flex flex-col gap-4 items-center'}`}>
                            <div
                              className="cursor-zoom-in transition-transform hover:scale-[1.02]"
                              onClick={() => setZoomedImageUrl(question.imageSrc || null)}
                            >
                              <img
                                src={question.imageSrc}
                                alt={question.imageAlt}
                                className="w-full h-auto object-contain max-h-[600px] rounded-lg"
                              />
                            </div>
                            {question.image2Src && showAnswer && (
                              <div
                                className="cursor-zoom-in transition-transform hover:scale-[1.02] animate-in fade-in zoom-in-95 duration-500"
                                onClick={() => setZoomedImageUrl(question.image2Src || null)}
                              >
                                <img
                                  src={question.image2Src}
                                  alt="Second diagram"
                                  className="w-full h-auto object-contain max-h-[600px] rounded-lg"
                                />
                              </div>
                            )}
                          </div>
                        )}
                      </CardContent>
                    </Card>
                    <DialogContent className="fixed left-0 top-0 translate-x-0 translate-y-0 w-screen h-screen max-w-none max-h-none p-0 border-none bg-background/95 sm:rounded-none flex items-center justify-center overflow-hidden">
                      {zoomedImageUrl && (
                        <div className="flex items-center justify-center w-full h-full p-4 sm:p-8">
                          <img
                            src={zoomedImageUrl}
                            alt="Zoomed"
                            className="object-contain rounded-md shadow-2xl"
                            style={{
                              width: '1250px',
                              height: '1250px',
                              maxWidth: '100%',
                              maxHeight: '100%'
                            }}
                          />
                        </div>
                      )}
                    </DialogContent>
                  </Dialog>
                  {(showAnswer && canViewAnswer) || (question.options.length > 1) ? (
                    <p className="text-center text-xs text-muted-foreground mt-2 animate-in fade-in">Click image to enlarge</p>
                  ) : null}
                </div>
              )}
            </div>
          </div>
        </main>
      </div>

      {/* Trial End Dialog */}
      <Dialog open={showTrialEndDialog} onOpenChange={setShowTrialEndDialog}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="text-2xl font-bold flex items-center gap-2">
              <Sparkles className="w-6 h-6 text-orange-500" />
              Trial Completed!
            </DialogTitle>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <p className="text-muted-foreground leading-relaxed">
              You've completed all 20 free trial questions. We hope you found them helpful for your rheumatology boards!
            </p>
            <p className="font-semibold text-foreground">
              Unlock the full bank of 600+ evidence-based questions and detailed ACR guideline explanations today.
            </p>
          </div>
          <div className="flex flex-col gap-2">
            <Button asChild size="lg" className="bg-primary hover:bg-primary/90">
              <Link to="/pricing">Unlock 600+ Questions</Link>
            </Button>
            <Button variant="outline" onClick={() => setShowTrialEndDialog(false)}>
              Back to Questions
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </SidebarProvider>
  );
};

export default Exam;
