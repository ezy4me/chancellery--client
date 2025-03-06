import React, { useState } from "react";
import {
  Table,
  Button,
  Space,
  Popconfirm,
  message,
  Spin,
  Alert,
  Modal,
  Select,
  Collapse,
} from "antd";
import { DeleteOutlined, SyncOutlined } from "@ant-design/icons";
import {
  useDeleteOrderMutation,
  useGetOrdersQuery,
  useUpdateOrderStatusMutation,
} from "../../api/OrderAPI";

const { Option } = Select;
const { Panel } = Collapse;

const OrderDashboard: React.FC = () => {
  const { data: orders, isLoading, isError, refetch } = useGetOrdersQuery();
  const [updateOrderStatus] = useUpdateOrderStatusMutation();
  const [deleteOrder] = useDeleteOrderMutation();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingOrder, setEditingOrder] = useState<any>(null);
  const [newStatus, setNewStatus] = useState<string>("");

  const handleDelete = async (id: number) => {
    try {
      await deleteOrder(id).unwrap();
      message.success("Заказ удален успешно!");
      refetch();
    } catch (error: any) {
      message.error(`Ошибка при удалении заказа: ${error.message}`);
    }
  };

  const handleEditStatus = async () => {
    if (!editingOrder) return;
    try {
      await updateOrderStatus({
        orderId: editingOrder.id,
        status: newStatus,
      }).unwrap();
      message.success("Статус заказа обновлен!");
      setIsModalOpen(false);
      refetch();
    } catch (error: any) {
      message.error(`Ошибка при обновлении статуса: ${error.message}`);
    }
  };

  const handleEdit = (order: any) => {
    setEditingOrder(order);
    setNewStatus(order.status);
    setIsModalOpen(true);
  };

  const columns = [
    {
      title: "ID",
      dataIndex: "id",
      key: "id",
    },
    {
      title: "Общая стоимость",
      dataIndex: "totalPrice",
      key: "totalPrice",
      render: (totalPrice: number) => `${totalPrice} ₽`,
    },
    {
      title: "Статус",
      dataIndex: "status",
      key: "status",
      render: (status: string, record: any) => (
        <Space>
          <span>{status}</span>
          <Button
            icon={<SyncOutlined />}
            size="small"
            onClick={() => handleEdit(record)}
          />
        </Space>
      ),
    },
    {
      title: "Дата создания",
      dataIndex: "createdAt",
      key: "createdAt",
      render: (createdAt: string) => new Date(createdAt).toLocaleString(),
    },
    {
      title: "Оплата",
      dataIndex: "payment",
      key: "payment",
    },
    {
      title: "Пользователь",
      dataIndex: "user",
      key: "user",
      render: (user: any) => user?.email || "Не указан",
    },
    {
      title: "Действия",
      key: "actions",
      render: (_: any, record: any) => (
        <Space>
          <Popconfirm
            title="Вы уверены, что хотите удалить этот заказ?"
            onConfirm={() => handleDelete(record.id)}
            okText="Да"
            cancelText="Нет">
            <Button icon={<DeleteOutlined />} danger />
          </Popconfirm>
        </Space>
      ),
    },
  ];

  const expandedRowRender = (order: any) => (
    <Collapse>
      <Panel header="Подробнее о заказе" key="1">
        <h3>Товары в заказе</h3>
        <Table
          dataSource={order.orderItems}
          columns={[
            {
              title: "Название товара",
              dataIndex: "product",
              key: "product.name",
              render: (product: any) => product?.name || "Не указано",
            },
            {
              title: "Количество",
              dataIndex: "quantity",
              key: "quantity",
            },
            {
              title: "Цена",
              dataIndex: "price",
              key: "price",
              render: (price: string) => `${price} ₽`,
            },
          ]}
          pagination={false}
          rowKey="id"
          size="small"
        />
      </Panel>
    </Collapse>
  );

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
      <h1>Управление заказами</h1>
      <Table
        dataSource={orders}
        columns={columns}
        rowKey="id"
        pagination={{ pageSize: 10 }}
        expandable={{
          expandedRowRender,
          rowExpandable: (record) => record.orderItems.length > 0,
        }}
      />

      <Modal
        title="Редактирование статуса заказа"
        open={isModalOpen}
        onCancel={() => setIsModalOpen(false)}
        footer={[
          <Button key="cancel" onClick={() => setIsModalOpen(false)}>
            Отмена
          </Button>,
          <Button key="save" type="primary" onClick={handleEditStatus}>
            Обновить статус
          </Button>,
        ]}>
        <Select
          value={newStatus}
          onChange={setNewStatus}
          style={{ width: "100%" }}>
          <Option value="pending">Ожидает</Option>
          <Option value="confirmed">Подтвержден</Option>
          <Option value="shipped">Отправлен</Option>
          <Option value="delivered">Доставлен</Option>
        </Select>
      </Modal>
    </div>
  );
};

export default OrderDashboard;
