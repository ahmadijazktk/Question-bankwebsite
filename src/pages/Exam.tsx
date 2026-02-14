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
  question?: string;
  text?: string;
  options: any[]; // Can be character array format or proper options
  answer?: string;
  category?: string;
  difficulty?: string;
  diagram?: boolean;
  summary?: string;
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
const allImageUrls: string[] = Object.values(imageModules);
// Build a basename -> url index for resolving <img src> provided in question HTML
const imageBasenameToUrl: Record<string, string> = Object.entries(imageModules).reduce((acc, [path, url]) => {
  const base = path.split('/').pop()?.toLowerCase() || "";
  if (base) acc[base] = url;
  return acc;
}, {} as Record<string, string>);

// Replace <img src="filename.png"> in HTML with the correct Vite URL using our map
const resolveImageSources = (html: string): string => {
  if (!html) return html;
  // Handle both single/double quotes and the double-double quotes often seen in CSV/Converted data
  return html.replace(/<img\b([^>]*?)\bsrc=(?:["']{1,2})([^"']+)["']{1,2}([^>]*)>/gi, (match, pre, src, post) => {
    const s = (src || "").trim();
    // If already absolute/http/data or looks like a Vite-resolved path, keep as is
    if (/^(https?:)?\/\//i.test(s) || /^data:/i.test(s)) return match;
    const base = s.split('/').pop()?.toLowerCase() || s.toLowerCase();
    const mapped = imageBasenameToUrl[base];
    if (mapped) {
      return `<img${pre}src="${mapped}"${post}>`;
    }
    return match; // fallback
  });
};

const keywordPick = (q: string, used: Set<string>): string | undefined => {
  const lower = q.toLowerCase();
  const tryPick = (predicate: (p: string) => boolean) => {
    const found = allImageUrls.find(u => predicate(u) && !used.has(u));
    if (found) used.add(found);
    return found;
  };
  if (lower.includes("vaccine") || lower.includes("influenza") || lower.includes("pneumo") || lower.includes("zoster") || lower.includes("immuniz")) {
    const byName = tryPick(u => /vaccine/i.test(u));
    if (byName) return byName;
  }
  if (lower.includes("pregnancy") || lower.includes("pregnant") || lower.includes("birth") || lower.includes("conceive")) {
    const byName = tryPick(u => /pregnancy/i.test(u));
    if (byName) return byName;
  }
  if (lower.includes("contracept") || lower.includes("health") || lower.includes("hormone") || lower.includes("reproductive")) {
    const byName = tryPick(u => /reproductive/i.test(u));
    if (byName) return byName;
  }
  if (lower.includes("lupus") || lower.includes("sle") || lower.includes("aps") || lower.includes("apl") || lower.includes("phospholipid")) {
    const byName = tryPick(u => /reproductive|pregnancy/i.test(u));
    if (byName) return byName;
  }
  return undefined;
};

const deriveAlt = (q: string): string => {
  const base = q.replace(/\s+/g, " ").trim();
  return `${base.length > 80 ? base.slice(0, 77) + '…' : base} - illustrative image`;
};

type QuestionWithImage = Question & { imageSrc?: string; imageAlt?: string };
const assignImages = (qs: Question[]): QuestionWithImage[] => {
  const used = new Set<string>();
  const result = qs.map(q => ({ ...q }));
  let cursor = 0;
  for (const q of result as QuestionWithImage[]) {
    let pick = keywordPick(q.text, used);
    if (!pick) {
      while (cursor < allImageUrls.length && used.has(allImageUrls[cursor])) cursor++;
      if (cursor < allImageUrls.length) {
        pick = allImageUrls[cursor];
        used.add(pick);
        cursor++;
      }
    }
    (q as QuestionWithImage).imageSrc = pick;
    (q as QuestionWithImage).imageAlt = pick ? deriveAlt(q.text) : undefined;
  }
  return result as QuestionWithImage[];
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
  const [isSubscribed] = useState(hasActiveSubscription());
  const { toast } = useToast();

  const question = questions[currentQuestionIndex];

  // First question is free, or user must be subscribed
  const canViewAnswer = isSubscribed || currentQuestionIndex === 0;

  // Transform API question format to component format
  const transformQuestion = (apiQuestion: ApiQuestion): Question => {
    let questionText = apiQuestion.question || apiQuestion.text || "";

    // Transform options
    let transformedOptions: QuestionOption[] = [];

    if (apiQuestion.options && apiQuestion.options.length > 0) {
      // Check if options are in character array format
      const firstOption = apiQuestion.options[0];
      if (typeof firstOption === 'object' && firstOption['0'] !== undefined) {
        // Character array format - reconstruct the text
        const charArray: Record<string, string> = firstOption;
        const optionText = Object.keys(charArray)
          .sort((a, b) => parseInt(a) - parseInt(b))
          .map(key => charArray[key])
          .join('');

        // Split by comma to get individual options
        const optionStrings = optionText.split(',').map(opt => opt.trim()).filter(opt => opt.length > 0);

        // Create option objects
        transformedOptions = optionStrings.map(opt => ({
          text: opt,
          explanation: opt === apiQuestion.answer ? "This is the correct answer." : "This is not the correct answer.",
          isCorrect: opt === apiQuestion.answer
        }));
      } else if (Array.isArray(apiQuestion.options) && apiQuestion.options.length > 0 && typeof apiQuestion.options[0] === 'object' && 'text' in apiQuestion.options[0]) {
        // Already in proper format
        transformedOptions = apiQuestion.options.map((opt: any) => ({
          text: opt.text || "",
          explanation: opt.explanation || "",
          isCorrect: opt.isCorrect || false
        }));
      }
    }

    return {
      _id: apiQuestion._id,
      text: questionText,
      options: transformedOptions,
      summary: apiQuestion.summary,
      diagram: apiQuestion.diagram || false
    };
  };

  useEffect(() => {
    const fetchQuestions = async () => {
      try {
        const response = await apiGet<{ questions: ApiQuestion[] }>("/questions?limit=50");
        if (response.success && response.data) {
          // Transform questions from API format to component format
          const transformedQuestions = response.data.questions.map(transformQuestion);
          // Assign images based on keywords and availability
          const questionsWithImages = assignImages(transformedQuestions);
          setQuestions(questionsWithImages);
          console.log("Transformed questions with images:", questionsWithImages);
        }
      } catch (error: any) {
        toast({
          title: "Error",
          description: error.message || "Failed to load questions",
          variant: "destructive",
        });
      } finally {
        setLoading(false);
      }
    };

    fetchQuestions();
  }, [toast]);

  // Track time spent on current question
  useEffect(() => {
    if (!question) return;

    const startTime = Date.now();
    return () => {
      const endTime = Date.now();
      setTimeSpent(Math.floor((endTime - startTime) / 1000));
    };
  }, [currentQuestionIndex, question]);

  const handleShowAnswer = async () => {
    if (!selectedAnswer || !question) return;

    // Save attempt (or just show locally if we prefer)
    // We submit to track progress, but viewing depends on subscription
    setSubmitting(true);
    try {
      const response = await apiPost<{ attempt: { isCorrect: boolean; correctAnswer: string; explanation: string } }>("/exam/answer", {
        questionId: question._id,
        selectedAnswer,
        timeSpent,
      });

      if (response.success && response.data) {
        const correctAnswerText = response.data.attempt.correctAnswer ||
          question.options.find(opt => opt.isCorrect)?.text ||
          null;

        setCorrectAnswer(correctAnswerText);
        // Prioritize question summary for the "Explanation" block
        setCorrectExplanation(question.summary || response.data.attempt.explanation ||
          question.options.find(opt => opt.isCorrect)?.explanation ||
          null);

        // Find explanation for selected answer
        const selectedOption = question.options.find(opt => opt.text === selectedAnswer);
        setSelectedExplanation(selectedOption?.explanation || null);

        setShowAnswer(true);
      }
    } catch (error: any) {
      // If offline or error, mostly fallback to local state if possible, but for now just toast
      toast({
        title: "Error",
        description: error.message || "Failed to submit answer",
        variant: "destructive",
      });
      // Fallback for demo purposes if backend fails? 
      // For now, let's rely on backend returning correct answer.
    } finally {
      setSubmitting(false);
    }
  };

  const handleNext = () => {
    if (currentQuestionIndex < questions.length - 1) {
      setCurrentQuestionIndex(currentQuestionIndex + 1);
      setShowAnswer(false);
      setSelectedAnswer("");
      setCorrectAnswer(null);
      setCorrectExplanation(null);
      setSelectedExplanation(null);
      setTimeSpent(0);
    }
  };

  const handlePrevious = () => {
    if (currentQuestionIndex > 0) {
      setCurrentQuestionIndex(currentQuestionIndex - 1);
      setShowAnswer(false);
      setSelectedAnswer("");
      setCorrectAnswer(null);
      setCorrectExplanation(null);
      setSelectedExplanation(null);
      setTimeSpent(0);
    }
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

  // Helper to get letter (A, B, C...) for index
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
                <Button
                  variant="outline"
                  size="sm"
                  onClick={handlePrevious}
                  disabled={currentQuestionIndex === 0}
                >
                  <ChevronLeft className="h-4 w-4 mr-1" />
                  Previous
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={handleNext}
                  disabled={currentQuestionIndex === questions.length - 1}
                >
                  Next
                  <ChevronRight className="h-4 w-4 ml-1" />
                </Button>
              </div>
            </div>

            <div className={`grid ${question.imageSrc ? 'lg:grid-cols-2' : 'grid-cols-1'} gap-8 items-start`}>
              {/* Question Card */}
              <Card className="shadow-sm border-border">
                <CardContent className="p-6">
                  <div
                    className="prose dark:prose-invert max-w-none mb-8 text-lg font-normal leading-relaxed text-foreground/90"
                    dangerouslySetInnerHTML={{ __html: resolveImageSources(question.text) }}
                  />

                  <RadioGroup value={selectedAnswer} onValueChange={setSelectedAnswer} disabled={showAnswer}>
                    <div className="space-y-3">
                      {question.options.map((option, idx) => {
                        const letter = getOptionLetter(idx);
                        const isSelected = selectedAnswer === option.text;
                        const isCorrect = showAnswer && canViewAnswer && correctAnswer === option.text;
                        const isWrong = showAnswer && canViewAnswer && isSelected && !isCorrect;

                        return (
                          <div key={option.text}
                            className={`flex items-start p-3 rounded-lg border transition-all ${isCorrect
                                ? 'border-green-500 bg-green-50/50 dark:bg-green-900/20'
                                : isWrong
                                  ? 'border-red-500 bg-red-50/50 dark:bg-red-900/20'
                                  : isSelected
                                    ? 'border-primary bg-primary/5'
                                    : 'border-border/60 hover:bg-muted/50'
                              }`}
                          >
                            <RadioGroupItem
                              value={option.text}
                              id={option.text}
                              className={`mt-1 ${isCorrect ? 'text-green-600 border-green-600' : ''}`}
                            />
                            <Label
                              htmlFor={option.text}
                              className="cursor-pointer flex-1 ml-3 text-base font-normal leading-relaxed"
                            >
                              <span className="font-semibold mr-2 opacity-70">{letter})</span>
                              {option.text}
                            </Label>
                          </div>
                        );
                      })}
                    </div>
                  </RadioGroup>

                  {/* Actions & Feedback */}
                  <div className="mt-8">
                    {!showAnswer ? (
                      <div className="flex flex-col gap-4">
                        <Button
                          onClick={handleShowAnswer}
                          disabled={!selectedAnswer || submitting}
                          className="w-full sm:w-auto"
                          size="lg"
                        >
                          {submitting ? "Checking..." : "Show Answer"}
                        </Button>
                        {!isSubscribed && currentQuestionIndex !== 0 && (
                          <p className="text-xs text-muted-foreground text-center sm:text-left">
                            * Premium explanation hidden for this question
                          </p>
                        )}
                      </div>
                    ) : (
                      <div className="animate-in fade-in zoom-in-95 duration-300">
                        {canViewAnswer ? (
                          <div className="space-y-6">
                            {/* Correct Answer Header */}
                            <div className="p-4 rounded-xl bg-muted/30 border border-border">
                              <div className="flex items-center gap-2 text-green-600 dark:text-green-400 font-bold text-lg mb-2">
                                <CheckCircle className="w-5 h-5" />
                                Correct Answer
                              </div>

                              <div className="font-medium text-lg leading-snug">
                                {correctOptionIndex !== -1 && (
                                  <span className="font-bold mr-1">
                                    {getOptionLetter(correctOptionIndex)})
                                  </span>
                                )}
                                {correctAnswer}
                              </div>

                              {/* Detailed Explanation */}
                              {correctExplanation && (
                                <div className="mt-4 pt-4 border-t border-dashed border-border text-foreground/80 leading-relaxed whitespace-pre-wrap">
                                  {correctExplanation.replace(/^Key point:\s*/i, '')}
                                </div>
                              )}
                            </div>
                          </div>
                        ) : (
                          // Not Subscribed View
                          <div className="p-6 bg-gradient-to-br from-indigo-50 to-purple-50 dark:from-indigo-950/30 dark:to-purple-950/30 border border-indigo-100 dark:border-indigo-900 rounded-xl text-center space-y-4 shadow-sm">
                            <h3 className="font-bold text-lg text-indigo-950 dark:text-indigo-100">Want to see the correct answer and explanations?</h3>
                            <p className="text-indigo-800/80 dark:text-indigo-300 max-w-md mx-auto">
                              Upgrade to a Premium Plan to unlock detailed answers for every question.
                            </p>
                            <Button asChild size="lg" className="w-full sm:w-auto bg-indigo-600 hover:bg-indigo-700 text-white shadow-lg shadow-indigo-200/50 dark:shadow-none">
                              <Link to="/pricing">
                                Upgrade to Premium Plan
                              </Link>
                            </Button>
                          </div>
                        )}

                        <div className="mt-6 flex justify-between items-center">
                          <Button variant="ghost" onClick={() => setShowAnswer(false)} size="sm">
                            Try Again
                          </Button>
                          <Button onClick={handleNext} className="gap-2">
                            Next Question <ChevronRight className="w-4 h-4" />
                          </Button>
                        </div>
                      </div>
                    )}
                  </div>

                </CardContent>
              </Card>

              {/* Image Card (Right side) */}
              {question.imageSrc && (
                <div className="sticky top-6">
                  <Dialog>
                    <DialogTrigger asChild>
                      <Card className="overflow-hidden border-border/80 shadow-md transition-all hover:shadow-lg hover:border-primary/50 cursor-zoom-in group">
                        <CardContent className="p-0 bg-muted/10 relative min-h-[300px] flex items-center justify-center">
                          <img
                            src={question.imageSrc}
                            alt={question.imageAlt || "Question illustration"}
                            className="w-full h-auto object-contain max-h-[500px]"
                          />
                          <div className="absolute inset-0 bg-black/5 group-hover:bg-black/10 transition-colors flex items-center justify-center opacity-0 group-hover:opacity-100">
                            <span className="bg-background/90 text-foreground px-4 py-2 rounded-full text-sm font-medium shadow-sm flex items-center gap-2">
                              <ZoomIn className="w-4 h-4" /> Zoom Image
                            </span>
                          </div>
                        </CardContent>
                      </Card>
                    </DialogTrigger>
                    <DialogContent className="max-w-5xl w-[95vw] h-[90vh] p-0 bg-background/95 border-none shadow-2xl flex items-center justify-center outline-none">
                      <div className="relative w-full h-full p-4 flex items-center justify-center">
                        <img
                          src={question.imageSrc}
                          alt={question.imageAlt || "Zoomed illustration"}
                          className="max-w-full max-h-full object-contain drop-shadow-2xl"
                        />
                      </div>
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
