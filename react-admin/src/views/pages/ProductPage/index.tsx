import React from 'react';
import { Space, Table, Button, Popconfirm, Pagination } from 'antd';
import { DeleteOutlined, QuestionCircleOutlined } from "@ant-design/icons";
import type { TableProps } from "antd";
import useProductController from '../../../controllers/productController/productIndexController';
import { DataType } from '../../../models/product.model';

const ProductPage = () => {
  const {
    contextHolder,
    queryProducts,
    deleteMutation,
    onChangePagination,
    navigate,
    int_page,
    int_limit,
  } = useProductController();

  const columns: TableProps<DataType>['columns'] = [
    {
      title: 'Name',
      dataIndex: 'productName',
      key: 'productName',
      render: (text) => <a>{text}</a>,
    },
    {
      title: 'Price',
      dataIndex: 'price',
      key: 'price',
    },
    {
      title: 'Category',
      dataIndex: 'categoryName',
      key: 'categoryName',
      render: (_, record) => {
        return <span>{record.category.categoryName}</span>;
      },
    },
    {
      title: "Sort",
      dataIndex: "sort",
      key: "sort",
    },
    {
      title: "Active",
      key: "isActive",
      dataIndex: "isActive",
      render: (text, record) => {
        return <span>{record.isActive ? "Enable" : "Disable"}</span>;
      },
    },
    {
      title: "Action",
      key: "action",
      render: (_, record) => (
        <Space size="middle">
          <Button
            type="dashed"
            onClick={() => {
              console.log("Edit", record);
              navigate(`/products/${record._id}`)
            }}
          >
            Edit
          </Button>
          <Popconfirm
            title="Are you sure to delete?"
            onConfirm={() => {
              console.log("DELETE", record);
              deleteMutation.mutate(record._id)
            }}
            icon={<QuestionCircleOutlined style={{ color: "red" }} />}
            onCancel={() => {}}
            okText="Đồng ý"
            okType="danger"
            cancelText="Đóng"
          >
            <Button danger type="dashed" icon={<DeleteOutlined />} />
          </Popconfirm>
        </Space>
      ),
    },
  ];

  return (
    <>
      {contextHolder}
      <h2>Product List</h2>
      <Button type='primary' onClick={() => {
        navigate('/products/add')
      }}>Create new Product</Button>
      <Table
        pagination={false}
        columns={columns}
        dataSource={queryProducts.data?.data.data.products}
      />
      <div style={{ marginTop: 20 }}>
        <Pagination
          defaultCurrent={int_page}
          total={queryProducts.data?.data.data.totalItems}
          showSizeChanger
          defaultPageSize={int_limit}
          onChange={onChangePagination}
          showTotal={(total) => `Total ${total} items`}
        />
      </div>
    </>
  );
};

export default ProductPage;
