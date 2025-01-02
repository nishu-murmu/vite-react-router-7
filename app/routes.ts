import {
  type RouteConfig,
  index,
  layout,
  route,
} from "@react-router/dev/routes";
import { AppRoutes } from "./utils/config";

export default [
  layout("./layouts/MainLayout.tsx", [
    index("routes/home.tsx"),
    route(AppRoutes.createBook, "routes/create-book.tsx"),
    route(AppRoutes.users, "routes/users.tsx"),
    route(AppRoutes.books, "routes/books.tsx"),
    route(AppRoutes.chatRooms, "routes/chat-rooms.tsx"),
    route(AppRoutes.singleChatRoom, "routes/single-chat-room.tsx"),
    route(AppRoutes.contactUs, "routes/contact-us.tsx"),
  ]),
] satisfies RouteConfig;
