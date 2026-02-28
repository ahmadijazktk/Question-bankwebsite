import { useState, useEffect } from "react";
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import AppSidebar from "@/components/AppSidebar";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Search, BookOpen, ChevronRight, X } from "lucide-react";
import { apiGet } from "@/lib/api";
import { useToast } from "@/hooks/use-toast";
import { useNavigate } from "react-router-dom";

interface Question {
  _id: string;
  text: string;
  category: string;
  difficulty: string;
  image?: string;
}

// Define rheumatology categories with display labels and keywords
const CATEGORIES = [
  {
    id: "RA",
    label: "Rheumatoid Arthritis",
    color: "bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-300",
    borderColor: "border-blue-300 dark:border-blue-700",
    keywords: ["rheumatoid", "RA ", "MTX", "methotrexate", "synovitis", "anti-CCP", "RF ", "felty", "DAS28", "ACR/EULAR", "erosion"],
  },
  {
    id: "SLE",
    label: "SLE / Lupus",
    color: "bg-purple-100 text-purple-800 dark:bg-purple-900/30 dark:text-purple-300",
    borderColor: "border-purple-300 dark:border-purple-700",
    keywords: ["lupus", "SLE", "nephritis", "anti-dsDNA", "anti-Smith", "ANA", "malar", "butterfly rash", "hydroxychloroquine", "HCQ", "discoid"],
  },
  {
    id: "PsA",
    label: "Psoriatic Arthritis",
    color: "bg-orange-100 text-orange-800 dark:bg-orange-900/30 dark:text-orange-300",
    borderColor: "border-orange-300 dark:border-orange-700",
    keywords: ["psoriatic", "PsA", "psoriasis", "dactylitis", "enthesitis", "CASPAR", "nail pitting"],
  },
  {
    id: "Crystal",
    label: "Crystal Disease (Gout / CPPD)",
    color: "bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-300",
    borderColor: "border-yellow-300 dark:border-yellow-700",
    keywords: ["gout", "uric acid", "urate", "pseudogout", "CPPD", "tophi", "colchicine", "allopurinol", "febuxostat", "crystal", "MSU"],
  },
  {
    id: "Vasculitis",
    label: "Vasculitis",
    color: "bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-300",
    borderColor: "border-red-300 dark:border-red-700",
    keywords: ["vasculitis", "GPA", "EGPA", "MPA", "giant cell", "GCA", "Takayasu", "ANCA", "Behcet", "PAN", "IgA vasculitis", "Henoch"],
  },
  {
    id: "Myositis",
    label: "Myositis / IIM",
    color: "bg-pink-100 text-pink-800 dark:bg-pink-900/30 dark:text-pink-300",
    borderColor: "border-pink-300 dark:border-pink-700",
    keywords: ["myositis", "dermatomyositis", "polymyositis", "IBM", "antisynthetase", "MDA5", "Jo-1", "ragged red", "myopathy", "CK ", "IIM"],
  },
  {
    id: "ILD",
    label: "ILD / Pulmonary",
    color: "bg-teal-100 text-teal-800 dark:bg-teal-900/30 dark:text-teal-300",
    borderColor: "border-teal-300 dark:border-teal-700",
    keywords: ["ILD", "interstitial lung", "pulmonary fibrosis", "RP-ILD", "NSIP", "UIP", "nintedanib", "pirfenidone", "6MWD", "SARD"],
  },
  {
    id: "SpA",
    label: "Spondyloarthropathy",
    color: "bg-indigo-100 text-indigo-800 dark:bg-indigo-900/30 dark:text-indigo-300",
    borderColor: "border-indigo-300 dark:border-indigo-700",
    keywords: ["ankylosing", "axial spondylo", "SpA", "HLA-B27", "sacroiliitis", "BASDAI", "reactive arthritis", "Reiter"],
  },
  {
    id: "Osteoporosis",
    label: "Osteoporosis / Bone",
    color: "bg-stone-100 text-stone-800 dark:bg-stone-900/30 dark:text-stone-300",
    borderColor: "border-stone-300 dark:border-stone-700",
    keywords: ["osteoporosis", "DEXA", "bisphosphonate", "denosumab", "fracture", "T-score", "Z-score", "bone mineral"],
  },
  {
    id: "Medications",
    label: "Medications & Guidelines",
    color: "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300",
    borderColor: "border-green-300 dark:border-green-700",
    keywords: ["TNFi", "rituximab", "abatacept", "tocilizumab", "JAKi", "belimumab", "anifrolumab", "steroid", "glucocorticoid", "DMARDs", "biologics", "vaccine", "ACR guideline", "recommendation"],
  },
  {
    id: "Radiology",
    label: "Radiology / Histology",
    color: "bg-cyan-100 text-cyan-800 dark:bg-cyan-900/30 dark:text-cyan-300",
    borderColor: "border-cyan-300 dark:border-cyan-700",
    keywords: ["X-ray", "MRI", "CT ", "radiograph", "biopsy", "histopathology", "stain", "microscopy", "ultrasound", "shown here", "figure"],
  },
  {
    id: "Pregnancy",
    label: "Pregnancy & Contraception",
    color: "bg-rose-100 text-rose-800 dark:bg-rose-900/30 dark:text-rose-300",
    borderColor: "border-rose-300 dark:border-rose-700",
    keywords: ["pregnant", "pregnancy", "contraception", "conception", "MMF", "teratogenic", "lactation", "breastfeed"],
  },
  {
    id: "Infectious",
    label: "Infectious / Other",
    color: "bg-lime-100 text-lime-800 dark:bg-lime-900/30 dark:text-lime-300",
    borderColor: "border-lime-300 dark:border-lime-700",
    keywords: ["infection", "septic arthritis", "prosthetic joint", "lyme", "viral", "bacteria", "fever", "yellow fever", "HBV", "HCV"],
  },
];

// Assign a category id to a question based on keyword matching
const assignCategory = (text: string): string => {
  const lower = text.toLowerCase();
  for (const cat of CATEGORIES) {
    if (cat.keywords.some((kw) => lower.includes(kw.toLowerCase()))) {
      return cat.id;
    }
  }
  return "Other";
};

const Stats = () => {
  const [allQuestions, setAllQuestions] = useState<Question[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const { toast } = useToast();
  const navigate = useNavigate();

  useEffect(() => {
    const fetchQuestions = async () => {
      try {
        const res = await apiGet<{ questions: Question[] }>("/questions?limit=10000");
        if (res.success && res.data) {
          setAllQuestions(res.data.questions);
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

  // Categorize questions
  const categorized = allQuestions.map((q) => ({
    ...q,
    computedCategory: assignCategory(q.text),
  }));

  const categoryCounts: Record<string, number> = {};
  for (const q of categorized) {
    categoryCounts[q.computedCategory] = (categoryCounts[q.computedCategory] || 0) + 1;
  }

  // Filter questions by search or selected category
  const filteredQuestions = categorized.filter((q) => {
    const matchesSearch = searchQuery
      ? q.text.toLowerCase().includes(searchQuery.toLowerCase())
      : true;
    const matchesCategory = selectedCategory ? q.computedCategory === selectedCategory : true;
    return matchesSearch && matchesCategory;
  });

  const showingFiltered = !!searchQuery || !!selectedCategory;

  return (
    <SidebarProvider>
      <div className="min-h-screen flex w-full bg-background">
        <AppSidebar />
        <main className="flex-1">
          <div className="border-b border-border">
            <div className="flex items-center h-16 px-6">
              <SidebarTrigger />
            </div>
          </div>

          <div className="p-6 lg:p-8">
            <h1 className="text-3xl font-bold mb-6">Question Bank</h1>

            {/* Search Bar */}
            <div className="relative mb-8">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
              <Input
                className="pl-10 pr-10 text-base h-12 rounded-xl border-border/60"
                placeholder="Search any question..."
                value={searchQuery}
                onChange={(e) => {
                  setSearchQuery(e.target.value);
                  if (e.target.value) setSelectedCategory(null);
                }}
              />
              {searchQuery && (
                <button
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                  onClick={() => setSearchQuery("")}
                >
                  <X className="w-4 h-4" />
                </button>
              )}
            </div>

            {loading ? (
              <p className="text-muted-foreground">Loading questions...</p>
            ) : (
              <div className="grid lg:grid-cols-[300px_1fr] gap-8 items-start">

                {/* LEFT: Stats + Category List */}
                <div className="space-y-6">
                  {/* Total Questions */}
                  <Card className="border-border/60 shadow-sm">
                    <CardHeader className="pb-2">
                      <CardTitle className="text-base font-semibold text-muted-foreground uppercase tracking-wider">
                        Total Questions
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <p className="text-6xl font-bold text-primary">{allQuestions.length}</p>
                      <p className="text-sm text-muted-foreground mt-1">across all categories</p>
                    </CardContent>
                  </Card>

                  {/* Categories */}
                  <Card className="border-border/60 shadow-sm">
                    <CardHeader className="pb-3">
                      <CardTitle className="text-base font-semibold">Browse by Category</CardTitle>
                    </CardHeader>
                    <CardContent className="p-0">
                      <ul className="divide-y divide-border/40">
                        {CATEGORIES.map((cat) => {
                          const count = categoryCounts[cat.id] || 0;
                          if (count === 0) return null;
                          return (
                            <li key={cat.id}>
                              <button
                                className={`w-full flex items-center justify-between px-5 py-3 text-left transition-colors hover:bg-muted/50 ${selectedCategory === cat.id ? "bg-primary/5 border-l-2 border-primary" : ""
                                  }`}
                                onClick={() => {
                                  setSelectedCategory(selectedCategory === cat.id ? null : cat.id);
                                  setSearchQuery("");
                                }}
                              >
                                <div className="flex items-center gap-2 min-w-0">
                                  <span className="text-sm font-medium truncate">{cat.label}</span>
                                </div>
                                <div className="flex items-center gap-2 shrink-0 ml-2">
                                  <Badge variant="secondary" className="text-xs font-semibold">
                                    {count}
                                  </Badge>
                                  <ChevronRight className="w-3.5 h-3.5 text-muted-foreground" />
                                </div>
                              </button>
                            </li>
                          );
                        })}
                        {(categoryCounts["Other"] || 0) > 0 && (
                          <li>
                            <button
                              className={`w-full flex items-center justify-between px-5 py-3 text-left transition-colors hover:bg-muted/50 ${selectedCategory === "Other" ? "bg-primary/5 border-l-2 border-primary" : ""
                                }`}
                              onClick={() => {
                                setSelectedCategory(selectedCategory === "Other" ? null : "Other");
                                setSearchQuery("");
                              }}
                            >
                              <span className="text-sm font-medium">Other / General</span>
                              <div className="flex items-center gap-2">
                                <Badge variant="secondary" className="text-xs font-semibold">
                                  {categoryCounts["Other"]}
                                </Badge>
                                <ChevronRight className="w-3.5 h-3.5 text-muted-foreground" />
                              </div>
                            </button>
                          </li>
                        )}
                      </ul>
                    </CardContent>
                  </Card>
                </div>

                {/* RIGHT: Questions List */}
                <div className="space-y-4">
                  {/* Header row for filter context */}
                  {showingFiltered && (
                    <div className="flex items-center justify-between mb-2">
                      <p className="text-sm text-muted-foreground">
                        {filteredQuestions.length} question{filteredQuestions.length !== 1 ? "s" : ""}{" "}
                        {selectedCategory
                          ? `in "${CATEGORIES.find((c) => c.id === selectedCategory)?.label || selectedCategory}"`
                          : `matching "${searchQuery}"`}
                      </p>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => {
                          setSelectedCategory(null);
                          setSearchQuery("");
                        }}
                      >
                        <X className="w-4 h-4 mr-1" /> Clear filter
                      </Button>
                    </div>
                  )}

                  {!showingFiltered && (
                    <p className="text-sm text-muted-foreground mb-4">
                      Select a category from the left or search above to view specific questions.
                    </p>
                  )}

                  {/* Questions */}
                  {showingFiltered && filteredQuestions.length === 0 && (
                    <Card className="border-dashed border-border/60">
                      <CardContent className="text-center py-12 text-muted-foreground">
                        <BookOpen className="w-10 h-10 mx-auto mb-3 opacity-30" />
                        <p className="font-medium">No questions found</p>
                        <p className="text-sm mt-1">Try a different search or category</p>
                      </CardContent>
                    </Card>
                  )}

                  {showingFiltered && filteredQuestions.length > 0 &&
                    filteredQuestions.map((q, idx) => {
                      const catMeta = CATEGORIES.find((c) => c.id === q.computedCategory);
                      return (
                        <Card
                          key={q._id}
                          className="border-border/60 shadow-sm hover:shadow-md hover:border-primary/30 transition-all cursor-pointer group"
                          onClick={() => navigate(`/exam?categoryFilter=${q.computedCategory}&startId=${q._id}`)}
                        >
                          <CardContent className="p-4 flex items-start gap-4">
                            <span className="text-2xl font-bold text-muted-foreground/30 leading-none pt-0.5 w-8 shrink-0">
                              {idx + 1}
                            </span>
                            <div className="flex-1 min-w-0">
                              <p className="text-sm font-medium text-foreground/90 leading-relaxed line-clamp-3 group-hover:text-foreground transition-colors">
                                {q.text}
                              </p>
                              <div className="mt-2 flex items-center gap-2 flex-wrap">
                                {catMeta && (
                                  <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${catMeta.color}`}>
                                    {catMeta.label}
                                  </span>
                                )}
                                {q.image && (
                                  <span className="text-xs text-muted-foreground">📷 Image answer</span>
                                )}
                              </div>
                            </div>
                            <ChevronRight className="w-4 h-4 text-muted-foreground shrink-0 group-hover:text-primary group-hover:translate-x-0.5 transition-all" />
                          </CardContent>
                        </Card>
                      );
                    })}
                </div>
              </div>
            )}
          </div>
        </main>
      </div>
    </SidebarProvider>
  );
};

export default Stats;
