import { ClinicFrame } from "@/components/clinic-frame";

export default function ClinicLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return <ClinicFrame>{children}</ClinicFrame>;
}
