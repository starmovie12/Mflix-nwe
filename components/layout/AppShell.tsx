import { Footer } from "@/components/layout/Footer";
import { Header } from "@/components/layout/Header";

export function AppShell({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-dvh bg-radial-hero">
      <Header />
      <main className="min-h-[calc(100dvh-72px)]">{children}</main>
      <Footer />
    </div>
  );
}

