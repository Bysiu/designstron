import { redirect } from 'next/navigation';

export default function DemoRedirectPage({
  params,
}: {
  params: { slug: string };
}) {
  redirect(`/portfolio/demo/${params.slug}`);
}
