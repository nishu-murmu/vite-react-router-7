import AllUsersComponent from "~/components/pages/users/AllUsers";

export const loader = async () => {
  const res = await fetch("http://localhost:3000/api/users");
  const users = await res.json();
  return { users: users?.data || [] };
};
const UserPage = ({ loaderData }: any) => {
  return <AllUsersComponent users={loaderData?.users} />;
};

export default UserPage;
