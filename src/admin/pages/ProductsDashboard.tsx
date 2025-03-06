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
  InputNumber,
  Select,
  Upload,
  UploadFile,
} from "antd";
import {
  UploadOutlined,
  EditOutlined,
  DeleteOutlined,
  PlusOutlined,
} from "@ant-design/icons";
import {
  useGetProductsQuery,
  useCreateProductMutation,
  useUpdateProductMutation,
  useDeleteProductMutation,
} from "../../api/ProductAPI";
import { useGetCategoriesQuery } from "../../api/CategoryAPI";
import { useGetSuppliersQuery } from "../../api/SupplierAPI";

const { Option } = Select;

const ProductDashboard = () => {
  const { data: products, isLoading, isError, refetch } = useGetProductsQuery();
  const { data: categories } = useGetCategoriesQuery();
  const { data: suppliers } = useGetSuppliersQuery();
  const [createProduct] = useCreateProductMutation();
  const [updateProduct] = useUpdateProductMutation();
  const [deleteProduct] = useDeleteProductMutation();

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState<any>(null);
  const [form] = Form.useForm();
  const [fileList, setFileList] = useState<UploadFile[]>([]);

  const handleDelete = async (id: number) => {
    try {
      await deleteProduct(id).unwrap();
      message.success("Продукт удален успешно!");
      refetch();
    } catch (error: any) {
      message.error(`Ошибка при удалении продукта: ${error.message}`);
    }
  };

  const handleEdit = (product: any) => {
    setEditingProduct(product);
    form.setFieldsValue(product);
    // Ensure image is a string before assigning it
    setFileList(
      product.image && typeof product.image === "string"
        ? [{ uid: "-1", name: "image.png", url: product.image }]
        : []
    );
    setIsModalOpen(true);
  };

  const handleCreate = () => {
    setEditingProduct(null);
    form.resetFields();
    setFileList([]);
    setIsModalOpen(true);
  };

  const handleSubmit = async (values: any) => {
    try {
      const formData = new FormData();
      Object.entries(values).forEach(([key, value]) => {
        if (value !== undefined && value !== null) {
          formData.append(key, String(value));
        }
      });

      if (fileList.length > 0 && fileList[0].originFileObj) {
        formData.append("image", fileList[0].originFileObj);
      }

      if (editingProduct) {
        await updateProduct({ id: editingProduct.id, ...values }).unwrap();
        message.success("Продукт обновлен!");
      } else {
        await createProduct(formData).unwrap();
        message.success("Продукт создан!");
      }
      setIsModalOpen(false);
      refetch();
    } catch (error: any) {
      message.error(`Ошибка: ${error.message}`);
    }
  };

  const columns = [
    { title: "ID", dataIndex: "id", key: "id" },
    { title: "Название", dataIndex: "name", key: "name" },
    {
      title: "Описание",
      dataIndex: "description",
      key: "description",
      ellipsis: true,
    },
    {
      title: "Цена",
      dataIndex: "price",
      key: "price",
      render: (price: number) => `${price} ₽`,
    },
    { title: "Количество", dataIndex: "quantity", key: "quantity" },
    {
      title: "Категория",
      dataIndex: "category",
      key: "category.name",
      render: (category: any) => category?.name || "Не указано",
    },
    {
      title: "Поставщик",
      dataIndex: "supplier",
      key: "supplier.name",
      render: (supplier: any) => supplier?.name || "Не указан",
    },
    {
      title: "Изображение",
      dataIndex: "image",
      key: "image",
      render: (image: string) =>
        image ? (
          <img
            src={image}
            alt="Product"
            width={50}
            onError={(e) => (e.currentTarget.src = "/public/placeholder.jpg")}
          />
        ) : (
          <img src={"/placeholder.jpg"} alt="Product" width={50} />
        ),
    },
    {
      title: "Действия",
      key: "actions",
      render: (_: any, record: any) => (
        <Space>
          <Button icon={<EditOutlined />} onClick={() => handleEdit(record)} />
          <Popconfirm
            title="Вы уверены, что хотите удалить этот продукт?"
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
      <h1>Управление продуктами</h1>
      <Button
        type="primary"
        icon={<PlusOutlined />}
        onClick={handleCreate}
        style={{ marginBottom: 16 }}>
        Добавить продукт
      </Button>

      <Table
        dataSource={products}
        columns={columns}
        rowKey="id"
        pagination={{ pageSize: 10 }}
      />

      <Modal
        title={editingProduct ? "Редактирование продукта" : "Создание продукта"}
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
          <Form.Item
            name="price"
            label="Цена"
            rules={[{ required: true, message: "Введите цену" }]}>
            <InputNumber style={{ width: "100%" }} min={0} />
          </Form.Item>
          <Form.Item
            name="quantity"
            label="Количество"
            rules={[{ required: true, message: "Введите количество" }]}>
            <InputNumber style={{ width: "100%" }} min={1} />
          </Form.Item>
          <Form.Item
            name="categoryId"
            label="Категория"
            rules={[{ required: true, message: "Выберите категорию" }]}>
            <Select>
              {categories?.map((category: any) => (
                <Option key={category.id} value={category.id}>
                  {category.name}
                </Option>
              ))}
            </Select>
          </Form.Item>
          <Form.Item
            name="supplierId"
            label="Поставщик"
            rules={[{ required: true, message: "Выберите поставщика" }]}>
            <Select>
              {suppliers?.map((supplier: any) => (
                <Option key={supplier.id} value={supplier.id}>
                  {supplier.name}
                </Option>
              ))}
            </Select>
          </Form.Item>
          <Form.Item label="Изображение">
            <Upload
              beforeUpload={() => false}
              fileList={fileList}
              onChange={({ fileList }) => setFileList(fileList)}
              listType="picture">
              <Button icon={<UploadOutlined />}>Загрузить</Button>
            </Upload>
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
};

export default ProductDashboard;
