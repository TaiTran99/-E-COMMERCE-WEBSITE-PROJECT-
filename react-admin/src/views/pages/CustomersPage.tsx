import { useState } from "react";
import { Space, Table, Pagination, Button, Modal, Form, Input, Checkbox, InputNumber, message, Popconfirm } from "antd";
import { DeleteOutlined, EditOutlined, QuestionCircleOutlined } from "@ant-design/icons";
import type { TableProps, PaginationProps } from "antd";
import { useNavigate, useSearchParams } from "react-router-dom";
import { DataType } from "../../models/customer.model";
import { useCustomers, useUpdateCustomer, useDeleteCustomer, useCreateCustomer } from "../../controllers/customerController";

const CustomersPage = () => {
  const [messageApi, contextHolder] = message.useMessage();
  const navigate = useNavigate();
  const [params] = useSearchParams();
  const page = parseInt(params.get("page") || "1");
  const limit = parseInt(params.get("limit") || "10");

  const { data, isLoading } = useCustomers(page, limit);
  const customers = data?.customers || [];
  const totalItems = data?.totalItems || 0;

  const [isModalEditOpen, setIsModalEditOpen] = useState(false);
  const [isModalCreateOpen, setIsModalCreateOpen] = useState(false);
  const [updateFormEdit] = Form.useForm();
  const [updateFormCreate] = Form.useForm();

  const onChangePagination: PaginationProps["onChange"] = (pageNumber) => {
    navigate(`/customers?page=${pageNumber}&limit=${limit}`);
  };

  const updateCustomerMutation = useUpdateCustomer(page, limit, messageApi);
  const deleteCustomerMutation = useDeleteCustomer(page, limit, messageApi);
  const createCustomerMutation = useCreateCustomer(page, limit, messageApi);

  const handleOkEdit = () => {
    updateFormEdit.submit();
  };

  const handleCancelEdit = () => {
    setIsModalEditOpen(false);
  };

  const handleOkCreate = () => {
    updateFormCreate.submit();
  };

  const handleCancelCreate = () => {
    setIsModalCreateOpen(false);
  };

  const onFinishEdit = (values: DataType) => {
    updateCustomerMutation.mutate(values);
    setIsModalEditOpen(false);
  };

  const onFinishCreate = (values: DataType) => {
    createCustomerMutation.mutate(values);
    setIsModalCreateOpen(false);
    updateFormCreate.resetFields();
  };

  const columns: TableProps<DataType>["columns"] = [
    {
      title: "First Name",
      dataIndex: "firstName",
      key: "firstName",
      render: (text) => <a>{text}</a>,
    },
    {
      title: "Last Name",
      dataIndex: "lastName",
      key: "lastName",
      render: (text) => <a>{text}</a>,
    },
    {
      title: "Email",
      dataIndex: "email",
      key: "email",
      render: (text) => <a>{text}</a>,
    },
    {
      title: "Phone",
      dataIndex: "phone",
      key: "phone",
      render: (text) => <a>{text}</a>,
    },
    {
      title: "Address",
      dataIndex: "address",
      key: "address",
      render: (text) => <a>{text}</a>,
    },
    {
      title: "Yard",
      dataIndex: "yard",
      key: "yard",
      render: (text) => <a>{text}</a>,
    },
    {
      title: "District",
      dataIndex: "district",
      key: "district",
      render: (text) => <a>{text}</a>,
    },
    {
      title: "Province",
      dataIndex: "province",
      key: "province",
      render: (text) => <a>{text}</a>,
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
              setIsModalEditOpen(true);
              updateFormEdit.setFieldsValue(record);
            }}
          >
            Edit
          </Button>
          <Popconfirm
            title="Are you sure to delete?"
            onConfirm={() => deleteCustomerMutation.mutate(record._id)}
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
      <h1>Customers List</h1>
      <Button type="primary" onClick={() => setIsModalCreateOpen(true)}>
        Create new Customer
      </Button>
      <Table
        pagination={false}
        columns={columns}
        dataSource={customers}
        rowKey={(record) => record._id}
        loading={isLoading}
      />
      <Pagination
        current={page}
        total={totalItems}
        pageSize={limit}
        onChange={onChangePagination}
        showTotal={(total) => `Total ${total} items`}
        style={{ marginTop: 20 }}
      />
      <Modal title="Edit Customer" open={isModalEditOpen} onOk={handleOkEdit} onCancel={handleCancelEdit}>
        <Form
          form={updateFormEdit}
          name="edit-form"
          labelCol={{ span: 8 }}
          wrapperCol={{ span: 16 }}
          onFinish={onFinishEdit}
          autoComplete="off"
        >
          {/* Your form items here */}
        </Form>
      </Modal>
      <Modal title="Create new Customer" open={isModalCreateOpen} onOk={handleOkCreate} onCancel={handleCancelCreate}>
        <Form
          form={updateFormCreate}
          name="create-form"
          labelCol={{ span: 8 }}
          wrapperCol={{ span: 16 }}
          onFinish={onFinishCreate}
          autoComplete="on"
        >
          {/* Your form items here */}
        </Form>
      </Modal>
    </div>
  );
};

export default CustomersPage;
