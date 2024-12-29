import { RestaurantReview } from "@/components/demo/RestaurantReview";

export default async function RestaurantReviewPage({
  params,
}: {
  params: Promise<{ slug: string }>
}) {
  const slug = (await params).slug;

  if (!slug) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-red-500">Invalid page URL</div>
      </div>
    );
  }

  return <RestaurantReview slug={slug} />;
};
