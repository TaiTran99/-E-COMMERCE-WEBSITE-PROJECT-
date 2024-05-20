import { useState, useEffect } from "react";
import {
  Space,
  Table,
  Pagination,
  Button,
  Modal,
  Form,
  Input,
  Checkbox,
  InputNumber,
  message,
  Popconfirm,
} from "antd";
import {
  DeleteOutlined,
  QuestionCircleOutlined,
} from "@ant-design/icons";
import type { TableProps, PaginationProps } from "antd";
import { useNavigate, useSearchParams } from "react-router-dom";
import { DataType } from "../../models/category.model";
import { useCategories, useUpdateCategory, useDeleteCategory, useCreateCategory } from "../../controllers/categoryController";

const CategoriesPage = () => {
  const [messageApi, contextHolder] = message.useMessage();
  const navigate = useNavigate();
  const [params] = useSearchParams();
  const page = parseInt(params.get("page") || "1");
  const limit = parseInt(params.get("limit") || "10");

  const { data, isLoading } = useCategories(page, limit);
  const categories = data?.categories || [];
  const totalItems = data?.totalItems || 0;

  useEffect(() => {
    console.log('Fetched categories:', categories);
  }, [categories]);

  const [isModalEditOpen, setIsModalEditOpen] = useState(false);
  const [isModalCreateOpen, setIsModalCreateOpen] = useState(false);
  const [updateFormEdit] = Form.useForm();
  const [updateFormCreate] = Form.useForm();

  const onChangePagination: PaginationProps["onChange"] = (pageNumber: number) => {
    navigate(`/categories?page=${pageNumber}&limit=${limit}`);
  };

  const updateCategoryMutation = useUpdateCategory(page, limit, messageApi);
  const deleteCategoryMutation = useDeleteCategory(page, limit, messageApi);
  const createCategoryMutation = useCreateCategory(page, limit, messageApi);

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
    updateCategoryMutation.mutate(values);
    setIsModalEditOpen(false);
  };

  const onFinishCreate = (values: DataType) => {
    createCategoryMutation.mutate(values);
    setIsModalCreateOpen(false);
    updateFormCreate.resetFields();
  };

  const columns: TableProps<DataType>["columns"] = [
    {
      title: "Name",
      dataIndex: "categoryName",
      key: "categoryName",
    },
    {
      title: "Description",
      dataIndex: "description",
      key: "description",
    },
    {
      title: "Sort",
      dataIndex: "sort",
      key: "sort",
    },
    {
      title: "Active",
      dataIndex: "isActive",
      key: "isActive",
      render: (isActive: boolean) => <span>{isActive ? "Enable" : "Disable"}</span>,
    },
    {
      title: "Action",
      key: "action",
      render: (_, record: DataType) => (
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
            onConfirm={() => deleteCategoryMutation.mutate(record._id)}
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
      <h1>Categories List</h1>
      <Button type="primary" onClick={() => setIsModalCreateOpen(true)}>
        Create new Category
      </Button>
      <Table
        pagination={false}
        columns={columns}
        dataSource={categories}
        rowKey={(record) => record._id || record.categoryName}
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
      <Modal title="Edit Category" open={isModalEditOpen} onOk={handleOkEdit} onCancel={handleCancelEdit}>
        <Form
          form={updateFormEdit}
          name="edit-form"
          labelCol={{ span: 8 }}
          wrapperCol={{ span: 16 }}
          onFinish={onFinishEdit}
          autoComplete="off"
        >
          <Form.Item label="Category Name" name="categoryName" rules={[{ required: true, message: "Please input category Name!" }]}>
            <Input />
          </Form.Item>
          <Form.Item label="Description" name="description">
            <Input />
          </Form.Item>
          <Form.Item label="Sort" name="sort" rules={[{ type: "number", min: 1, message: "Minimum value is 1" }]}>
            <InputNumber min={1} />
          </Form.Item>
          <Form.Item name="isActive" valuePropName="checked">
            <Checkbox>Enable</Checkbox>
          </Form.Item>
          <Form.Item hidden name="_id">
            <Input />
          </Form.Item>
        </Form>
      </Modal>
      <Modal title="Create new Category" open={isModalCreateOpen} onOk={handleOkCreate} onCancel={handleCancelCreate}>
        <Form
          form={updateFormCreate}
          name="create-form"
          labelCol={{ span: 8 }}
          wrapperCol={{ span: 16 }}
          onFinish={onFinishCreate}
          autoComplete="on"
        >
          <Form.Item label="Category Name" name="categoryName" rules={[{ required: true, message: "Please input category Name!" }]}>
            <Input />
          </Form.Item>
          <Form.Item label="Description" name="description">
            <Input />
          </Form.Item>
          <Form.Item label="Sort" name="sort" rules={[{ type: "number", min: 1, message: "Minimum value is 1" }]}>
            <InputNumber min={1} />
          </Form.Item>
          <Form.Item name="isActive" valuePropName="checked">
            <Checkbox>Enable</Checkbox>
          </Form.Item>
          <Form.Item<DataType>
            label="URL SEO"
            name="slug"
            rules={[
              { required: false, message: "Please input URL Seo!" },
              { min: 4, message: "Tối thiểu 4 kí tự" },
            ]}
          >
            <Input />
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
};

export default CategoriesPage;
