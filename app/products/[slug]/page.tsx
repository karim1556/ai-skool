import { redirect } from "next/navigation";

interface Props {
  params: { slug: string };
}

export default function ProductsRedirect({ params }: Props) {
  const { slug } = params;
  // Redirect old canonical /products/:slug to new /product/:slug
  redirect(`/product/${encodeURIComponent(slug)}`);
}