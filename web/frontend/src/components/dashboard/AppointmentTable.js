import React from "react";
import { useLanguage } from "../../context/LanguageContext";
import Badge from "../common/Badge";
import Button from "../common/Button";
import Card from "../common/Card";
import {
  Table,
  TableHeader,
  TableBody,
  TableRow,
  TableCell,
} from "../common/Table";
import { useAppointmentStore } from "../../store/appointmentStore";

const AppointmentTable = ({ appointments }) => {
  const { t } = useLanguage();
  const setSelectedAppointment = useAppointmentStore((state) => state.setSelectedAppointment);

  return (
    <div className="mt-6">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-lg font-semibold text-text-dark">
          {t("appointment_list")}
        </h2>
      </div>
      <Card className="overflow-hidden">
        <Table>
          <TableHeader
            columns={[
              t("th_patient"),
              t("th_date"),
              t("th_time"),
              t("th_status"),
              t("th_risk_level"),
              t("th_action"),
            ]}
          />
          <TableBody>
            {appointments.length === 0 ? (
              <TableRow>
                <TableCell colSpan={6} className="text-center py-8 text-text-muted">
                  {t("no_appointments_found")}
                </TableCell>
              </TableRow>
            ) : (
              appointments.map((apt) => (
                <TableRow key={apt._id || apt.appointment_id}>
                  <TableCell>
                    <div className="text-sm font-medium text-text-dark">
                      {apt.patient_name || t("unknown_patient")}
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="text-sm text-text-main">
                      {apt.appointment_date || t("n_a")}
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="text-sm text-text-main">
                      {apt.appointment_hour != null ? `${apt.appointment_hour}:00` : t("n_a")}
                    </div>
                  </TableCell>
                  <TableCell>
                    <Badge variant={apt.status === "cancelled" ? "danger" : apt.status === "confirmed" ? "success" : "warning"}>
                      {apt.status || t("unknown")}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <Badge
                      variant={
                        apt.risk_level === "HIGH"
                          ? "danger"
                          : apt.risk_level === "MEDIUM"
                          ? "warning"
                          : "success"
                      }>
                      {apt.risk_level || t("unknown")}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-center">
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => setSelectedAppointment(apt)}>
                      {t("view")}
                    </Button>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </Card>
    </div>
  );
};

export default AppointmentTable;
