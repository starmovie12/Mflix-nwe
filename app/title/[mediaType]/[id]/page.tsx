import { notFound } from 'next/navigation';
import type { Metadata } from 'next';
import Navbar from '@/components/layout/Navbar';
import TitleDetailContent from '@/features/title/TitleDetailContent';
import { getTitleData } from '@/features/title/getTitleData';
import { getBackdropUrl } from '@/lib/tmdb/image';

interface TitlePageProps {
  params: Promise<{ mediaType: string; id: string }>;
}

export async function generateMetadata({
  params,
}: TitlePageProps): Promise<Metadata> {
  const { mediaType, id } = await params;
  const mediaTypeValid = mediaType === 'movie' || mediaType === 'tv';
  const idNum = parseInt(id, 10);

  if (!mediaTypeValid || isNaN(idNum)) {
    return { title: 'Not Found' };
  }

  const data = await getTitleData(
    mediaType as 'movie' | 'tv',
    idNum
  );

  if (!data) {
    return { title: 'Not Found' };
  }

  const ogImage = data.backdropPath
    ? getBackdropUrl(data.backdropPath)
    : undefined;

  return {
    title: data.title,
    description: data.overview?.slice(0, 160) || `${data.title} on MFLIX`,
    openGraph: {
      title: data.title,
      description: data.overview?.slice(0, 160),
      images: ogImage ? [{ url: ogImage }] : undefined,
    },
    twitter: {
      card: 'summary_large_image',
      title: data.title,
      description: data.overview?.slice(0, 160),
    },
  };
}

export default async function TitlePage({ params }: TitlePageProps) {
  const { mediaType, id } = await params;
  const mediaTypeValid = mediaType === 'movie' || mediaType === 'tv';
  const idNum = parseInt(id, 10);

  if (!mediaTypeValid || isNaN(idNum)) {
    notFound();
  }

  const data = await getTitleData(
    mediaType as 'movie' | 'tv',
    idNum
  );

  if (!data) {
    notFound();
  }

  return (
    <main className="min-h-screen bg-mflix-black">
      <Navbar />
      <TitleDetailContent data={data} />
    </main>
  );
}
