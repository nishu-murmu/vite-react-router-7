import AllUsersComponent from "~/components/pages/users/AllUsers";

export const loader = async () => {
  const users = await fetch("http://localhost:3000/api/users").then((r) =>
    r.json()
  );
  return { users: users?.data || [] };
};
const PublicUserPage = ({ loaderData }: any) => {
  return <AllUsersComponent users={loaderData?.users} />;
};

export default PublicUserPage;
