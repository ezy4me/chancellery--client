import { Spin, Alert, Tag, Badge, Input, Select, Pagination, Empty } from "antd";
import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { FaHeart, FaRegHeart, FaShoppingCart, FaInfoCircle, FaSearch } from "react-icons/fa";
import { GiCardboardBox } from "react-icons/gi";
import styles from "./Catalog.module.scss";
import { useGetProductsQuery } from "../../../api/ProductAPI";
import {
  useGetWishlistQuery,
  useAddToWishlistMutation,
  useRemoveFromWishlistMutation,
} from "../../../api/WishlistAPI";
import { useSelector } from "react-redux";
import { RootState } from "../../../store";

const { Search } = Input;
const { Option } = Select;

const Catalog: React.FC = () => {
  const { data: productsData, error, isLoading } = useGetProductsQuery();
  const userId = useSelector((state: RootState) => state.auth.user?.id);
  const { data: wishlist, refetch } = useGetWishlistQuery(userId!, {
    skip: !userId,
  });

  const [addToWishlist] = useAddToWishlistMutation();
  const [removeFromWishlist] = useRemoveFromWishlistMutation();

  // Состояния для фильтрации и пагинации
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(8);

  useEffect(() => {
    if (error) {
      console.error("Ошибка при загрузке товаров:", error);
    }
  }, [error]);

  // Получаем все уникальные категории
  const categories = Array.from(
    new Set(productsData?.map((product) => product.category.name))
  );

  // Функция фильтрации продуктов
  const filteredProducts = productsData
    ?.filter((product) => {
      const matchesSearch = product.name
        .toLowerCase()
        .includes(searchTerm.toLowerCase());
      const matchesCategory = selectedCategory
        ? product.category.name === selectedCategory
        : true;
      return matchesSearch && matchesCategory;
    }) || [];

  // Пагинация
  const paginatedProducts = filteredProducts.slice(
    (currentPage - 1) * pageSize,
    currentPage * pageSize
  );

  const isInWishlist = (productId: number) => {
    return wishlist?.some((item) => item.product.id === productId);
  };

  const handleWishlistToggle = async (productId: number) => {
    if (!userId) {
      alert("Войдите в аккаунт, чтобы добавить в избранное.");
      return;
    }

    if (isInWishlist(productId)) {
      await removeFromWishlist({ userId, productId });
    } else {
      await addToWishlist({ userId, productId });
    }

    await refetch();
  };

  const addToCart = (product: any) => {
    const cart = JSON.parse(localStorage.getItem("cart") || "[]");
    const existingProduct = cart.find((item: any) => item.id === product.id);

    if (existingProduct) {
      existingProduct.quantity += 1;
    } else {
      cart.push({ ...product, quantity: 1 });
    }

    localStorage.setItem("cart", JSON.stringify(cart));
    alert("Товар добавлен в корзину!");
  };

  const handlePageChange = (page: number, size: number) => {
    setCurrentPage(page);
    setPageSize(size);
  };

  if (isLoading) {
    return (
      <div className={styles.catalogPage}>
        <Spin
          size="large"
          style={{ display: "block", margin: "auto", marginTop: 50 }}
        />
      </div>
    );
  }

  if (error) {
    return (
      <div className={styles.catalogPage}>
        <Alert message="Ошибка загрузки данных" type="error" showIcon />
      </div>
    );
  }

  return (
    <div className={styles.catalogPage}>
      <div className={styles.header}>
        <h1 className={styles.title}>Каталог продукции</h1>
        <p className={styles.subtitle}>Широкий ассортимент печатной продукции для вашего бизнеса</p>
      </div>

      {/* Панель поиска и фильтров */}
      <div className={styles.filterPanel}>
        <Search
          placeholder="Поиск по названию"
          allowClear
          enterButton={<FaSearch />}
          size="large"
          value={searchTerm}
          onChange={(e) => {
            setSearchTerm(e.target.value);
            setCurrentPage(1);
          }}
          className={styles.searchInput}
        />

        <Select
          placeholder="Все категории"
          allowClear
          size="large"
          value={selectedCategory}
          onChange={(value) => {
            setSelectedCategory(value);
            setCurrentPage(1);
          }}
          className={styles.categorySelect}
        >
          {categories.map((category) => (
            <Option key={category} value={category}>
              {category}
            </Option>
          ))}
        </Select>
      </div>

      {paginatedProducts.length === 0 ? (
        <div className={styles.emptyState}>
          <Empty
            description={
              searchTerm || selectedCategory
                ? "Ничего не найдено по вашему запросу"
                : "Каталог пуст"
            }
          />
        </div>
      ) : (
        <>
          <div className={styles.catalogGrid}>
            {paginatedProducts.map((product) => (
              <div key={product.id} className={styles.catalogItem}>
                <div className={styles.imageContainer}>
                  <img
                    src={"/placeholder.jpg"}
                    alt={product.name}
                    className={styles.catalogImage}
                    onError={(e) => (e.currentTarget.src = "/placeholder.jpg")}
                  />
                  <div className={styles.categoryTag}>
                    <Tag color="#3498db">{product.category.name}</Tag>
                  </div>
                  <button
                    className={`${styles.wishlistButton} ${
                      isInWishlist(product.id) ? styles.active : ""
                    }`}
                    onClick={() => handleWishlistToggle(product.id)}
                  >
                    {isInWishlist(product.id) ? (
                      <FaHeart className={styles.heartIcon} />
                    ) : (
                      <FaRegHeart className={styles.heartIcon} />
                    )}
                  </button>
                </div>

                <div className={styles.catalogInfo}>
                  <div className={styles.productHeader}>
                    <h3 className={styles.catalogName}>{product.name}</h3>
                    <Badge
                      count={`${product.quantity} шт`}
                      style={{ backgroundColor: "#2ecc71" }}
                    />
                  </div>

                  <p className={styles.catalogDescription}>
                    {product.description}
                  </p>

                  <div className={styles.supplierInfo}>
                    <GiCardboardBox className={styles.supplierIcon} />
                    <span>{product.supplier.name}</span>
                  </div>

                  <div className={styles.priceRow}>
                    <div className={styles.catalogPrice}>{product.price} ₽</div>
                    <div className={styles.actions}>
                      <Link
                        to={`/product/${product.id}`}
                        className={styles.detailsButton}
                      >
                        <FaInfoCircle /> Подробнее
                      </Link>
                      <button
                        className={styles.orderButton}
                        onClick={() => addToCart(product)}
                      >
                        <FaShoppingCart />
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Пагинация */}
          <div className={styles.pagination}>
            <Pagination
              current={currentPage}
              pageSize={pageSize}
              total={filteredProducts.length}
              onChange={handlePageChange}
              showSizeChanger
              pageSizeOptions={["8", "16", "24", "32"]}
              showTotal={(total) => `Всего ${total} товаров`}
            />
          </div>
        </>
      )}
    </div>
  );
};

export default Catalog;