import React, { useState } from "react";
import { useLanguage } from "../../context/LanguageContext";
import Badge from "../common/Badge";
import Button from "../common/Button";
import {
  Table,
  TableHeader,
  TableBody,
  TableRow,
  TableCell,
} from "../common/Table";
import Modal from "../common/Modal";
import { useNavigate } from "react-router-dom";

const RiskTable = ({ patients }) => {
  const { t } = useLanguage();
  const navigate = useNavigate();
  const [selectedPatient, setSelectedPatient] = useState(null);

  const closeDetailModal = () => setSelectedPatient(null);

  return (
    <>
      <Table>
        <TableHeader
          columns={[
            t("th_patient"),
            t("th_time"),
            t("th_risk_factors"),
            t("th_prob"),
            t("th_action"),
          ]}
        />
        <TableBody>
          {patients.map((p) => (
            <TableRow key={p.id}>
              <TableCell>
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-border-subtle flex items-center justify-center font-semibold text-primary text-sm shrink-0">
                    {p.name
                      .split(" ")
                      .map((n) => n[0])
                      .join("")}
                  </div>
                  <div className="flex flex-col">
                    <span className="font-semibold text-text-dark whitespace-nowrap">
                      {p.name}
                    </span>
                    <span className="text-[10px] text-text-muted">
                      {p.demo}
                    </span>
                  </div>
                </div>
              </TableCell>
              <TableCell>
                <span className="text-sm font-medium text-text-main whitespace-nowrap">
                  {p.time}
                </span>
              </TableCell>
              <TableCell>
                <div className="flex gap-2 flex-wrap min-w-[150px]">
                  {p.factors.map((f) => (
                    <span
                      className="text-[9px] px-2 py-0.5 rounded-full bg-border-subtle text-text-muted font-medium uppercase tracking-tighter"
                      key={f}>
                      {f}
                    </span>
                  ))}
                </div>
              </TableCell>
              <TableCell>
                <Badge
                  variant={
                    p.status === "high"
                      ? "danger"
                      : p.status === "medium"
                        ? "warning"
                        : "success"
                  }>
                  {p.prob}%
                </Badge>
              </TableCell>
              <TableCell className="text-center align-middle">
                <div className="flex gap-2 justify-center items-center">
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => setSelectedPatient(p)}>
                    Details
                  </Button>
                </div>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>

      <Modal
        isOpen={Boolean(selectedPatient)}
        onClose={closeDetailModal}
        title={
          selectedPatient
            ? `${selectedPatient.name} Details`
            : "Patient Details"
        }
        maxWidthClassName="max-w-2xl"
        footer={
          <>
            <Button variant="ghost" onClick={closeDetailModal}>
              Close
            </Button>
            <Button
              variant="primary"
              onClick={() => {
                if (!selectedPatient) return;
                closeDetailModal();
                navigate("/patients", {
                  state: { editPatient: selectedPatient.id },
                });
              }}>
              Edit Details
            </Button>
          </>
        }>
        {selectedPatient && (
          <div className="space-y-6">
            <div className="flex items-start justify-between gap-4">
              <div>
                <h4 className="text-2xl font-bold text-text-dark">
                  {selectedPatient.name}
                </h4>
                <p className="text-sm text-text-muted mt-1">
                  {t("appointment_at")} {selectedPatient.time}
                </p>
              </div>
              <Badge
                variant={
                  selectedPatient.status === "high"
                    ? "danger"
                    : selectedPatient.status === "medium"
                      ? "warning"
                      : "success"
                }>
                {selectedPatient.prob}% {t("no_show_risk")}
              </Badge>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="rounded-lg border border-border-light p-4 bg-bg-main/40">
                <p className="text-[10px] uppercase tracking-wider text-text-muted mb-1">
                  {t("demographics")}
                </p>
                <p className="text-sm font-semibold text-text-dark">
                  {selectedPatient.demo}
                </p>
              </div>
              <div className="rounded-lg border border-border-light p-4 bg-bg-main/40">
                <p className="text-[10px] uppercase tracking-wider text-text-muted mb-1">
                  {t("primary_risk")}
                </p>
                <p className="text-sm font-semibold text-text-dark">
                  {t(selectedPatient.status).toUpperCase()}
                </p>
              </div>
            </div>

            <div className="space-y-3">
              <p className="text-sm font-semibold text-text-dark">
                Risk Factors
              </p>
              <div className="flex flex-wrap gap-2">
                {selectedPatient.factors.map((factor) => (
                  <span
                    key={factor}
                    className="px-3 py-1 rounded-full bg-border-subtle text-text-muted text-xs font-semibold uppercase tracking-wide">
                    {factor}
                  </span>
                ))}
              </div>
            </div>

            <div className="space-y-2">
              <p className="text-sm font-semibold text-text-dark">Notes</p>
              <p className="text-sm leading-6 text-text-muted bg-bg-main/50 border border-border-light rounded-lg p-4">
                {selectedPatient.notes}
              </p>
            </div>
          </div>
        )}
      </Modal>
    </>
  );
};

export default RiskTable;








