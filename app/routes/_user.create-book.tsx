import { CreateBookComponent } from "~/components/pages/books/CreateBook";
import type { Route } from "../+types/root";

export async function action({ request }: Route.ActionArgs) {
  let formData = await request.formData();
  let title = formData.get("title");
  let author = formData.get("author");
  const response = await fetch("http://localhost:3000/api/book", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ title, author }),
  }).then((res) => res.json());
  return response;
}

const CreateBookPage = ({ actionData }: Route.ComponentProps) => {
  return <CreateBookComponent />;
};

export default CreateBookPage;
