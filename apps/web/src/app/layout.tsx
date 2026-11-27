import type { Metadata } from "next";
import { DemoDataProvider } from "@/components/demo-data-provider";
import "./globals.css";

export const metadata: Metadata = {
  metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000"),
  title: {
    default: "PhysioNG | Physiotherapy, Next Generation",
    template: "%s | PhysioNG",
  },
  description:
    "Patient-centred physiotherapy and rehabilitation at CRIBS Hospital, Jasola, New Delhi, led by Dr. Khushnoor Alam PT.",
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en">
      <body>
        <DemoDataProvider>{children}</DemoDataProvider>
      </body>
    </html>
  );
}
