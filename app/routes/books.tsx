import type { LoaderFunctionArgs } from "react-router";
import PublicBooksGrid from "~/components/pages/books/PublicBookGrid";

export const loader = async ({ request }: LoaderFunctionArgs) => {
  const res = await fetch("/api/books");
  const books = await res.json();
  return { books: books?.data || [] };
};

const PublicBooksPage = ({ loaderData }: any) => {
  return <PublicBooksGrid books={loaderData?.books} />;
};

export default PublicBooksPage;
