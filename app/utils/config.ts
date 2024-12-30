export const AppRoutes = {
  home: "/",
  contactUs: "/contact-us",
  users: "/users",
  createBook: "/create-book",
};

export const publicRoutes = [AppRoutes.home, AppRoutes.contactUs];

export const privateRoutes = [AppRoutes.createBook];
