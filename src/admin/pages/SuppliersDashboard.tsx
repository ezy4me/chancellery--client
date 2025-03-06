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
  Form,
  Input,
} from "antd";
import { EditOutlined, DeleteOutlined, PlusOutlined } from "@ant-design/icons";
import {
  useCreateSupplierMutation,
  useDeleteSupplierMutation,
  useGetSuppliersQuery,
  useUpdateSupplierMutation,
} from "../../api/SupplierAPI";

const SuppliersDashboard: React.FC = () => {
  const {
    data: suppliers,
    isLoading,
    isError,
    refetch,
  } = useGetSuppliersQuery();
  const [createSupplier] = useCreateSupplierMutation();
  const [updateSupplier] = useUpdateSupplierMutation();
  const [deleteSupplier] = useDeleteSupplierMutation();

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingSupplier, setEditingSupplier] = useState<any>(null);
  const [form] = Form.useForm();

  const handleDelete = async (id: number) => {
    try {
      await deleteSupplier(id).unwrap();
      message.success("Поставщик удален!");
      refetch();
    } catch (error: any) {
      message.error(`Ошибка при удалении: ${error.message}`);
    }
  };

  const handleEdit = (supplier: any) => {
    setEditingSupplier(supplier);
    form.setFieldsValue(supplier);
    setIsModalOpen(true);
  };

  const handleCreate = () => {
    setEditingSupplier(null);
    form.resetFields();
    setIsModalOpen(true);
  };

  const handleSubmit = async (values: any) => {
    try {
      if (editingSupplier) {
        await updateSupplier({ id: editingSupplier.id, ...values }).unwrap();
        message.success("Поставщик обновлен!");
      } else {
        await createSupplier(values).unwrap();
        message.success("Поставщик создан!");
      }
      setIsModalOpen(false);
      refetch();
    } catch (error: any) {
      message.error(`Ошибка: ${error.message}`);
    }
  };

  const columns = [
    {
      title: "ID",
      dataIndex: "id",
      key: "id",
    },
    {
      title: "Название",
      dataIndex: "name",
      key: "name",
    },
    {
      title: "Адрес",
      dataIndex: "address",
      key: "address",
    },
    {
      title: "Телефон",
      dataIndex: "phone",
      key: "phone",
    },
    {
      title: "Действия",
      key: "actions",
      render: (_: any, record: any) => (
        <Space>
          <Button icon={<EditOutlined />} onClick={() => handleEdit(record)} />
          <Popconfirm
            title="Удалить поставщика?"
            onConfirm={() => handleDelete(record.id)}
            okText="Да"
            cancelText="Нет">
            <Button icon={<DeleteOutlined />} danger />
          </Popconfirm>
        </Space>
      ),
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
      <h1>Управление поставщиками</h1>
      <Button
        type="primary"
        icon={<PlusOutlined />}
        onClick={handleCreate}
        style={{ marginBottom: 16 }}>
        Добавить поставщика
      </Button>
      <Table
        dataSource={suppliers}
        columns={columns}
        rowKey="id"
        pagination={{ pageSize: 10 }}
      />

      <Modal
        title={
          editingSupplier ? "Редактировать поставщика" : "Создать поставщика"
        }
        open={isModalOpen}
        onCancel={() => setIsModalOpen(false)}
        onOk={() => form.submit()}>
        <Form form={form} layout="vertical" onFinish={handleSubmit}>
          <Form.Item
            name="name"
            label="Название"
            rules={[{ required: true, message: "Введите название" }]}>
            <Input />
          </Form.Item>
          <Form.Item
            name="address"
            label="Адрес"
            rules={[{ required: true, message: "Введите адрес" }]}>
            <Input />
          </Form.Item>
          <Form.Item
            name="phone"
            label="Телефон"
            rules={[{ required: true, message: "Введите телефон" }]}>
            <Input />
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
};

export default SuppliersDashboard;
