export type Patient = {
  id: string;
  name: string;
  phone: string;
  email?: string;
  createdAt: string;
  status: "Active" | "Inactive";
};

export type AppointmentStatus = "Scheduled" | "Checked in" | "Completed" | "Cancelled" | "No-show";

export type Appointment = {
  id: string;
  patientId?: string;
  patientName: string;
  phone: string;
  service: string;
  date: string;
  time: string;
  durationMinutes: number;
  status: AppointmentStatus;
  createdAt: string;
};

export type Encounter = {
  id: string;
  patientId?: string;
  appointmentId?: string;
  patientName: string;
  date: string;
  presentingConcern: string;
  assessment: string;
  treatment: string;
  plan: string;
  createdAt: string;
};

export type DemoStore = {
  patients: Patient[];
  appointments: Appointment[];
  encounters: Encounter[];
};
