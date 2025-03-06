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
  useCreateCategoryMutation,
  useDeleteCategoryMutation,
  useGetCategoriesQuery,
  useUpdateCategoryMutation,
} from "../../api/CategoryAPI";

const CategoriesDashboard: React.FC = () => {
  const {
    data: categories,
    isLoading,
    isError,
    refetch,
  } = useGetCategoriesQuery();
  const [createCategory] = useCreateCategoryMutation();
  const [updateCategory] = useUpdateCategoryMutation();
  const [deleteCategory] = useDeleteCategoryMutation();

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingCategory, setEditingCategory] = useState<any>(null);
  const [form] = Form.useForm();

  const handleDelete = async (id: number) => {
    try {
      await deleteCategory(id).unwrap();
      message.success("Категория удалена!");
      refetch();
    } catch (error: any) {
      message.error(`Ошибка при удалении: ${error.message}`);
    }
  };

  const handleEdit = (category: any) => {
    setEditingCategory(category);
    form.setFieldsValue(category);
    setIsModalOpen(true);
  };

  const handleCreate = () => {
    setEditingCategory(null);
    form.resetFields();
    setIsModalOpen(true);
  };

  const handleSubmit = async (values: any) => {
    try {
      if (editingCategory) {
        await updateCategory({ id: editingCategory.id, ...values }).unwrap();
        message.success("Категория обновлена!");
      } else {
        await createCategory(values).unwrap();
        message.success("Категория создана!");
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
      title: "Описание",
      dataIndex: "description",
      key: "description",
    },
    {
      title: "Действия",
      key: "actions",
      render: (_: any, record: any) => (
        <Space>
          <Button icon={<EditOutlined />} onClick={() => handleEdit(record)} />
          <Popconfirm
            title="Удалить категорию?"
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
    return <Alert message="Ошибка загрузки категорий" type="error" showIcon />;
  }

  return (
    <div>
      <h1>Управление категориями</h1>
      <Button
        type="primary"
        icon={<PlusOutlined />}
        onClick={handleCreate}
        style={{ marginBottom: 16 }}>
        Добавить категорию
      </Button>
      <Table
        dataSource={categories}
        columns={columns}
        rowKey="id"
        pagination={{ pageSize: 10 }}
      />

      <Modal
        title={
          editingCategory ? "Редактировать категорию" : "Создать категорию"
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
          <Form.Item name="description" label="Описание">
            <Input.TextArea />
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
};

export default CategoriesDashboard;
