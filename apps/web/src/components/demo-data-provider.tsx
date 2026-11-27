"use client";

import { createContext, useCallback, useContext, useEffect, useMemo, useState } from "react";
import type { Appointment, DemoStore, Encounter, Patient } from "@/lib/demo-types";
import { bookDemoAppointment, recordDemoEncounter, registerDemoPatient } from "@/lib/demo-workflows.mjs";

const STORAGE_KEY = "physiong.clinic-demo.v1";

function dateKey(offsetDays = 0) {
  const partsToday = new Intl.DateTimeFormat("en-CA", { timeZone: "Asia/Kolkata", year: "numeric", month: "2-digit", day: "2-digit" }).formatToParts(new Date());
  const today = Object.fromEntries(partsToday.map((part) => [part.type, part.value]));
  const date = new Date(Date.UTC(Number(today.year), Number(today.month) - 1, Number(today.day) + offsetDays, 12));
  const parts = new Intl.DateTimeFormat("en-CA", { timeZone: "Asia/Kolkata", year: "numeric", month: "2-digit", day: "2-digit" }).formatToParts(date);
  const values = Object.fromEntries(parts.map((part) => [part.type, part.value]));
  return `${values.year}-${values.month}-${values.day}`;
}

function createSeed(): DemoStore {
  const today = dateKey();
  const tomorrow = dateKey(1);
  const createdAt = new Date().toISOString();
  const patients: Patient[] = [
    { id: "demo-patient-1", name: "Ananya Sharma", phone: "+91 98••• 4102", createdAt, status: "Active" },
    { id: "demo-patient-2", name: "Kabir Mehra", phone: "+91 98••• 7314", createdAt, status: "Active" },
    { id: "demo-patient-3", name: "Sara Khan", phone: "+91 98••• 2865", createdAt, status: "Active" },
  ];
  return {
    patients,
    appointments: [
      { id: "demo-appointment-1", patientId: patients[0].id, patientName: patients[0].name, phone: patients[0].phone, service: "Initial assessment", date: today, time: "09:30", durationMinutes: 45, status: "Checked in", createdAt },
      { id: "demo-appointment-2", patientId: patients[1].id, patientName: patients[1].name, phone: patients[1].phone, service: "Manual therapy", date: today, time: "11:00", durationMinutes: 45, status: "Scheduled", createdAt },
      { id: "demo-appointment-3", patientId: patients[2].id, patientName: patients[2].name, phone: patients[2].phone, service: "Rehabilitation session", date: today, time: "14:00", durationMinutes: 45, status: "Scheduled", createdAt },
      { id: "demo-appointment-4", patientId: patients[0].id, patientName: patients[0].name, phone: patients[0].phone, service: "Follow-up", date: tomorrow, time: "10:00", durationMinutes: 45, status: "Scheduled", createdAt },
    ],
    encounters: [
      { id: "demo-encounter-1", patientName: patients[0].name, date: today, presentingConcern: "Demo record — no clinical details", assessment: "Sample assessment for interface preview", treatment: "Sample treatment entry", plan: "Sample follow-up plan", createdAt },
    ],
  };
}

type AddPatientInput = Pick<Patient, "name" | "phone" | "email">;
type BookInput = Pick<Appointment, "patientName" | "phone" | "service" | "date" | "time">;
type AddEncounterInput = Omit<Encounter, "id" | "createdAt" | "patientName"> & { patientId: string };

type DemoContextValue = DemoStore & {
  ready: boolean;
  addPatient: (input: AddPatientInput) => { patient: Patient; created: boolean };
  bookAppointment: (input: BookInput) => { ok: boolean; appointment?: Appointment; message?: string };
  addEncounter: (input: AddEncounterInput) => { ok: boolean; message?: string; encounter?: Encounter };
  updateAppointmentStatus: (id: string, status: Appointment["status"]) => void;
  resetDemo: () => void;
};

const DemoContext = createContext<DemoContextValue | null>(null);

export function DemoDataProvider({ children }: Readonly<{ children: React.ReactNode }>) {
  const [store, setStore] = useState<DemoStore>({ patients: [], appointments: [], encounters: [] });
  const [ready, setReady] = useState(false);

  useEffect(() => {
    let next: DemoStore | undefined;
    try {
      const raw = window.localStorage.getItem(STORAGE_KEY);
      if (raw) {
        const parsed = JSON.parse(raw) as DemoStore;
        if (Array.isArray(parsed.patients) && Array.isArray(parsed.appointments) && Array.isArray(parsed.encounters)) next = parsed;
      }
    } catch {
      try { window.localStorage.removeItem(STORAGE_KEY); } catch { /* Storage may be disabled in this browser. */ }
    }
    // Client storage must be read after hydration; the UI shows a loading state until it is ready.
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setStore(next ?? createSeed());
    setReady(true);
  }, []);

  useEffect(() => {
    if (ready) {
      try { window.localStorage.setItem(STORAGE_KEY, JSON.stringify(store)); } catch { /* Demo storage is optional and may be full or disabled. */ }
    }
  }, [ready, store]);

  const addPatient = useCallback((input: AddPatientInput) => {
    const result = registerDemoPatient(store, input);
    if (result.created) setStore(result.store as DemoStore);
    return { patient: result.patient as Patient, created: result.created };
  }, [store]);

  const bookAppointment = useCallback((input: BookInput) => {
    const result = bookDemoAppointment(store, input);
    if (!result.ok) return result;
    setStore(result.store as DemoStore);
    return { ok: true, appointment: result.appointment as Appointment };
  }, [store]);

  const addEncounter = useCallback((input: AddEncounterInput) => {
    const result = recordDemoEncounter(store, input);
    if (!result.ok) return result;
    setStore(result.store as DemoStore);
    return { ok: true, encounter: result.encounter as Encounter };
  }, [store]);

  const updateAppointmentStatus = useCallback((id: string, status: Appointment["status"]) => {
    setStore((current) => ({ ...current, appointments: current.appointments.map((a) => a.id === id ? { ...a, status } : a) }));
  }, []);

  const resetDemo = useCallback(() => {
    const next = createSeed();
    setStore(next);
    try { window.localStorage.setItem(STORAGE_KEY, JSON.stringify(next)); } catch { /* Reset still updates the current session if storage is unavailable. */ }
  }, []);

  const value = useMemo(() => ({ ...store, ready, addPatient, bookAppointment, addEncounter, updateAppointmentStatus, resetDemo }), [store, ready, addPatient, bookAppointment, addEncounter, updateAppointmentStatus, resetDemo]);
  return <DemoContext.Provider value={value}>{children}</DemoContext.Provider>;
}

export function useDemoData() {
  const context = useContext(DemoContext);
  if (!context) throw new Error("useDemoData must be used inside DemoDataProvider");
  return context;
}

export { dateKey };
