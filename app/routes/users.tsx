import AllUsersComponent from "~/components/pages/users/AllUsers";

export const loader = async () => {
  const res = await fetch("http://localhost:3000/api/users");
  const users = await res.json();
  return { users };
};
const UserPage = ({ users }: any = {}) => {
  return <AllUsersComponent users={users} />;
};

export default UserPage;
