import { useState, useEffect } from "react";
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import AppSidebar from "@/components/AppSidebar";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from "recharts";
import { apiGet } from "@/lib/api";
import { useToast } from "@/hooks/use-toast";

interface PerformanceData {
  name: string;
  correct: number;
  incorrect: number;
}

interface CategoryData {
  name: string;
  value: number;
  color: string;
}

const Stats = () => {
  const [performanceData, setPerformanceData] = useState<PerformanceData[]>([]);
  const [categoryData, setCategoryData] = useState<CategoryData[]>([]);
  const [summary, setSummary] = useState({
    totalQuestionsAnswered: 0,
    accuracyRate: 0,
    studyTimeHours: 0,
  });
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  const colors = [
    "hsl(222, 78%, 46%)",
    "hsl(222, 45%, 65%)",
    "hsl(220, 13%, 65%)",
    "hsl(220, 13%, 85%)",
    "hsl(222, 50%, 50%)",
  ];

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const [summaryRes, performanceRes, categoryRes] = await Promise.all([
          apiGet<{
            totalQuestionsAnswered: number;
            accuracyRate: number;
            studyTimeHours: number;
          }>("/stats/summary"),
          apiGet<{ performance: PerformanceData[] }>("/stats/performance?weeks=4"),
          apiGet<{ categories: Array<{ name: string; value: number }> }>("/stats/category"),
        ]);

        if (summaryRes.success && summaryRes.data) {
          setSummary(summaryRes.data);
        }

        if (performanceRes.success && performanceRes.data) {
          setPerformanceData(performanceRes.data.performance);
        }

        if (categoryRes.success && categoryRes.data) {
          setCategoryData(
            categoryRes.data.categories.map((cat, index) => ({
              name: cat.name,
              value: cat.value,
              color: colors[index % colors.length],
            }))
          );
        }
      } catch (error: any) {
        toast({
          title: "Error",
          description: error.message || "Failed to load statistics",
          variant: "destructive",
        });
      } finally {
        setLoading(false);
      }
    };

    fetchStats();
  }, [toast]);

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
          
          <div className="p-8">
            <h1 className="text-3xl font-bold mb-8">Statistics</h1>

            {loading ? (
              <p className="text-muted-foreground">Loading statistics...</p>
            ) : (
              <>
                <div className="grid lg:grid-cols-2 gap-6 mb-6">
                  <Card>
                    <CardHeader>
                      <CardTitle>Performance Over Time</CardTitle>
                    </CardHeader>
                    <CardContent>
                      {performanceData.length > 0 ? (
                        <ResponsiveContainer width="100%" height={300}>
                          <BarChart data={performanceData}>
                            <CartesianGrid strokeDasharray="3 3" />
                            <XAxis dataKey="name" />
                            <YAxis />
                            <Tooltip />
                            <Bar dataKey="correct" fill="hsl(222, 78%, 46%)" name="Correct" />
                            <Bar dataKey="incorrect" fill="hsl(0, 84%, 60%)" name="Incorrect" />
                          </BarChart>
                        </ResponsiveContainer>
                      ) : (
                        <p className="text-muted-foreground text-center py-20">No performance data yet</p>
                      )}
                    </CardContent>
                  </Card>

                  <Card>
                    <CardHeader>
                      <CardTitle>Questions by Category</CardTitle>
                    </CardHeader>
                    <CardContent className="flex justify-center">
                      {categoryData.length > 0 ? (
                        <ResponsiveContainer width="100%" height={300}>
                          <PieChart>
                            <Pie
                              data={categoryData}
                              cx="50%"
                              cy="50%"
                              labelLine={false}
                              label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                              outerRadius={100}
                              fill="#8884d8"
                              dataKey="value"
                            >
                              {categoryData.map((entry, index) => (
                                <Cell key={`cell-${index}`} fill={entry.color} />
                              ))}
                            </Pie>
                            <Tooltip />
                          </PieChart>
                        </ResponsiveContainer>
                      ) : (
                        <p className="text-muted-foreground text-center py-20">No category data yet</p>
                      )}
                    </CardContent>
                  </Card>
                </div>

                <div className="grid md:grid-cols-3 gap-6">
                  <Card>
                    <CardHeader>
                      <CardTitle>Total Questions</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <p className="text-4xl font-bold text-primary">{summary.totalQuestionsAnswered}</p>
                    </CardContent>
                  </Card>

                  <Card>
                    <CardHeader>
                      <CardTitle>Accuracy Rate</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <p className="text-4xl font-bold text-primary">{summary.accuracyRate}%</p>
                    </CardContent>
                  </Card>

                  <Card>
                    <CardHeader>
                      <CardTitle>Study Time</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <p className="text-4xl font-bold text-primary">{summary.studyTimeHours}h</p>
                    </CardContent>
                  </Card>
                </div>
              </>
            )}
          </div>
        </main>
      </div>
    </SidebarProvider>
  );
};

export default Stats;
