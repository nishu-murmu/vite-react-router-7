export const AppRoutes = {
  home: "/",
  contactUs: "/contact-us",
  users: "/users",
  createBook: "/create-book",
  books: "/books",
  chatRooms: "/chat-rooms",
  singleChatRoom: "/chat-room/:id",
};

export const publicRoutes = [
  AppRoutes.home,
  AppRoutes.contactUs,
  AppRoutes.books,
];

export const privateRoutes = [
  AppRoutes.createBook,
  AppRoutes.chatRooms,
  AppRoutes.singleChatRoom,
];

export const config = {
  serverUrl: import.meta.env.VITE_SERVER_ENDPOINT as string,
};
