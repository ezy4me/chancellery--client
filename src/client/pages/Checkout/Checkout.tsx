import { Spin, Alert } from "antd";
import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import styles from "./Checkout.module.scss";
import { RootState } from "../../../store";
import { useCreateOrderMutation } from "../../../api/OrderAPI";
import { ShoppingCartOutlined } from "@ant-design/icons";

interface CartItem {
  id: number;
  name: string;
  price: number;
  quantity: number;
  image?: string | {};
}

const Checkout: React.FC = () => {
  const userId = useSelector((state: RootState) => state.auth.user?.id);
  const [cart, setCart] = useState<CartItem[]>([]);
  const [createOrder, { isLoading, isError }] = useCreateOrderMutation();

  useEffect(() => {
    const storedCart = JSON.parse(localStorage.getItem("cart") || "[]");
    setCart(storedCart);
  }, []);

  const updateQuantity = (productId: number, quantity: number) => {
    const updatedCart = cart.map((item) =>
      item.id === productId
        ? { ...item, quantity: Math.max(1, quantity) }
        : item
    );
    setCart(updatedCart);
    localStorage.setItem("cart", JSON.stringify(updatedCart));
  };

  const removeFromCart = (productId: number) => {
    const updatedCart = cart.filter((item) => item.id !== productId);
    setCart(updatedCart);
    localStorage.setItem("cart", JSON.stringify(updatedCart));
  };

  const totalPrice = cart.reduce(
    (sum, item) => sum + item.price * item.quantity,
    0
  );

  const handleOrderSubmit = async () => {
    if (!userId) {
      alert("Вы должны войти в аккаунт для оформления заказа.");
      return;
    }

    const orderItems = cart.map((item) => ({
      productId: item.id,
      quantity: item.quantity,
      price: item.price,
    }));

    const orderData = {
      orderItems: orderItems,
      totalPrice: totalPrice,
      payment: "card",
      status: "pending",
      userId: userId,
    };

    try {
      await createOrder(orderData).unwrap();
      alert("Заказ успешно оформлен!");
      localStorage.removeItem("cart");
      setCart([]);
    } catch (error) {
      if (error instanceof Error) {
        console.error("Ошибка при оформлении заказа:", error.message);
        alert(`Ошибка при оформлении заказа: ${error.message}`);
      } else {
        console.error("Неизвестная ошибка при оформлении заказа:", error);
        alert("Неизвестная ошибка при оформлении заказа.");
      }
    }
  };

  if (isLoading) {
    return (
      <div className={styles.checkoutPage}>
        <Spin
          size="large"
          style={{ display: "block", margin: "auto", marginTop: 50 }}
        />
      </div>
    );
  }

  if (isError) {
    return (
      <div className={styles.checkoutPage}>
        <Alert message="Ошибка при загрузке данных" type="error" showIcon />
      </div>
    );
  }

  return (
    <div className={styles.checkoutPage}>
      <h1>Оформление заказа</h1>
      {cart.length === 0 ? (
        <div className={styles.emptyCart}>
          <ShoppingCartOutlined />
          <p>Ваша корзина пуста.</p>
        </div>
      ) : (
        <>
          <div className={styles.cartList}>
            {cart.map((item) => {
              const isImageEmpty =
                item.image &&
                typeof item.image === "object" &&
                Object.keys(item.image).length === 0;
              const imageSrc =
                isImageEmpty || !item.image
                  ? "/placeholder.jpg"
                  : typeof item.image === "string"
                  ? item.image
                  : "/placeholder.jpg";

              return (
                <div key={item.id} className={styles.cartItem}>
                  <img
                    src={imageSrc}
                    alt={item.name}
                    onError={(e) => {
                      e.currentTarget.src = "/placeholder.jpg";
                      e.currentTarget.onerror = null;
                    }}
                  />
                  <div className={styles.itemDetails}>
                    <h3>{item.name}</h3>
                    <p className={styles.price}>
                      {item.price.toLocaleString()} ₽
                    </p>
                    <div className={styles.itemControls}>
                      <input
                        type="number"
                        value={item.quantity}
                        min="1"
                        onChange={(e) =>
                          updateQuantity(item.id, Number(e.target.value))
                        }
                      />
                      <button onClick={() => removeFromCart(item.id)}>
                        Удалить
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
          <div className={styles.orderSummary}>
            <div className={styles.totalPrice}>
              <span>Итого:</span>
              <span>{totalPrice.toLocaleString()} ₽</span>
            </div>
            <button
              className={styles.checkoutButton}
              onClick={handleOrderSubmit}
              disabled={isLoading}>
              {isLoading ? "Оформляем..." : "Оформить заказ"}
            </button>
            {isError && (
              <p className={styles.error}>Ошибка при оформлении заказа.</p>
            )}
          </div>
        </>
      )}
    </div>
  );
};

export default Checkout;
