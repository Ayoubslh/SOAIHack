import React, { useState } from 'react';
import { Skeleton } from "../components/common/Skeleton";
import { useLanguage } from "../context/LanguageContext";
import { Download, PieChart, TrendingUp, Users } from "lucide-react";
import Card from "../components/common/Card";
import Button from "../components/common/Button";
import StatCard from "../components/dashboard/StatCard";
import TrendChart from "../components/dashboard/TrendChart";
import { useToast } from "../context/ToastContext";

const Analytics = () => {
  const [isLoading, setIsLoading] = React.useState(true);
  React.useEffect(() => {
    const timer = setTimeout(() => setIsLoading(false), 800);
    return () => clearTimeout(timer);
  }, []);

  const { t } = useLanguage();
  const { addToast } = useToast();
  const [timeFilter, setTimeFilter] = useState("This Week");

  if (isLoading) {
    return (
      <div className="p-6 space-y-6">
        <Skeleton className="h-8 w-1/4 rounded-lg" />
        <Skeleton className="h-[500px] w-full rounded-2xl" />
      </div>
    );
  }



    const chartDataWeek = [
    { name: "Mon", completed: 42, noShow: 12 },
    { name: "Tue", completed: 48, noShow: 8 },
    { name: "Wed", completed: 35, noShow: 15 },
    { name: "Thu", completed: 50, noShow: 9 },
    { name: "Fri", completed: 55, noShow: 5 },
  ];

  const chartDataMonth = [
    { name: "Wk1", completed: 150, noShow: 30 },
    { name: "Wk2", completed: 180, noShow: 25 },
    { name: "Wk3", completed: 165, noShow: 40 },
    { name: "Wk4", completed: 190, noShow: 20 },
  ];

  const chartDataYear = [
    { name: "Q1", completed: 600, noShow: 120 },
    { name: "Q2", completed: 750, noShow: 90 },
    { name: "Q3", completed: 800, noShow: 150 },
    { name: "Q4", completed: 950, noShow: 80 },
  ];

  const chartData = timeFilter === "This Year" ? chartDataYear : timeFilter === "This Month" ? chartDataMonth : chartDataWeek;

  return (
    <div>
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 gap-4">
        <div>
          <h1 className="text-3xl font-bold text-text-dark">
            Analytics & Reports
          </h1>
          <p className="text-text-muted mt-1 text-sm">
            Comprehensive breakdown of clinic performance.
          </p>
        </div>
        <Button
          variant="outline"
          icon={Download}
          onClick={() => {
            // Fake PDF export simulation
            const fakePdfContent =
              "%PDF-1.4\\n1 0 obj\\n<< /Title (Analytics Report) /Creator (DocToMe) >>\\nendobj\\n2 0 obj\\n<< /Type /Catalog /Pages 3 0 R >>\\nendobj\\n3 0 obj\\n<< /Type /Pages /Kids [4 0 R] /Count 1 >>\\nendobj\\n4 0 obj\\n<< /Type /Page /Parent 3 0 R /MediaBox [0 0 612 792] >>\\nendobj\\nxref\\n0 5\\n0000000000 65535 f \\n0000000009 00000 n \\n0000000063 00000 n \\n0000000106 00000 n \\n0000000163 00000 n \\ntrailer\\n<< /Size 5 /Root 2 0 R >>\\nstartxref\\n239\\n%%EOF";
            const blob = new Blob([fakePdfContent], {
              type: "application/pdf",
            });
            const url = URL.createObjectURL(blob);
            const a = document.createElement("a");
            a.style.display = "none";
            a.href = url;
            a.download = `analytics_report_${new Date().toISOString().split("T")[0]}.pdf`;
            document.body.appendChild(a);
            a.click();
            setTimeout(() => {
              document.body.removeChild(a);
              URL.revokeObjectURL(url);
            }, 100);
            addToast("Analytics report exported as PDF.", "success");
          }}>
          Export Report
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <StatCard
          title="Money Saved"
          value="$12,400"
          icon={TrendingUp}
          trend="+15%"
          trendLabel="from automation"
          colorClass="success"
        />
        <StatCard
          title="New Patients"
          value="48"
          icon={Users}
          trend="+4%"
          trendLabel="from last week"
          colorClass="primary"
        />
        <StatCard
          title="No-Show Rate"
          value="12.5%"
          icon={PieChart}
          trend="-2%"
          trendLabel="from last week"
          colorClass="warning"
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card className="flex flex-col min-h-[400px]">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-lg font-semibold text-text-dark">
              Appointment Trends
            </h2>
            <select value={timeFilter} onChange={(e) => setTimeFilter(e.target.value)} className="bg-bg-main border border-border-light rounded-md text-sm px-3 py-1.5 outline-none text-text-dark">
              <option>This Week</option>
              <option>This Month</option>
              <option>This Year</option>
            </select>
          </div>
          <div className="flex-grow">
            <TrendChart data={chartData} />
          </div>
        </Card>

        <Card className="flex flex-col min-h-[400px]">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-lg font-semibold text-text-dark">
              Patient Demographics
            </h2>
          </div>
          <div className="flex-grow flex items-center justify-center">
            <div className="relative w-48 h-48 rounded-full border-[24px] border-primary border-t-success border-r-warning border-l-danger flex items-center justify-center">
              <div className="text-center">
                <span className="block text-2xl font-bold text-text-dark">
                  100%
                </span>
                <span className="block text-xs text-text-muted">Total</span>
              </div>
            </div>
          </div>
          <div className="grid grid-cols-2 gap-4 mt-6 border-t border-border-light pt-6">
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded-full bg-primary"></div>
              <span className="text-sm font-medium text-text-main">
                Adults (45%)
              </span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded-full bg-success"></div>
              <span className="text-sm font-medium text-text-main">
                Seniors (30%)
              </span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded-full bg-danger"></div>
              <span className="text-sm font-medium text-text-main">
                Teens (15%)
              </span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded-full bg-warning"></div>
              <span className="text-sm font-medium text-text-main">
                Children (10%)
              </span>
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
};

export default Analytics;
