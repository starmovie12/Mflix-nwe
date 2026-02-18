import Link from "next/link";

const FOOTER_LINKS = [
  { href: "#", label: "Audio Description" },
  { href: "#", label: "Help Center" },
  { href: "#", label: "Gift Cards" },
  { href: "#", label: "Media Center" },
  { href: "#", label: "Investor Relations" },
  { href: "#", label: "Jobs" },
  { href: "#", label: "Terms of Use" },
  { href: "#", label: "Privacy" },
  { href: "#", label: "Legal Notices" },
  { href: "#", label: "Cookie Preferences" },
  { href: "#", label: "Corporate Information" },
  { href: "#", label: "Contact Us" },
];

export function Footer() {
  return (
    <footer className="mt-20 pb-8 px-4 md:px-12 text-mflix-gray-400 text-sm">
      <div className="max-w-6xl mx-auto">
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3 mb-6">
          {FOOTER_LINKS.map((link) => (
            <Link
              key={link.label}
              href={link.href}
              className="hover:text-mflix-gray-200 underline underline-offset-2 transition-colors"
            >
              {link.label}
            </Link>
          ))}
        </div>
        <p className="text-xs text-mflix-gray-500">
          &copy; {new Date().getFullYear()} MFLIX. Data provided by{" "}
          <a
            href="https://www.themoviedb.org"
            target="_blank"
            rel="noopener noreferrer"
            className="underline hover:text-mflix-gray-300"
          >
            TMDB
          </a>
          . This product uses the TMDB API but is not endorsed or certified by TMDB.
        </p>
      </div>
    </footer>
  );
}
