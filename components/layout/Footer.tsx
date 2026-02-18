import { Container } from "@/components/ui/Container";

export function Footer() {
  return (
    <footer className="border-t border-white/10 py-10">
      <Container className="flex flex-col gap-2 text-sm text-white/55">
        <p className="font-medium text-white/70">MFLIX</p>
        <p>
          Demo OTT UI powered by TMDB. This product uses the TMDB API but is not endorsed or
          certified by TMDB.
        </p>
      </Container>
    </footer>
  );
}

