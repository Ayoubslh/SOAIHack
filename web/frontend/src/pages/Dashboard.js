import React, { useState, useEffect } from "react";
import axios from "axios";
import { useLanguage } from "../context/LanguageContext";
import { useAuth } from "../context/AuthContext";
import { Link } from "react-router-dom";
import {
  Calendar,
  AlertCircle,
  UserCheck,
  TrendingUp,
  CloudRain,
} from "lucide-react";

import StatCard from "../components/dashboard/StatCard";
import RiskTable from "../components/dashboard/RiskTable";
import InsightCard from "../components/dashboard/InsightCard";
import TrendChart from "../components/dashboard/TrendChart";
import AppointmentTable from "../components/dashboard/AppointmentTable";
import Card from "../components/common/Card";
import { Skeleton } from "../components/common/Skeleton";
import { useAppointmentStore } from "../store/appointmentStore";

const api = "http://localhost:3000";

const Dashboard = () => {
  const { t } = useLanguage();
  const { user } = useAuth();
  const appointments = useAppointmentStore((state) => state.appointments);
  const setAppointments = useAppointmentStore((state) => state.setAppointments);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchAppointments = async () => {
      if (!user) {
        setIsLoading(false);
        return;
      }

      try {
        const params = {
          user_id: user._id || user.user_id,
        };

        if (user.role) {
          params.role = user.role;
        }

        const response = await axios.get(`${api}/appointments`, { params });
        console.log("All Appointments Dashboard:", response.data);
        setAppointments(response.data || []);
      } catch (error) {
        console.error("Appointment list fetch error:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchAppointments();
  }, [user, setAppointments]);
  const chartData = [
    { name: t("mon"), completed: 42, noShow: 12 },
    { name: t("tue"), completed: 48, noShow: 8 },
    { name: t("wed"), completed: 35, noShow: 15 },
    { name: t("thu"), completed: 50, noShow: 9 },
    { name: t("fri"), completed: 55, noShow: 5 },
  ];

  const todayString = new Date().toISOString().split("T")[0];
  const yesterdayString = new Date(Date.now() - 86400000).toISOString().split("T")[0];

  const todayAppointments = appointments.filter(
    (apt) => apt.appointment_date === todayString
  );
  const yesterdayAppointments = appointments.filter(
    (apt) => apt.appointment_date === yesterdayString
  );
  const uniqueActivePatients = new Set(
    appointments.map((apt) => apt.patient_name || apt.patient_id)
  ).size;

  const stats = {
    today: {
      total: todayAppointments.length,
      no_shows: todayAppointments.filter(
        (apt) => apt.status === "no_show" || apt.risk_level === "HIGH"
      ).length,
      confirmed: todayAppointments.filter((apt) => apt.status === "confirmed").length,
    },
    yesterday: {
      total: yesterdayAppointments.length,
      no_shows: yesterdayAppointments.filter(
        (apt) => apt.status === "no_show" || apt.risk_level === "HIGH"
      ).length,
      confirmed: yesterdayAppointments.filter((apt) => apt.status === "confirmed").length,
    },
  };

  const calcTrend = (today, yesterday) => {
    if (today == null || yesterday == null) return "0";
    const diff = today - yesterday;
    return diff > 0 ? `+${diff}` : diff.toString();
  };

  const getRiskStatus = (apt) => {
    if (apt.risk_level) return apt.risk_level.toLowerCase();
    if (typeof apt.no_show_probability === "number") {
      if (apt.no_show_probability >= 70) return "high";
      if (apt.no_show_probability >= 40) return "medium";
    }
    return "low";
  };

  const riskRows = appointments.slice(0, 5).map((apt) => ({
    id: apt._id || apt.appointment_id,
    name: apt.patient_name || t("unknown_patient"),
    demo: (apt.age) ? `${apt.age} yrs` : apt.clinic_name || apt.specialty || t("unknown"),
    time:
      apt.appointment_hour != null
        ? `${apt.appointment_date} ${apt.appointment_hour}:00`
        : apt.appointment_date || t("n_a"),
    factors: apt.top_risk_drivers?.length
      ? apt.top_risk_drivers
      : [getRiskStatus(apt)],
    notes: apt.notes || t("no_notes"),
    prob:
      typeof apt.no_show_probability === "number"
        ? apt.no_show_probability
        : Math.round(apt.risk_score || 0) || 5, // fallback if missing
    status: getRiskStatus(apt),
  }));

  return (
    <div>
      <h1 className="text-3xl font-bold text-text-dark mb-6">
        {t("overview")}
      </h1>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {isLoading ? (
          <>
            <Skeleton className="h-32 w-full" />
            <Skeleton className="h-32 w-full" />
            <Skeleton className="h-32 w-full" />
            <Skeleton className="h-32 w-full" />
          </>
        ) : (
          <>
            <StatCard
              title={t("total_appointments")}
              value={stats.today.total.toString() || "0"}
              icon={Calendar}
              trend={calcTrend(stats.today.total, stats.yesterday.total)}
              trendLabel={t("from_yesterday")}
              colorClass="primary"
            />
            <StatCard
              title={t("predicted_no_shows")}
              value={stats.today.no_shows.toString() || "0"}
              icon={AlertCircle}
              trend={calcTrend(stats.today.no_shows, stats.yesterday.no_shows)}
              trendLabel={t("from_yesterday")}
              colorClass="danger"
            />
            <StatCard
              title={t("confirmed_visits")}
              value={stats.today.confirmed.toString() || "0"}
              icon={UserCheck}
              trend={calcTrend(stats.today.confirmed, stats.yesterday.confirmed)}
              trendLabel={t("from_yesterday")}
              colorClass="success"
            />
            <StatCard
              title={t("active_patients")}
              value={uniqueActivePatients.toString() || "0"}
              icon={TrendingUp}
              trend={"+0"}
              trendLabel={t("this_week")}
              colorClass="info"
            />
          </>
        )}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Risk Assessment Table */}
        <Card className="lg:col-span-2">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-lg font-semibold text-text-dark">
              {t("upcoming_risk_assessment") || "Upcoming Risk Assessment"}
            </h2>
            <Link
              to="/appointments"
              className="text-primary text-sm font-medium hover:underline transition-colors hover:text-[#0284c7]">
              {t("view_full_schedule")}
            </Link>
          </div>
          {isLoading ? (
            <div className="space-y-4">
              <Skeleton className="h-10 w-full" />
              <Skeleton className="h-10 w-full" />
              <Skeleton className="h-10 w-full" />
              <Skeleton className="h-10 w-full" />
              <Skeleton className="h-10 w-full" />
            </div>
          ) : (
            <RiskTable patients={riskRows} />
          )}
        </Card>

        {/* Right Sidebar: Insights & Analytics */}
        <div className="space-y-6">
          {/* Insights Panel */}
          <Card>
            <div className="mb-4">
              <h2 className="text-lg font-semibold text-text-dark">
                {t("active_insights")}
              </h2>
            </div>
            {isLoading ? (
              <div className="space-y-4">
                <Skeleton className="h-20 w-full" />
                <Skeleton className="h-20 w-full" />
              </div>
            ) : (
              <>
                <InsightCard
                  title={t("history_alert")}
                  description="3 patients have missed &ge;2 appointments. Consider overbooking double slots."
                  icon={HistoryIcon}
                  type="history"
                />
                <InsightCard
                  title={t("weather_impact")}
                  description={t("weather_desc")}
                  icon={CloudRain}
                  type="weather"
                />
              </>
            )}
          </Card>

          {/* Chart Panel */}
          <Card className="flex flex-col min-h-[300px]">
            <div className="mb-2">
              <h2 className="text-lg font-semibold text-text-dark">
                {t("weekly_trend")}
              </h2>
            </div>
            {isLoading ? (
              <Skeleton className="h-48 w-full mt-4" />
            ) : (
              <TrendChart data={chartData} />
            )}
          </Card>
        </div>
      </div>

      <AppointmentTable appointments={appointments} />
    </div>
  );
};

const HistoryIcon = ({ size }) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round">
    <path d="M3 12a9 9 0 1 0 9-9 9.75 9.75 0 0 0-6.74 2.74L3 8" />
    <path d="M3 3v5h5" />
    <path d="M12 7v5l4 2" />
  </svg>
);

export default Dashboard;
