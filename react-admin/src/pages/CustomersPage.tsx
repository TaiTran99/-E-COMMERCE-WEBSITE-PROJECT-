import { useState } from "react";
import axios from 'axios';
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
  EditOutlined,
  QuestionCircleOutlined,
} from "@ant-design/icons";
import type { TableProps, PaginationProps } from "antd";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { axiosClient } from "../library/axiosClient";
import { useNavigate, useSearchParams } from "react-router-dom";
interface DataType {
  _id?: string;
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  address: string;
  yard: string;
  district: string;
  province: string;
  password: string;
  sort: number;
  isActive: boolean;
}

const CustomersPage = () => {
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
    navigate(`/customers?page=${pageNumber}`);
  };

  //Lay danh sach danhmuc
  const getCustomers = async (page = 1, limit = 10) => {
    return axiosClient.get(`/v1/customers?page=${page}&limit=${limit}`);
  };
  //Lấy danh sách về
  // {data, isLoading, error, isError}
  const queryCustomer = useQuery({
    queryKey: ["customers", int_page, int_limit],
    queryFn: () => getCustomers(int_page, int_limit),
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

  //Goi API Edit Customer
  const queryClient = useQueryClient();

  const fetchUpdate = async (formData: DataType) => {
    const { _id, ...payload } = formData;
    return axiosClient.put("/v1/customers/" + _id, payload);
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
        queryKey: ["customers", int_page, int_limit],
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
    //Gọi API để update customer
    mutationUpdate.mutate(values);
  };

  const onFinishEditFailed = (errorInfo: any) => {
    console.log("Failed:", errorInfo);
  };

  //=========================== FETCH DELETE =================================//
  // Mutations Để xóa danh mục
  const fetchDelete = async (id: string) => {
    return axiosClient.delete("/v1/customers/" + id);
  };
  const deleteMutation = useMutation({
    mutationFn: fetchDelete,
    onSuccess: () => {
      console.log("Xóa customer thành công !");
      messageApi.open({
        type: "success",
        content: "Delete success !",
      });
      // Làm tươi lại danh sách danh mục dựa trên key đã định nghĩa
      queryClient.invalidateQueries({
        queryKey: ["customers", int_page, int_limit],
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
    return axiosClient.post("/v1/customers", formData);
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
        queryKey: ["customers", int_page, int_limit],
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
    //Gọi API để update customer
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
    // {
    //   title: "Password",
    //   dataIndex: "password",
    //   key: "password",
    //   render: (text) => <a>{text}</a>,
    // },
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
      <h1>Customers List</h1>
      <Button
        type="primary"
        onClick={() => {
          console.log("Them moi");
          showModalCreate();
        }}
      >
        Create new Customer
      </Button>
      {/* TABLE LIST */}
      <Table
        pagination={false}
        columns={columns}
        dataSource={queryCustomer.data?.data.data.customers}
      />
      <div style={{ marginTop: 20 }}>
        <Pagination
          defaultCurrent={int_page}
          total={queryCustomer.data?.data.data.totalItems}
          showSizeChanger
          defaultPageSize={int_limit}
          onChange={onChangePagination}
          showTotal={(total) => `Total ${total} items`}
        />
      </div>
      {/* end TABLE LIST */}
      {/* BEGIN MODAL EDIT */}
      <Modal
        title="Edit Customer"
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
              { required: true, message: "Please input customer Name!" },
              { min: 4, message: "Tối thiểu 4 kí tự" },
            ]}
          >
            <Input />
          </Form.Item>
          <Form.Item<DataType>
            label="Last Name"
            name="lastName"
            rules={[
              { required: true, message: "Please input customer Name!" },
              { min: 4, message: "Tối thiểu 4 kí tự" },
            ]}
          >
            <Input />
          </Form.Item>
          <Form.Item
  label="Email"
  name="email"
  rules={[
    { 
      required: true,
      message: "Please input your email address!" 
    },
    { 
      max: 500, 
      message: "Maximum 500 characters allowed" 
    },
    {
      type: "email",
      message: "The input is not valid email!",
    },
    {
      validator: async (_, email) => {
        if (!email) {
          return Promise.resolve();
        }
        try {
          const response = await axiosClient.get(`/check-email/${email}`);
          if (response.data.exists) {
            return Promise.reject("This email address is already in use!");
          }
        } catch (error) {
          return Promise.reject("Failed to check email existence!");
        }
      },
    },
  ]}
>
  <Input />
</Form.Item>

          <Form.Item<DataType>
            label="Phone"
            name="phone"
            rules={[
              { required: true, message: "Please input customer Name!" },
              { min: 4, message: "Tối thiểu 4 kí tự" },
            ]}
          >
            <Input />
          </Form.Item>
          <Form.Item<DataType>
            label="Address"
            name="address"
            rules={[
              { required: true, message: "Please input customer Name!" },
              { min: 4, message: "Tối thiểu 4 kí tự" },
            ]}
          >
            <Input />
          </Form.Item>
          <Form.Item<DataType>
            label="Yard"
            name="yard"
            rules={[
              { required: true, message: "Please input customer Name!" },
              { min: 4, message: "Tối thiểu 4 kí tự" },
            ]}
          >
            <Input />
          </Form.Item>
          <Form.Item<DataType>
            label="District"
            name="district"
            rules={[
              { required: true, message: "Please input customer Name!" },
              { min: 4, message: "Tối thiểu 4 kí tự" },
            ]}
          >
            <Input />
          </Form.Item>

          <Form.Item<DataType>
            label="Province"
            name="province"
            rules={[
              { required: true, message: "Please input customer Name!" },
              { min: 4, message: "Tối thiểu 4 kí tự" },
            ]}
          >
            <Input />
          </Form.Item>

          <Form.Item<DataType>
            label="Password"
            name="password"
            rules={[
              { 
                validator: (rule, value, callback) => {
                  if (!/^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[@!*%$#]).{8,}$/.test(value)) {
                    callback("Mật khẩu phải gồm ít nhất 1 kí tự hoa, thường, đặc biệt");
                  } else {
                    callback();
                  }
                } 
              }
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
        title="Create new Customer"
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
              { required: true, message: "Please input customer Name!" },
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

          <Form.Item
            label="Email"
            name="email"
            rules={[
              { 
                required: true,
                message: "Please input your email address!" 
              },
              { 
                max: 500, 
                message: "Maximum 500 characters allowed" 
              },
              {
                type: "email",
                message: "The input is not valid email!",
              },
              {
                validator: (_, email) => {
                  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
                  if (!emailRegex.test(email)) {
                    return Promise.reject("Invalid email format!");
                  }
                  return Promise.resolve();
                },
              },
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
            label="Address"
            name="address"
            rules={[
              { max: 500, message: "Tối đa 500 kí tự" }
            ]}
          >
            <Input />
          </Form.Item>
          <Form.Item<DataType>
            label="Yard"
            name="yard"
            rules={[
              { max: 500, message: "Tối đa 500 kí tự" }
            ]}
          >
            <Input />
          </Form.Item>
          <Form.Item<DataType>
            label="District"
            name="district"
            rules={[
              { max: 500, message: "Tối đa 500 kí tự" }
            ]}
          >
            <Input />
          </Form.Item>
          <Form.Item<DataType>
            label="Province"
            name="province"
            rules={[
              { max: 500, message: "Tối đa 500 kí tự" }
            ]}
          >
            <Input />
          </Form.Item>
          <Form.Item<DataType>
            label="Password"
            name="password"
            rules={[
              { 
                validator: (rule, value, callback) => {
                  if (!/^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[@!*%$#]).{8,}$/.test(value)) {
                    callback("Mật khẩu phải gồm ít nhất 1 kí tự hoa, thường, đặc biệt");
                  } else {
                    callback();
                  }
                } 
              }
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

export default CustomersPage;