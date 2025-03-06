import React from "react";
import { Card, Col, Row, Statistic, Spin, Alert, List } from "antd";
import {
  UserOutlined,
  ShoppingCartOutlined,
  AppstoreOutlined,
  DollarOutlined,
  BellOutlined,
} from "@ant-design/icons";
import { useGetDashboardStatsQuery } from "../../api/DashboardAPI";

const Dashboard: React.FC = () => {
  const { data, isLoading, isError } = useGetDashboardStatsQuery();

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
    <div style={{ padding: 24 }}>
      <Row gutter={16}>
        <Col span={8}>
          <Card>
            <Statistic
              title="Пользователей"
              value={data?.usersCount || 0}
              prefix={<UserOutlined />}
            />
          </Card>
        </Col>
        <Col span={8}>
          <Card>
            <Statistic
              title="Заказов"
              value={data?.ordersCount || 0}
              prefix={<ShoppingCartOutlined />}
            />
          </Card>
        </Col>
        <Col span={8}>
          <Card>
            <Statistic
              title="Товаров"
              value={data?.productsCount || 0}
              prefix={<AppstoreOutlined />}
            />
          </Card>
        </Col>
      </Row>

      <Row gutter={16} style={{ marginTop: 16 }}>
        <Col span={8}>
          <Card>
            <Statistic
              title="Общий доход"
              value={data?.totalRevenue || 0}
              prefix={<DollarOutlined />}
            />
          </Card>
        </Col>
        <Col span={8}>
          <Card>
            <Statistic
              title="Уведомлений"
              value={data?.notificationsCount || 0}
              prefix={<BellOutlined />}
            />
          </Card>
        </Col>
      </Row>

      <Row gutter={16} style={{ marginTop: 16 }}>
        <Col span={12}>
          <Card title="Недавние заказы">
            <List
              itemLayout="horizontal"
              dataSource={data?.recentOrders || []}
              renderItem={(order: any) => (
                <List.Item>
                  <List.Item.Meta
                    title={`Заказ №${order.id}`}
                    description={`Цена: ${order.totalPrice} | Статус: ${order.status}`}
                  />
                  <div>{new Date(order.createdAt).toLocaleString()}</div>
                </List.Item>
              )}
            />
          </Card>
        </Col>

        <Col span={12}>
          <Card title="Недавние товары">
            <List
              itemLayout="horizontal"
              dataSource={data?.recentProducts || []}
              renderItem={(product: any) => (
                <List.Item>
                  <List.Item.Meta
                    title={product.name}
                    description={`${product.description} | Цена: ${product.price}`}
                  />
                  <div>{new Date(product.createdAt).toLocaleString()}</div>
                </List.Item>
              )}
            />
          </Card>
        </Col>
      </Row>
    </div>
  );
};

export default Dashboard;
