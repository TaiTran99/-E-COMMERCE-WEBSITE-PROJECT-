import { useState } from "react";
import {
  Table,
  Pagination,
  message,
} from "antd";
import { useOrderController } from "../../../controllers/orderController/orderViewMoreController";
import { DataType } from "../../../models/order.model";
import type { TableProps, PaginationProps } from "antd";


const OrderViewMorePage = () => {
  const {
    queryOrder,
    onChangePagination,
    int_page,
    int_limit,
    showMessage,
  } = useOrderController();
  const [messageApi, contextHolder] = message.useMessage();

  const columns: TableProps<DataType>["columns"] = [   

    {
      title: "Product Name",
      dataIndex: "orderItems", // Tham chiếu đến danh sách sản phẩm trong mỗi đơn hàng
      key: "productName",
      render: (orderItems) => {
        // Lặp qua từng sản phẩm trong danh sách sản phẩm của đơn hàng
        const productNames = orderItems.map((item, index) => (
          <span key={index}>{item.product.productName}<br/></span>
        ));
        return productNames;
      },
    },
    
    {
      title: "Quantity",
      dataIndex: "orderItems", // Tham chiếu đến danh sách sản phẩm trong mỗi đơn hàng
      key: "quantity",
      render: (orderItems) => {
        // Lặp qua từng sản phẩm trong danh sách sản phẩm của đơn hàng
        const quantity = orderItems.map((item, index) => (
          <span key={index}>{item.quantity}<br/></span>
        ));
        return quantity;
      },
    },

    {
      title: "Price",
      dataIndex: "orderItems", // Tham chiếu đến danh sách sản phẩm trong mỗi đơn hàng
      key: "price",
      render: (orderItems) => {
        // Lặp qua từng sản phẩm trong danh sách sản phẩm của đơn hàng
        const price = orderItems.map((item, index) => (
          <span key={index}>{item.price}<br/></span>
        ));
        return price;
      },
    },
    {
      title: "Customer Name",
      dataIndex: "customer",
      key: "firstName",
      render: (customer) => {
        // Kiểm tra xem customer có tồn tại không trước khi truy cập vào firstName
        const fullName = customer ? `${customer.firstName} ${customer.lastName}` : '';
        return <span>{fullName}</span>;
      },
    },
    {
      title: "Storage",
      dataIndex: "orderItems", // Tham chiếu đến danh sách sản phẩm trong mỗi đơn hàng
      key: "stock",
      render: (orderItems) => {
        // Lặp qua từng sản phẩm trong danh sách sản phẩm của đơn hàng
        const stock = orderItems.map((item, index) => (
          <span key={index}>{item.stock}<br/></span>
        ));
        return stock;
      },
    },
    {
      title: "discount",
      dataIndex: "orderItems", // Tham chiếu đến danh sách sản phẩm trong mỗi đơn hàng
      key: "discount",
      render: (orderItems) => {
        // Lặp qua từng sản phẩm trong danh sách sản phẩm của đơn hàng
        const discount = orderItems.map((item, index) => (
          <span key={index}>{item.discount}<br/></span>
        ));
        return discount;
      },
    },

    {
      title: "Total Money",
      key: "total",
      render: (_, record) => {
        const { orderItems } = record;
        if (!Array.isArray(orderItems)) {
          return <span>Invalid order items</span>;
        }
    
        let total = 0;
    
        orderItems.forEach((item) => {
          const subTotal = item.price * item.quantity * (100 - item.discount) / 100;
          total += subTotal;
        });
    
        return <span>{total}</span>;
      },
    },

    {
      title: "Order Status",
      dataIndex: "orderStatus",
      key: "orderStatus",
      render: (text) => <a>{text}</a>,
    },

    {
      title: "Customer Email",
      dataIndex: "customer",
      key: "email",
      render: (customer) => {
        // Kiểm tra xem customer có tồn tại không trước khi truy cập vào email
        const email = customer ? customer.email : '';
        return <span>{email}</span>;
      },
    },
    {
      title: "Customer Phone",
      dataIndex: "customer",
      key: "phone",
      render: (customer) => {
        // Kiểm tra xem customer có tồn tại không trước khi truy cập vào phone
        const phone = customer ? customer.phone : '';
        return <span>{phone}</span>;
      },
    },
   
  ];

  return (
    <div>
      {contextHolder}
      <h1>Orders List</h1>

      <Table
        pagination={false}
        columns={columns}
        dataSource={queryOrder.data?.data.data.orders}
      />
      <div style={{ marginTop: 20 }}>
        <Pagination
          current={int_page}
          total={queryOrder.data?.data.data.totalItems}
          showSizeChanger
          pageSize={int_limit}
          onChange={onChangePagination}
          showTotal={(total) => `Total ${total} items`}
        />
      </div>
    </div>
  );
};

export default OrderViewMorePage;
