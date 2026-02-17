import { useState, useEffect } from "react";
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import AppSidebar from "@/components/AppSidebar";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { ChevronLeft, ChevronRight, ZoomIn, CheckCircle } from "lucide-react";
import { apiGet, apiPost } from "@/lib/api";
import { useToast } from "@/hooks/use-toast";
import { hasActiveSubscription } from "@/lib/auth";
import { Link } from "react-router-dom";
import {
  Dialog,
  DialogContent,
  DialogTrigger,
} from "@/components/ui/dialog";

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
}

interface Question {
  _id: string;
  text: string;
  options: QuestionOption[];
  summary?: string;
  diagram?: boolean;
  imageSrc?: string;
  imageAlt?: string;
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
const resolveImageSources = (html: string): string => {
  if (!html) return html;
  return html.replace(/<img\b([^>]*?)\bsrc=(?:["']{1,2})([^"']+)["']{1,2}([^>]*)>/gi, (match, pre, src, post) => {
    const s = (src || "").trim();
    if (/^(https?:)?\/\//i.test(s) || /^data:/i.test(s)) return match;
    const base = s.split('/').pop()?.toLowerCase() || s.toLowerCase();
    const mapped = imageBasenameToUrl[base];
    if (mapped) {
      return `<img${pre}src="${mapped}"${post}>`;
    }
    return match;
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
  const { toast } = useToast();

  const question = questions[currentQuestionIndex];
  const canViewAnswer = isSubscribed || currentQuestionIndex === 0;

  useEffect(() => {
    const fetchQuestions = async () => {
      try {
        // Refresh subscription status from server to catch recent payments
        const profileResponse = await apiGet<any>("/auth/profile");
        if (profileResponse.success && profileResponse.data?.user) {
          localStorage.setItem('user', JSON.stringify(profileResponse.data.user));
          setIsSubscribed(!!(profileResponse.data.user.subscriptionStatus?.isActive));
        }

        const response = await apiGet<any>("/questions?limit=50");
        const questionsList = response.data?.questions || [];

        const transformed = questionsList.map((q: ApiQuestion): Question => {
          let imageSrc = undefined;
          if (q.image) {
            // Check if it's an absolute URL
            if (/^(https?:)?\/\//i.test(q.image) || /^data:/i.test(q.image)) {
              imageSrc = q.image;
            } else {
              // Otherwise try to map from local bundle
              const lower = q.image.split('/').pop()?.toLowerCase() || "";
              imageSrc = imageBasenameToUrl[lower];
            }
          }

          return {
            _id: q._id,
            text: q.text || "",
            options: q.options,
            summary: q.summary,
            diagram: q.diagram,
            imageSrc: imageSrc,
            imageAlt: q.image ? `Diagram for question` : undefined
          };
        });
        setQuestions(transformed);
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
        const correctAnswerText = response.data.attempt.correctAnswer ||
          question.options.find(opt => opt.isCorrect)?.text || null;

        setCorrectAnswer(correctAnswerText);

        // Priority: option-specific explanation, then attempt explanation, then summary as a prefix/suffix
        const mainExplanation = response.data.attempt.explanation ||
          question.options.find(opt => opt.text === (response.data.attempt.correctAnswer || selectedAnswer))?.explanation ||
          question.options.find(opt => opt.isCorrect)?.explanation || "";

        const finalExplanation = mainExplanation + (question.summary ? `\n\n${question.summary}` : "");
        setCorrectExplanation(finalExplanation || null);

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
    if (currentQuestionIndex < questions.length - 1) {
      setCurrentQuestionIndex(currentQuestionIndex + 1);
      resetState();
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

  return (
    <SidebarProvider>
      <div className="min-h-screen flex w-full">
        <AppSidebar />
        <main className="flex-1 bg-background/50">
          <div className="border-b border-border bg-background">
            <div className="flex items-center h-16 px-6">
              <SidebarTrigger />
            </div>
          </div>

          <div className="p-4 md:p-8 max-w-7xl mx-auto">
            <div className="mb-6 flex items-center justify-between">
              <p className="text-sm text-muted-foreground font-medium">
                Question <span className="text-foreground">{currentQuestionIndex + 1}</span> of {questions.length}
              </p>
              <div className="flex gap-2">
                <Button variant="outline" size="sm" onClick={handlePrevious} disabled={currentQuestionIndex === 0}>
                  <ChevronLeft className="h-4 w-4 mr-1" />
                  Previous
                </Button>
                <Button variant="outline" size="sm" onClick={handleNext} disabled={currentQuestionIndex === questions.length - 1}>
                  Next
                  <ChevronRight className="h-4 w-4 ml-1" />
                </Button>
              </div>
            </div>

            <div className={`grid ${question.imageSrc ? 'lg:grid-cols-2' : 'grid-cols-1'} gap-8 items-start`}>
              <Card className="shadow-sm border-border">
                <CardContent className="p-6">
                  <div
                    className="prose dark:prose-invert max-w-none mb-8 text-lg font-normal leading-relaxed text-foreground/90"
                    dangerouslySetInnerHTML={{ __html: resolveImageSources(question.text) }}
                  />

                  {question.options.length === 1 ? (
                    <div className="flex flex-col items-center justify-center p-8 border-2 border-dashed border-border rounded-xl bg-muted/20">
                      <p className="text-muted-foreground mb-4 text-center">This is a flashcard-style question.</p>
                      <Button
                        onClick={() => {
                          setSelectedAnswer(question.options[0].text);
                          // We need to set state to trigger the "Show Answer" logic effectively or just call the handler directly if designed that way.
                          // But handleShowAnswer depends on selectedAnswer being set. 
                          // React state update is async, so we can't call handleShowAnswer immediately after setSelectedAnswer in the same closure easily without useEffect or a wrapper.
                          // Actually, better to just let user click "Show Answer" below, or auto-submit?
                          // The user flow: Click "I'm ready" -> Answer Revealed.
                          // But our "Show Answer" button is below.
                          // Let's just AUTO-SELECT the only option so the "Show Answer" button becomes active and meaningful.
                          setSelectedAnswer(question.options[0].text);
                        }}
                        variant={selectedAnswer === question.options[0].text ? "default" : "outline"}
                        className="w-full sm:w-auto"
                      >
                        {selectedAnswer ? "Ready to Reveal" : "I have the answer in mind"}
                      </Button>
                    </div>
                  ) : (
                    <RadioGroup value={selectedAnswer} onValueChange={setSelectedAnswer} disabled={showAnswer}>
                      <div className="space-y-3">
                        {question.options.map((option, idx) => {
                          const letter = getOptionLetter(idx);
                          const isSelected = selectedAnswer === option.text;
                          const isCorrect = showAnswer && canViewAnswer && correctAnswer === option.text;
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
                                {option.text}
                              </Label>
                            </div>
                          );
                        })}
                      </div>
                    </RadioGroup>
                  )}

                  <div className="mt-8">
                    {!showAnswer ? (
                      <div className="flex flex-col gap-4">
                        <Button onClick={handleShowAnswer} disabled={!selectedAnswer || submitting} className="w-full sm:w-auto" size="lg">
                          {submitting ? "Checking..." : "Show Answer"}
                        </Button>
                      </div>
                    ) : (
                      <div className="animate-in fade-in zoom-in-95 duration-300">
                        {canViewAnswer ? (
                          <div className="space-y-6">
                            <div className="p-4 rounded-xl bg-muted/30 border border-border">
                              <div className="flex items-center gap-2 text-green-600 dark:text-green-400 font-bold text-lg mb-2">
                                <CheckCircle className="w-5 h-5" /> Correct Answer
                              </div>
                              <div className="font-medium text-lg leading-snug">
                                {correctOptionIndex !== -1 && <span className="font-bold mr-1">{getOptionLetter(correctOptionIndex)})</span>}
                                {correctAnswer}
                              </div>
                              {correctExplanation && (
                                <div className="mt-4 pt-4 border-t border-dashed border-border text-foreground/80 leading-relaxed whitespace-pre-wrap">
                                  {correctExplanation}
                                </div>
                              )}
                            </div>
                          </div>
                        ) : (
                          <div className="p-6 bg-gradient-to-br from-indigo-50 to-purple-50 dark:from-indigo-950/30 dark:to-purple-950/30 border border-indigo-100 dark:border-indigo-900 rounded-xl text-center space-y-4 shadow-sm">
                            <h3 className="font-bold text-lg text-indigo-950 dark:text-indigo-100">Want to see the correct answer?</h3>
                            <Button asChild size="lg" className="bg-indigo-600 hover:bg-indigo-700">
                              <Link to="/pricing">Upgrade to Premium</Link>
                            </Button>
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
                  <Dialog>
                    <DialogTrigger asChild>
                      <Card className="overflow-hidden border-border/80 shadow-md cursor-zoom-in">
                        <CardContent className="p-0 flex items-center justify-center min-h-[300px]">
                          <img src={question.imageSrc} alt={question.imageAlt} className="w-full h-auto object-contain max-h-[500px]" />
                        </CardContent>
                      </Card>
                    </DialogTrigger>
                    <DialogContent className="max-w-5xl w-[95vw] h-[90vh] p-0 flex items-center justify-center bg-background/95">
                      <img src={question.imageSrc} alt="Zoomed" className="max-w-full max-h-full object-contain" />
                    </DialogContent>
                  </Dialog>
                  <p className="text-center text-xs text-muted-foreground mt-2">Click image to enlarge</p>
                </div>
              )}
            </div>
          </div>
        </main>
      </div>
    </SidebarProvider>
  );
};

export default Exam;
