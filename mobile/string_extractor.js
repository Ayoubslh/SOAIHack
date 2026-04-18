const fs = require('fs');
const glob = require('glob'); // Not available? I'll just hardcode paths or use process.argv

const files = [
  'app/help-center.tsx',
  'app/notifications.tsx',
  'app/privacy.tsx',
  'app/rebook.tsx',
  'components/appointments/AppointmentCard.tsx',
  'components/nudge/NudgeNotificationCard.tsx',
  'components/nudge/NudgePromptModal.tsx',
  'components/nudge/NudgeRebookCard.tsx',
  'components/profile/ProfileMenuItem.tsx',
  'components/scheduling/AppointmentSummaryCard.tsx',
  'components/scheduling/AvailabilityLegend.tsx',
  'components/scheduling/CalendarPicker.tsx',
  'components/scheduling/DoctorDropdown.tsx',
  'components/scheduling/DropdownField.tsx',
  'components/scheduling/TimeDropdown.tsx',
  'components/scheduling/VisitTypeChips.tsx',
];

const results = {};

files.forEach((f) => {
  if (!fs.existsSync(f)) return;
  const content = fs.readFileSync(f, 'utf8');
  // Match > text <
  const matches = content.match(/>([^<>{}\n]+)</g);
  if (matches) {
    results[f] = matches.map((m) => m.slice(1, -1).trim()).filter((m) => m.length > 1);
  }
});
console.log(JSON.stringify(results, null, 2));
