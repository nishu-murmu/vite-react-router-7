import { useAuth } from "@clerk/react-router";
import { AppRoutes } from "~/utils/config";

const useConstants = () => {
  const { isLoaded, userId } = useAuth();
  const NavLinks = [
    {
      key: "home",
      name: "Home",
      to: AppRoutes.home,
    },
    {
      key: "contact-us",
      name: "Contact Us",
      to: AppRoutes.contactUs,
    },
    {
      key: "users",
      name: "Users",
      to: AppRoutes.users,
    },
    {
      key: "create-book",
      name: "Create Book",
      to: AppRoutes.createBook,
      isHidden: !isLoaded || !userId,
    },
    {
      key: "books",
      name: "Books",
      to: AppRoutes.books,
    },
  ];
  return {
    NavLinks,
  };
};

export default useConstants;
