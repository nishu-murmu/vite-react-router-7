export const AppRoutes = {
  home: "/",
  contactUs: "/contact-us",
  users: "/users",
  createBook: "/create-book",
  books: "/books",
};

export const publicRoutes = [
  AppRoutes.home,
  AppRoutes.contactUs,
  AppRoutes.books,
];

export const privateRoutes = [AppRoutes.createBook];
