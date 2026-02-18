import { Suspense } from 'react';
import Navbar from '@/components/layout/Navbar';
import HeroBillboard from '@/features/home/HeroBillboard';
import ContentRow from '@/features/home/ContentRow';
import { getHomeData } from '@/features/home/getHomeData';
import Skeleton, { SkeletonPoster } from '@/components/ui/Skeleton';

async function HomeContent() {
  const data = await getHomeData();

  return (
    <>
      {data.featured && <HeroBillboard featured={data.featured} />}
      <div className="space-y-2">
        {data.trendingToday.length > 0 && (
          <ContentRow
            title="Top 10 on MFLIX Today"
            items={data.trendingToday}
            showRank
          />
        )}
        {data.trendingWeek.length > 0 && (
          <ContentRow title="Trending This Week" items={data.trendingWeek} />
        )}
        {data.popularMovies.length > 0 && (
          <ContentRow title="Popular Movies" items={data.popularMovies} />
        )}
        {data.popularTv.length > 0 && (
          <ContentRow title="Popular TV Shows" items={data.popularTv} />
        )}
        {data.topRated.length > 0 && (
          <ContentRow title="Top Rated" items={data.topRated} />
        )}
        {data.nowPlaying.length > 0 && (
          <ContentRow title="Now Playing" items={data.nowPlaying} />
        )}
        {data.upcoming.length > 0 && (
          <ContentRow title="Upcoming" items={data.upcoming} />
        )}
      </div>
    </>
  );
}

function HomeSkeleton() {
  return (
    <>
      <Skeleton className="aspect-backdrop-wide min-h-[60vh] w-full" />
      <div className="space-y-8 px-4 md:px-8">
        <div>
          <Skeleton className="mb-4 h-8 w-48" />
          <div className="flex gap-3 overflow-hidden">
            {Array.from({ length: 6 }).map((_, i) => (
              <SkeletonPoster key={i} />
            ))}
          </div>
        </div>
      </div>
    </>
  );
}

export default function HomePage() {
  return (
    <main className="min-h-screen bg-mflix-black">
      <Navbar />
      <Suspense fallback={<HomeSkeleton />}>
        <HomeContent />
      </Suspense>
    </main>
  );
}
