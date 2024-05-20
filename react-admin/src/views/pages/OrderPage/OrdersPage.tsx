import { useState } from "react";
import {
  Space,
  Table,
  Pagination,
  Button,
  Modal,
  Form,
  Input,
  message,
  Popconfirm,
} from "antd";
import {
  DeleteOutlined,
  QuestionCircleOutlined,
} from "@ant-design/icons";
import type { TableProps, PaginationProps } from "antd";
import { useNavigate, useSearchParams } from "react-router-dom";
import { DataType } from "../../../models/order.model";
// import OrderController from "../../../controllers/orderController/orderEditController";
import { useOrders, useUpdateOrder, useDeleteOrder } from "../../../controllers/orderController/orderIndexController";

const OrdersPage = () => {
  const [messageApi, contextHolder] = message.useMessage();

  const navigate = useNavigate();
  const [params] = useSearchParams();
  const page = params.get("page");
  const limit = params.get("limit");
  const int_page = page ? parseInt(page) : 1;
  const int_limit = limit ? parseInt(limit) : 10;

  const { data, isLoading } = useOrders(int_page, int_limit);
  const orders = data?.data?.data?.orders || [];
  const totalItems = data?.data?.data?.totalItems || 0;

  const [isModalEditOpen, setIsModalEditOpen] = useState(false);
  const [updateFormEdit] = Form.useForm();

  const onChangePagination: PaginationProps["onChange"] = (pageNumber) => {
    navigate(`/orders?page=${pageNumber}`);
  };

  const updateOrderMutation = useUpdateOrder(int_page, int_limit, messageApi);
  const deleteOrderMutation = useDeleteOrder(int_page, int_limit, messageApi);

  const handleOkEdit = () => {
    updateFormEdit.submit();
  };

  const handleCancelEdit = () => {
    setIsModalEditOpen(false);
  };

  const onFinishEdit = (values: DataType) => {
    updateOrderMutation.mutate(values);
    setIsModalEditOpen(false);
  };

  const columns: TableProps<DataType>["columns"] = [
    {
      title: "Order NO.",
      dataIndex: "_id",
      key: "_id",
      render: (text) => <a>{text}</a>,
    },
    {
      title: "Customer Name",
      dataIndex: "customer",
      key: "firstName",
      render: (customer) => {
        const fullName = customer ? `${customer.firstName} ${customer.lastName}` : '';
        return <span>{fullName}</span>;
      },
    },
    {
      title: "Order Date",
      dataIndex: "orderDate",
      key: "orderDate",
      render: (text) => <a>{text}</a>,
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
        const email = customer ? customer.email : '';
        return <span>{email}</span>;
      },
    },
    {
      title: "Customer Phone",
      dataIndex: "customer",
      key: "phone",
      render: (customer) => {
        const phone = customer ? customer.phone : '';
        return <span>{phone}</span>;
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
              navigate(`/orders/detail`)
              updateFormEdit.setFieldsValue(record);
            }}
          >
            View More
          </Button>
          <Popconfirm
            title="Are you sure to delete?"
            onConfirm={() => deleteOrderMutation.mutate(record._id)}
            icon={<QuestionCircleOutlined style={{ color: "red" }} />}
            okText="Yes"
            okType="danger"
            cancelText="No"
          >
            <Button danger type="dashed" icon={<DeleteOutlined />} />
          </Popconfirm>
        </Space>
      ),
    },
  ];

  return (
    <div>
      {contextHolder}
      <h1>Orders List</h1>
      <Table
        pagination={false}
        columns={columns}
        dataSource={orders}
        loading={isLoading}
      />
      <Pagination
        defaultCurrent={int_page}
        total={totalItems}
        showSizeChanger
        defaultPageSize={int_limit}
        onChange={onChangePagination}
        showTotal={(total) => `Total ${total} items`}
      />
      <Modal
        title="Edit Order"
        open={isModalEditOpen}
        onOk={handleOkEdit}
        onCancel={handleCancelEdit}
        width={1300}
      >
        <Form
          form={updateFormEdit}
          name="edit-form"
          labelCol={{ span: 4 }}
          wrapperCol={{ span: 16 }}
          onFinish={onFinishEdit}
          autoComplete="off"
        >
          {/* Your form items here */}
        </Form>
      </Modal>
    </div>
  );
};

export default OrdersPage;
