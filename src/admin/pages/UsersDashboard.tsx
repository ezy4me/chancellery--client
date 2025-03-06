import { Table, Spin, Alert } from "antd";
import { useGetUsersQuery } from "../../api/UserAPI";

const UsersDashboard = () => {
  const { data: users, isLoading, isError } = useGetUsersQuery();

  const columns = [
    {
      title: "ID",
      dataIndex: "id",
      key: "id",
    },
    {
      title: "Email",
      dataIndex: "email",
      key: "email",
    },
    {
      title: "Телефон",
      dataIndex: "phone",
      key: "phone",
    },
    {
      title: "Роль",
      dataIndex: "role",
      key: "role",
    },
  ];

  if (isLoading) {
    return (
      <Spin
        size="large"
        style={{ display: "block", margin: "auto", marginTop: 50 }}
      />
    );
  }

  if (isError) {
    return <Alert message="Ошибка загрузки данных" type="error" showIcon />;
  }

  return (
    <div>
      <h2>Пользователи</h2>
      <Table columns={columns} dataSource={users} rowKey="id" />
    </div>
  );
};

export default UsersDashboard;
