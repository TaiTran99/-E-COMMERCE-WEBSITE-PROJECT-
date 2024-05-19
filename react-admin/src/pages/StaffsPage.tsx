import { useState } from "react";
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
  Select
} from "antd";
import {
  DeleteOutlined,
  EditOutlined,
  QuestionCircleOutlined,
} from "@ant-design/icons";
import type { TableProps, PaginationProps } from "antd";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { axiosClient } from "../library/axiosClient";
import { useNavigate, useSearchParams } from "react-router-dom";
import { DataType } from "../models/staff.model";

const StaffsPage = () => {
  const [messageApi, contextHolder] = message.useMessage();

  const showMessage = (text, level = "success") => {
    messageApi.open({
      type: level,
      content: text,
    });
  };

  const navigate = useNavigate();
  //=========================== PHÂN TRANG =================================//
  const [params] = useSearchParams();
  const page = params.get("page");
  const limit = params.get("limit");
  const int_page = page ? parseInt(page) : 1;
  const int_limit = limit ? parseInt(limit) : 10;
  const onChangePagination: PaginationProps["onChange"] = (pageNumber) => {
    console.log("Page: ", pageNumber);
    navigate(`/staffs?page=${pageNumber}`);
  };

  //Lay danh sach danhmuc
  const getStaffs = async (page = 1, limit = 10) => {
    return axiosClient.get(`/v1/staffs?page=${page}&limit=${limit}`);
  };
  //Lấy danh sách về
  // {data, isLoading, error, isError}
  const queryStaff = useQuery({
    queryKey: ["staffs", int_page, int_limit],
    queryFn: () => getStaffs(int_page, int_limit),
  });

  //EDIT MODAL HANDLERs
  const [isModalEditOpen, setIsModalEditOpen] = useState(false);

  const [updateFormEdit] = Form.useForm();
  const showModalEdit = () => {
    setIsModalEditOpen(true);
  };
  //Khi click nut OK tren Modal Form Edit
  const handleOkEdit = () => {
    //setIsModalEditOpen(false);
    // setIsModalEditOpen(false);
    console.log("edit submit");
    //Cho submit form trong Modal
    updateFormEdit.submit();
  };

  const handleCancelEdit = () => {
    setIsModalEditOpen(false);
  };

  //Goi API Edit Staff
  const queryClient = useQueryClient();

  const fetchUpdate = async (formData: DataType) => {
    const { _id, ...payload } = formData;
    return axiosClient.put("/v1/staffs/" + _id, payload);
  };

  const mutationUpdate = useMutation({
    mutationFn: fetchUpdate,
    onSuccess: () => {
      console.log("Update success !");
      messageApi.open({
        type: "success",
        content: "Update success !",
      });
      // Làm tươi lại danh sách danh mục dựa trên key đã định nghĩa
      queryClient.invalidateQueries({
        queryKey: ["staffs", int_page, int_limit],
      });
      //Ẩn modal
      setIsModalEditOpen(false);
    },
    onError: () => {
      //khi gọi API bị lỗi
    },
  });

  //hàm lấy thông tin từ form Edit
  const onFinishEdit = async (values: any) => {
    console.log("Success:", values); //=> chính là thông tin ở form edit
    //Gọi API để update staff
    mutationUpdate.mutate(values);
  };

  const onFinishEditFailed = (errorInfo: any) => {
    console.log("Failed:", errorInfo);
  };

  //=========================== FETCH DELETE =================================//
  // Mutations Để xóa danh mục
  const fetchDelete = async (id: string) => {
    return axiosClient.delete("/v1/staffs/" + id);
  };
  const deleteMutation = useMutation({
    mutationFn: fetchDelete,
    onSuccess: () => {
      console.log("Xóa staff thành công !");
      messageApi.open({
        type: "success",
        content: "Delete success !",
      });
      // Làm tươi lại danh sách danh mục dựa trên key đã định nghĩa
      queryClient.invalidateQueries({
        queryKey: ["staffs", int_page, int_limit],
      });
    },
    onError: (err) => {
      console.log("Xóa có lỗi !", err);
      //msgError('Xóa Product không thành công !');
    },
  });

  //CRAETE
  const [isModalCreateOpen, setIsModalCreateOpen] = useState(false);
  const [updateFormCreate] = Form.useForm();
  const showModalCreate = () => {
    setIsModalCreateOpen(true);
  };
  //Khi click nut OK tren Modal Form Edit
  const handleOkCreate = () => {
    //setIsModalEditOpen(false);
    // setIsModalEditOpen(false);
    console.log("create submit");
    //Cho submit form trong Modal
    updateFormCreate.submit();
  };

  const handleCancelCreate = () => {
    setIsModalCreateOpen(false);
  };
  const fetchCreate = async (formData: DataType) => {
    return axiosClient.post("/v1/staffs", formData);
  };

  const mutationCreate = useMutation({
    mutationFn: fetchCreate,
    onSuccess: () => {
      console.log("Create success !");
      messageApi.open({
        type: "success",
        content: "Create success !",
      });
      // Làm tươi lại danh sách danh mục dựa trên key đã định nghĩa
      queryClient.invalidateQueries({
        queryKey: ["staffs", int_page, int_limit],
      });
      //Ẩn modal
      setIsModalCreateOpen(false);
      updateFormCreate.resetFields();
    },
    onError: (error: any) => {
      //khi gọi API bị lỗi
      console.log("error Create");
      // messageApi.open({
      //   type: "error",
      //   content: error.response.data.message || "false",
      // });
      showMessage(error.response.data.message, "error");
    },
  });
  //hàm lấy thông tin từ form Edit
  const onFinishCreate = async (values: any) => {
    console.log("Success:", values); //=> chính là thông tin ở form edit
    //Gọi API để update staff
    mutationCreate.mutate(values);
  };

  const onFinishCreateFailed = (errorInfo: any) => {
    console.log("Failed:", errorInfo);
    //reset form
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
        title: "Role",
        dataIndex: "role",
        key: "role",
        render: (text) => <a>{text}</a>,
      },
    
    {
      title: "Password",
      dataIndex: "password",
      key: "password",
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
              console.log("Edit", record);
              showModalEdit();
              updateFormEdit.setFieldsValue(record);
            }}
          >
            Edit
          </Button>
          <Popconfirm
            title="Are you sure to delete?"
            onConfirm={() => {
              // DELETE
              console.log("DELETE", record);
              deleteMutation.mutate(record._id);
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
    <div>
    {contextHolder}
      <h1>Staffs List</h1>
      <Button
        type="primary"
        onClick={() => {
          console.log("Them moi");
          showModalCreate();
        }}
      >
        Create new Staff
      </Button>
      {/* TABLE LIST */}
      <Table
        pagination={false}
        columns={columns}
        dataSource={queryStaff.data?.data.data.staffs}
      />
      <div style={{ marginTop: 20 }}>
        <Pagination
          defaultCurrent={int_page}
          total={queryStaff.data?.data.data.totalItems}
          showSizeChanger
          defaultPageSize={int_limit}
          onChange={onChangePagination}
          showTotal={(total) => `Total ${total} items`}
        />
      </div>
      {/* end TABLE LIST */}
      {/* BEGIN MODAL EDIT */}
      <Modal
        title="Edit Staff"
        open={isModalEditOpen}
        onOk={handleOkEdit}
        onCancel={handleCancelEdit}
      >
        <Form
          form={updateFormEdit}
          name="edit-form"
          labelCol={{ span: 8 }}
          wrapperCol={{ span: 16 }}
          initialValues={{ remember: true }}
          onFinish={onFinishEdit}
          onFinishFailed={onFinishEditFailed}
          autoComplete="off"
        >
          <Form.Item<DataType>
            label="First Name"
            name="firstName"
            rules={[
              { required: true, message: "Please input staff Name!" },
              { min: 4, message: "Tối thiểu 4 kí tự" },
            ]}
          >
            <Input />
          </Form.Item>
          <Form.Item<DataType>
            label="Last Name"
            name="lastName"
            rules={[
              { required: true, message: "Please input staff Name!" },
              { min: 4, message: "Tối thiểu 4 kí tự" },
            ]}
          >
            <Input />
          </Form.Item>
          <Form.Item<DataType>
            label="Email"
            name="email"
            rules={[
              { required: true, message: "Please input staff Name!" },
              { min: 4, message: "Tối thiểu 4 kí tự" },
            ]}
          >
            <Input />
          </Form.Item>
          <Form.Item<DataType>
            label="Phone"
            name="phone"
            rules={[
              { required: true, message: "Please input staff Name!" },
              { min: 4, message: "Tối thiểu 4 kí tự" },
            ]}
          >
            <Input />
          </Form.Item>
          <Form.Item<DataType>
            label="Role"
            name="role"
            rules={[
              { required: true, message: "Please input staff Name!" },
              { min: 4, message: "Tối thiểu 4 kí tự" },
            ]}
          >
            <Select style={{ width: 120 }} onChange={() => {}}>
              <Select.Option value="admin">admin</Select.Option>
              <Select.Option value="subAdmin">subAdmin</Select.Option>
              <Select.Option value="user">user</Select.Option>
            </Select>
            
          </Form.Item>


          <Form.Item<DataType>
            label="Password"
            name="password"
            rules={[
              { required: true, message: "Please input staff Name!" },
              { min: 4, message: "Tối thiểu 4 kí tự" },
            ]}
          >
            <Input />
          </Form.Item>

          <Form.Item<DataType>
            hasFeedback
            label="Sort"
            name="sort"
            rules={[
              { required: false, message: "Please sort" },
              {
                type: "number",
                min: 1,
                message: "Tối thiểu phải là 1",
              },
            ]}
          >
            <InputNumber min={0} defaultValue={50} />
          </Form.Item>

          <Form.Item>
            <Form.Item name="isActive" valuePropName="checked" noStyle>
              <Checkbox>Enable</Checkbox>
            </Form.Item>
          </Form.Item>

          <Form.Item hidden label="Id" name="_id">
            <Input />
          </Form.Item>
        </Form>
      </Modal>
      {/* END MODAL EDIT */}

      {/* BEGIN MODAL Create */}
      <Modal
        title="Create new Staff"
        open={isModalCreateOpen}
        onOk={handleOkCreate}
        onCancel={handleCancelCreate}
      >
        <Form
          form={updateFormCreate}
          name="create-form"
          labelCol={{ span: 8 }}
          wrapperCol={{ span: 16 }}
          onFinish={onFinishCreate}
          onFinishFailed={onFinishCreateFailed}
          autoComplete="on"
        >
          <Form.Item<DataType>
            label="First Name"
            name="firstName"
            rules={[
              { required: true, message: "Please input staff Name!" },
            ]}
          >
            <Input />
          </Form.Item>
          <Form.Item<DataType>
            label="Last Name"
            name="lastName"
            rules={[
              { required: false, message: "Please input URL Seo!" },
            ]}
          >
            <Input />
          </Form.Item>

          <Form.Item<DataType>
            label="Email"
            name="email"
            rules={[
              { max: 500, message: "Tối đa 500 kí tự" }
            ]}
          >
            <Input />
          </Form.Item>
          <Form.Item<DataType>
            label="Phone"
            name="phone"
            rules={[
              { max: 500, message: "Tối đa 500 kí tự" }
            ]}
          >
            <Input />
          </Form.Item>
          
          <Form.Item<DataType>
            label="Role"
            name="role"
            rules={[
              { required: true, message: "Please input product Category!" },
            ]}
          >
          <Select style={{ width: 120 }} onChange={() => {}}>
            <Select.Option value="admin">Admin</Select.Option>
            <Select.Option value="subAdmin">SubAdmin</Select.Option>
            <Select.Option value="user">User</Select.Option>
          </Select>
          </Form.Item>
          
          <Form.Item<DataType>
            label="Password"
            name="password"
            rules={[
              { max: 500, message: "Tối đa 500 kí tự" }
            ]}
          >
            <Input />
          </Form.Item>
          
          <Form.Item<DataType>
            hasFeedback
            label="Sort"
            name="sort"
            rules={[
              { required: false, message: "Please sort" },
              {
                type: "number",
                min: 1,
                message: "Tối thiểu phải là 1",
              },
            ]}
          >
            <InputNumber min={0} defaultValue={50} />
          </Form.Item>

          <Form.Item>
            <Form.Item name="isActive" valuePropName="checked" noStyle>
              <Checkbox>Enable</Checkbox>
            </Form.Item>
          </Form.Item>
        </Form>
      </Modal>
      {/* END MODAL Create */}
    </div>
  );
};

export default StaffsPage;