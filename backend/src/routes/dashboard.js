const router = require('express').Router();
const Appointment = require('../models/Appointment');
const User = require('../models/User');
const { authenticate } = require('../middleware/auth');

function toDateStr(d) {
  return d.toISOString().split('T')[0];
}

// ── GET /dashboard/appointments ───────────────────────────────────────────────
router.get('/appointments', authenticate, async (req, res) => {
  try {
    const now = new Date();
    const today = toDateStr(now);
    const yesterday = toDateStr(new Date(now - 86400000));
    const weekAgo = toDateStr(new Date(now - 6 * 86400000));

    const [todayApts, yesterdayApts, weeklyApts] = await Promise.all([
      Appointment.find({ appointment_date: today }).lean(),
      Appointment.find({ appointment_date: yesterday }).lean(),
      Appointment.find({ appointment_date: { $gte: weekAgo, $lte: today } }).lean(),
    ]);

    const totalToday = todayApts.length;
    const totalYesterday = yesterdayApts.length;
    const aptPctChange =
      totalYesterday > 0
        ? Math.round(((totalToday - totalYesterday) / totalYesterday) * 100)
        : null;

    const predictedNoShows = todayApts.filter((a) => a.risk_level === 'HIGH').length;
    const ystNoShows = yesterdayApts.filter((a) => a.risk_level === 'HIGH').length;
    const noShowPctChange =
      ystNoShows > 0
        ? Math.round(((predictedNoShows - ystNoShows) / ystNoShows) * 100)
        : null;

    const lowRisk = todayApts.filter((a) => a.risk_level === 'LOW').length;
    const mediumRisk = todayApts.filter((a) => a.risk_level === 'MEDIUM').length;
    const highRisk = todayApts.filter((a) => a.risk_level === 'HIGH').length;
    const expectedShows = totalToday - predictedNoShows;
    const clinicEfficiency = totalToday > 0 ? Math.round((expectedShows / totalToday) * 100) : 100;

    // Weekly graph (last 7 days)
    const dayNames = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
    const weekMap = {};
    for (let d = 6; d >= 0; d--) {
      const dt = toDateStr(new Date(now - d * 86400000));
      weekMap[dt] = { date: dt, day: dayNames[new Date(dt).getDay()], count: 0, high: 0 };
    }
    for (const a of weeklyApts) {
      if (weekMap[a.appointment_date]) {
        weekMap[a.appointment_date].count++;
        if (a.risk_level === 'HIGH') weekMap[a.appointment_date].high++;
      }
    }

    const riskDist = [
      { level: 'LOW', count: lowRisk, pct: totalToday > 0 ? Math.round((lowRisk / totalToday) * 100) : 0 },
      { level: 'MEDIUM', count: mediumRisk, pct: totalToday > 0 ? Math.round((mediumRisk / totalToday) * 100) : 0 },
      { level: 'HIGH', count: highRisk, pct: totalToday > 0 ? Math.round((highRisk / totalToday) * 100) : 0 },
    ];

    return res.json({
      kpis: {
        total_today: { value: totalToday, pct_change: aptPctChange },
        predicted_no_shows: { value: predictedNoShows, pct_change: noShowPctChange },
        clinic_efficiency_pct: clinicEfficiency,
      },
      risk_distribution: riskDist,
      weekly_chart: Object.values(weekMap),
      todays_appointments: todayApts,
    });
  } catch (err) {
    return res.status(500).json({ message: err.message });
  }
});

// ── GET /dashboard/patients ───────────────────────────────────────────────────
router.get('/patients', authenticate, async (req, res) => {
  try {
    const now = new Date();
    const today = toDateStr(now);
    const weekAgo = toDateStr(new Date(now - 6 * 86400000));
    const twoWeeksAgo = toDateStr(new Date(now - 13 * 86400000));

    const [newThisWeek, newLastWeek, allPatients, weeklyApts] = await Promise.all([
      User.find({ type: 'patient', active: { $ne: false }, created_at: { $gte: new Date(weekAgo) } }, { password: 0 }).lean(),
      User.find({ type: 'patient', active: { $ne: false }, created_at: { $gte: new Date(twoWeeksAgo), $lt: new Date(weekAgo) } }, { password: 0 }).lean(),
      User.find({ type: 'patient', active: { $ne: false } }, { password: 0 }).lean(),
      Appointment.find({ appointment_date: { $gte: weekAgo, $lte: today } }).lean(),
    ]);

    const newPatientsThisWeek = newThisWeek.length;
    const newPatientsLastWeek = newLastWeek.length;
    const newPatientsPctChange =
      newPatientsLastWeek > 0
        ? Math.round(((newPatientsThisWeek - newPatientsLastWeek) / newPatientsLastWeek) * 100)
        : null;

    const groups = { children: 0, teens: 0, adults: 0, seniors: 0 };
    for (const p of allPatients) {
      const age = Number(p.age) || 0;
      if (age < 13) groups.children++;
      else if (age < 18) groups.teens++;
      else if (age < 65) groups.adults++;
      else groups.seniors++;
    }
    const total = allPatients.length;
    const pct = (n) => (total > 0 ? Math.round((n / total) * 100) : 0);

    // Appointments by speciality (weekly)
    const specMap = {};
    for (const a of weeklyApts) {
      const s = a.specialty || 'Unknown';
      specMap[s] = (specMap[s] || 0) + 1;
    }

    return res.json({
      kpis: {
        new_patients_this_week: { value: newPatientsThisWeek, pct_change: newPatientsPctChange },
        total_patients: total,
      },
      age_distribution: [
        { group: 'Children', label: '0–12', count: groups.children, pct: pct(groups.children) },
        { group: 'Teens', label: '13–17', count: groups.teens, pct: pct(groups.teens) },
        { group: 'Adults', label: '18–64', count: groups.adults, pct: pct(groups.adults) },
        { group: 'Seniors', label: '65+', count: groups.seniors, pct: pct(groups.seniors) },
      ],
      speciality_breakdown: Object.entries(specMap).map(([specialty, count]) => ({ specialty, count })),
      new_patients_this_week: newThisWeek,
    });
  } catch (err) {
    return res.status(500).json({ message: err.message });
  }
});

module.exports = router;
