import type { MediaDetails } from "@/types/app";

interface DetailInfoProps {
  details: MediaDetails;
}

export function DetailInfo({ details }: DetailInfoProps) {
  const directors = details.crew.filter((c) => c.job === "Director");
  const writers = details.crew.filter(
    (c) => c.job === "Writer" || c.job === "Screenplay"
  );
  const producers = details.crew.filter((c) => c.job === "Producer").slice(0, 3);

  return (
    <section className="px-4 md:px-12 py-8">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl">
        <div className="space-y-4">
          <h2 className="text-xl font-bold text-white">About {details.title}</h2>
          <p className="text-sm text-mflix-gray-200 leading-relaxed">
            {details.overview}
          </p>
        </div>

        <div className="space-y-3 text-sm">
          {directors.length > 0 && (
            <div>
              <span className="text-mflix-gray-400">Director: </span>
              <span className="text-white">
                {directors.map((d) => d.name).join(", ")}
              </span>
            </div>
          )}

          {details.createdBy && details.createdBy.length > 0 && (
            <div>
              <span className="text-mflix-gray-400">Created by: </span>
              <span className="text-white">{details.createdBy.join(", ")}</span>
            </div>
          )}

          {writers.length > 0 && (
            <div>
              <span className="text-mflix-gray-400">Writers: </span>
              <span className="text-white">
                {writers.map((w) => w.name).join(", ")}
              </span>
            </div>
          )}

          {producers.length > 0 && (
            <div>
              <span className="text-mflix-gray-400">Producers: </span>
              <span className="text-white">
                {producers.map((p) => p.name).join(", ")}
              </span>
            </div>
          )}

          <div>
            <span className="text-mflix-gray-400">Cast: </span>
            <span className="text-white">
              {details.cast
                .slice(0, 5)
                .map((c) => c.name)
                .join(", ")}
            </span>
          </div>

          <div>
            <span className="text-mflix-gray-400">Genres: </span>
            <span className="text-white">
              {details.genres.map((g) => g.name).join(", ")}
            </span>
          </div>

          {details.spokenLanguages.length > 0 && (
            <div>
              <span className="text-mflix-gray-400">Languages: </span>
              <span className="text-white">
                {details.spokenLanguages.join(", ")}
              </span>
            </div>
          )}

          <div>
            <span className="text-mflix-gray-400">Status: </span>
            <span className="text-white">{details.status}</span>
          </div>
        </div>
      </div>
    </section>
  );
}
