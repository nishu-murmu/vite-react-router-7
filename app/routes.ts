import {
  type RouteConfig,
  index,
  layout,
  route,
} from "@react-router/dev/routes";

export default [
  layout("./layouts/MainLayout.tsx", [
    index("routes/home.tsx"),
    route("/create-book", "routes/create-book.tsx"),
    route("/users", "routes/users.tsx"),
    route("/books", "routes/books.tsx"),
    route("/chat", "routes/chat-rooms.tsx"),
    route("/contact-us", "routes/contact-us.tsx"),
  ]),
] satisfies RouteConfig;
