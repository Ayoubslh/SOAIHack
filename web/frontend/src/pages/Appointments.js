import React, { useState, useEffect } from 'react';
import { Skeleton } from "../components/common/Skeleton";
import { useLanguage } from "../context/LanguageContext";
import { Calendar as CalendarIcon, Clock } from "lucide-react";
import Card from "../components/common/Card";
import Button from "../components/common/Button";
import Badge from "../components/common/Badge";
import { useToast } from "../context/ToastContext";
import { useLocation } from "react-router-dom";

import { useTimeSaved } from "../context/TimeSavedContext";
import { useAuth } from "../context/AuthContext";
import { useAppointmentStore } from "../store/appointmentStore";
import axios from 'axios';

const Appointments = () => {
  const [isLoading, setIsLoading] = React.useState(true);
  React.useEffect(() => {
    const timer = setTimeout(() => setIsLoading(false), 800);
    return () => clearTimeout(timer);
  }, []);

  const { t } = useLanguage();
  const { user } = useAuth();
  const { addTimeSaved } = useTimeSaved();
  const [activeTab, setActiveTab] = useState("upcoming");
  const [currentMonth, setCurrentMonth] = useState(new Date());

  const { addToast } = useToast();
  const location = useLocation();

  const appointments = useAppointmentStore((state) => state.appointments);
  const setAppointments = useAppointmentStore((state) => state.setAppointments);

  useEffect(() => {
    const fetchAppointments = async () => {
      if (!user) {
        setIsLoading(false);
        return;
      }

      try {
        const response = await axios.get(`http://localhost:3000/appointments?user_id=${user._id || user.user_id}`);
        console.log("All Appointments:", response.data);
        setAppointments(response.data || []);
      } catch (error) {
        console.error("Error fetching appointments:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchAppointments();
  }, [user, setAppointments]);

  if (isLoading) {
    return (
      <div className="p-6 space-y-6">
        <Skeleton className="h-8 w-1/4 rounded-lg" />
        <Skeleton className="h-[500px] w-full rounded-2xl" />
      </div>
    );
  }

  const filteredAppointments = appointments.filter((app) => {
    const status = (app.status || "").toLowerCase();
    
    if (activeTab === "upcoming")
      return status !== "cancelled" && status !== "completed" && status !== "no_show";
    if (activeTab === "past") 
      return status === "completed" || status === "no_show";
    if (activeTab === "cancelled") 
      return status === "cancelled";
    return true;
  });

  const renderCalendarView = () => {
    const year = currentMonth.getFullYear();
    const month = currentMonth.getMonth();
    const daysInMonth = new Date(year, month + 1, 0).getDate();
    const firstDay = new Date(year, month, 1).getDay();

    const monthNames = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
    const monthName = monthNames[month];

    const handlePrevMonth = () => {
      setCurrentMonth(new Date(year, month - 1, 1));
    };

    const handleNextMonth = () => {
      setCurrentMonth(new Date(year, month + 1, 1));
    };

    const days = [];
    
    for (let i = 0; i < firstDay; i++) {
      days.push(<div key={`empty-${i}`} className="p-4 border border-transparent"></div>);
    }
    
    for(let i = 1; i <= daysInMonth; i++) {
       const currentDateStr = `${year}-${String(month + 1).padStart(2, '0')}-${String(i).padStart(2, '0')}`;
       
       let dayAppts = appointments.filter(app => {
         const dateVal = app.appointment_date;
         if (!dateVal) return false;
         
         if (dateVal === currentDateStr) return true;
         const todayDate = new Date();
         if ((dateVal.toLowerCase() === "today" || dateVal === t("today")) && i === todayDate.getDate() && month === todayDate.getMonth() && year === todayDate.getFullYear()) return true;
         
         const tomorrow = new Date(todayDate);
         tomorrow.setDate(tomorrow.getDate() + 1);
         if ((dateVal.toLowerCase() === "tomorrow" || dateVal === t("tomorrow")) && i === tomorrow.getDate() && month === tomorrow.getMonth() && year === tomorrow.getFullYear()) return true;
         
         return false;
       });

       const apptCount = dayAppts.length;
       
       let statusColor = "bg-success/10 text-success border-success/20"; // Free
       let statusText = "Free";
       
       if (apptCount >= 3) {
           statusColor = "bg-danger/10 text-danger border-danger/20"; // Full
           statusText = "Full";
       } else if (apptCount > 0) {
           statusColor = "bg-warning/10 text-warning-dark border-warning/30"; // Partially booked
           statusText = `${apptCount} Appt${apptCount > 1 ? 's' : ''}`;
       }

       const isTodayFlag = () => {
         const today = new Date();
         return i === today.getDate() && month === today.getMonth() && year === today.getFullYear();
       };

       days.push(
         <div key={i} className={`p-2 min-h-[100px] rounded-lg border flex flex-col items-center justify-center shadow-sm transition-all hover:shadow-md ${statusColor} ${isTodayFlag() ? 'ring-2 ring-primary ring-offset-1' : ''}`}>
            <span className="font-bold text-xl">{i}</span>
            {apptCount > 0 ? (
                <span className="text-xs font-semibold px-2 py-1 rounded-full bg-white/60 dark:bg-black/20 w-full text-center mt-2">{statusText}</span>
            ) : null}
         </div>
       );
    }

    const weekDays = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

    return (
       <div className="flex flex-col gap-4">
           <div className="flex justify-between items-center bg-surface p-4 rounded-xl shadow-sm border border-border-light">
               <Button variant="secondary" onClick={handlePrevMonth}>&larr; Prev</Button>
               <h2 className="text-xl font-bold text-text-dark">{monthName} {year}</h2>
               <Button variant="secondary" onClick={handleNextMonth}>Next &rarr;</Button>
           </div>
           
           <div className="grid grid-cols-7 gap-2 sm:gap-4 mt-4">
               {weekDays.map(day => (
                 <div key={day} className="text-center font-bold text-text-muted py-2 bg-surface rounded-md">{day}</div>
               ))}
               {days}
           </div>
       </div>
    );
  };

  return (
    <div>
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 gap-4">
        <h1 className="text-3xl font-bold text-text-dark">
          {t("appointments")}
        </h1>
      </div>

      <Card className="mb-6">
        <div className="flex flex-col sm:flex-row justify-between items-center mb-6 gap-4 border-b border-border-light pb-4">
          <div className="flex gap-6 w-full overflow-x-auto">
            {["upcoming", "past", "cancelled", "calendar view"].map((tab) => (
              <button
                key={tab}
                className={`pb-4 border-b-2 font-semibold text-sm capitalize transition-all whitespace-nowrap ${
                  activeTab === tab
                    ? "border-primary text-primary"
                    : "border-transparent text-text-muted hover:text-text-dark"
                }`}
                onClick={() => setActiveTab(tab)}>
                {tab}
              </button>
            ))}
          </div>
        </div>

        {activeTab === "calendar view" ? (
           <div className="p-4 bg-bg-main rounded-xl border border-border-light">
             <div className="flex items-center gap-4 mb-4 text-sm font-medium text-text-muted justify-end">
                <span className="flex items-center gap-2"><span className="w-3 h-3 rounded-full bg-success"></span> Available</span>
                <span className="flex items-center gap-2"><span className="w-3 h-3 rounded-full bg-warning"></span> Partially Booked</span>
                <span className="flex items-center gap-2"><span className="w-3 h-3 rounded-full bg-danger"></span> Fully Booked</span>
             </div>
             {renderCalendarView()}
           </div>
        ) : (
        <div className="space-y-4">
          {filteredAppointments.map((app) => {
            const timeStr = app.appointment_hour != null ? `${app.appointment_hour}:00` : t("n_a");
            const dateStr = app.appointment_date || t("n_a");
            const providerStr = app.clinic_name || app.specialty || "Doctome Clinic";
            const statusLabel = app.status || "scheduled";
            
            return (
            <div
              key={app._id || app.appointment_id}
              className="flex flex-col md:flex-row items-start md:items-center justify-between p-4 rounded-lg border border-border-light hover:bg-border-subtle transition-all">
              <div className="flex items-start gap-4 mb-4 md:mb-0">
                <div className="w-12 h-12 rounded-lg bg-primary-light text-primary flex items-center justify-center shrink-0">
                  <CalendarIcon size={24} />
                </div>
                <div>
                  <h3 className="font-semibold text-text-dark text-lg">
                    {app.patient_name || t("unknown_patient")}
                  </h3>
                  <div className="flex flex-wrap items-center gap-3 mt-1 text-xs text-text-muted">
                    <span className="flex items-center gap-1">
                      <Clock size={14} /> {timeStr}
                    </span>
                    <span className="w-1 h-1 rounded-full bg-border-light"></span>
                    <span>{dateStr}</span>
                    <span className="w-1 h-1 rounded-full bg-border-light"></span>
                    <span>{providerStr}</span>
                  </div>
                </div>
              </div>

              <div className="flex items-center justify-between w-full md:w-auto gap-4">
                <div className="flex gap-2 shrink-0">
                  <Badge variant="neutral">{app.payment_type || "Cash"}</Badge>
                  <Badge
                    variant={
                      statusLabel === "confirmed" || statusLabel === "completed"
                        ? "success"
                        : statusLabel === "scheduled"
                          ? "warning"
                          : "danger"
                    }>
                    {statusLabel.charAt(0).toUpperCase() + statusLabel.slice(1)}
                  </Badge>
                </div>
                <div className="flex gap-2">
                  <Button
                    variant="ghost"
                    size="sm"
                    className="text-primary hover:bg-primary/10 transition-colors"
                    onClick={() => {
                      addTimeSaved(2);
                      addToast(`Reminder sent to ${app.patient_name} (+2 min saved)`, "success");
                    }}>
                    Remind
                  </Button>
                </div>
              </div>
            </div>
            );
          })}

          {filteredAppointments.length === 0 && (
            <div className="text-center py-12">
              <div className="w-16 h-16 bg-border-subtle rounded-full flex items-center justify-center mx-auto mb-4 text-text-muted">
                <CalendarIcon size={32} />
              </div>
              <h3 className="text-lg font-semibold text-text-dark mb-1">
                No {activeTab} appointments
              </h3>
              <p className="text-text-muted text-sm">
                There are no appointments to show in this view.
              </p>
            </div>
          )}
        </div>
        )}
      </Card>
    </div>
  );
};

export default Appointments;
