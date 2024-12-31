import type { LoaderFunctionArgs } from "react-router";
import PublicBooksGrid from "~/components/pages/books/PublicBookGrid";

export const loader = async ({ request }: LoaderFunctionArgs) => {
  const res = await fetch("http://localhost:3000/api/books");
  const books = await res.json();
  console.log("🚀 ~ loader ~ books:", books);
  return { books: books?.data || [] };
};

const PublicBooksPage = ({ loaderData }: any) => {
  return <PublicBooksGrid books={loaderData?.books} />;
};

export default PublicBooksPage;
