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
import { axiosClient } from "../../library/axiosClient";
import { useNavigate, useSearchParams } from "react-router-dom";
interface DataType {
  _id?: string;
  orderDate: Date;
  orderStatus: String;
  requiredDate: Date;
  shippedDate: Date;
  paidDate: Date;
  orderNote: string;
  shippingAddress: string;
  shippingYard: string;
  shippingDistrict: string;
  shippingProvince: string;
  paymentType: string;
  customer:
    {
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
  staff:
    {
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
  orderItems: 
    {
      product: {
        _id?: string;
        productName: string;
        category: string,
        price: number;
        sort: number;
        isActive: boolean
      },
      quantity: number,
      price: number,
      discount: number,
      _id:string
    }
}

const OrdersPage = () => {
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
    navigate(`/orders?page=${pageNumber}`);
  };

  //Lay danh sach danhmuc
  const getOrders = async (page = 1, limit = 10) => {
    return axiosClient.get(`/v1/orders?page=${page}&limit=${limit}`);
  };
  //Lấy danh sách về
  // {data, isLoading, error, isError}
  const queryOrder = useQuery({
    queryKey: ["orders", int_page, int_limit],
    queryFn: () => getOrders(int_page, int_limit),
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

  //Goi API Edit Order
  const queryClient = useQueryClient();

  const fetchUpdate = async (formData: DataType) => {
    const { _id, ...payload } = formData;
    return axiosClient.put("/v1/orders/" + _id, payload);
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
        queryKey: ["orders", int_page, int_limit],
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
    //Gọi API để update category
    mutationUpdate.mutate(values);
  };

  const onFinishEditFailed = (errorInfo: any) => {
    console.log("Failed:", errorInfo);
  };

  //=========================== FETCH DELETE =================================//
  // Mutations Để xóa danh mục
  const fetchDelete = async (id: string) => {
    return axiosClient.delete("/v1/orders/" + id);
  };
  const deleteMutation = useMutation({
    mutationFn: fetchDelete,
    onSuccess: () => {
      console.log("Xóa category thành công !");
      messageApi.open({
        type: "success",
        content: "Delete success !",
      });
      // Làm tươi lại danh sách danh mục dựa trên key đã định nghĩa
      queryClient.invalidateQueries({
        queryKey: ["orders", int_page, int_limit],
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
    return axiosClient.post("/v1/orders", formData);
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
        queryKey: ["orders", int_page, int_limit],
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
    //Gọi API để update category
    mutationCreate.mutate(values);
  };

  const onFinishCreateFailed = (errorInfo: any) => {
    console.log("Failed:", errorInfo);
    //reset form
  };

  const columns: TableProps<DataType>["columns"] = [
    
    // {
    //   title: "Quantity",
    //   dataIndex: "orderItems", // Cột này tham chiếu đến danh sách sản phẩm trong mỗi đơn hàng
    //   key: "quantity",
    //   render: (orderItems) => {
    //     // Xác định cách hiển thị tên sản phẩm (ở đây tôi sử dụng dấu phẩy để nối các tên sản phẩm lại với nhau)
    //     const quantity = orderItems.map((item) => item.quantity);
    //     return <span>{quantity}</span>;
    //   },
    // },
    {
      title: "Order NO.",
      dataIndex: "_id",
      key: "_id",
      render: (text) => <a>{text}</a>,
    },
    // 
    {
      title: "Customer Name",
      dataIndex: "customer", // Cột này tham chiếu đến danh sách sản phẩm trong mỗi đơn hàng
      key: "firstName",
      render: (customer) => {
        // Xác định cách hiển thị tên sản phẩm (ở đây tôi sử dụng dấu phẩy để nối các tên sản phẩm lại với nhau)
        const productNames = customer.firstName +" "+ customer.lastName;
        return(<span>{productNames}</span>
        ) ;
      },
    },
    {
      title: "Order Date",
      dataIndex: "orderDate",
      key: "orderDate",
      render: (text) => <a>{text}</a>,
    },
    // {
    //   title: "Shipped Date",
    //   dataIndex: "shippedDate",
    //   key: "shippedDate",
    //   render: (text) => <a>{text}</a>,
    // },
    // {
    //   title: "Paid Date",
    //   dataIndex: "paidDate",
    //   key: "paidDate",
    //   render: (text) => <a>{text}</a>,
    // },
    {
      title: "Order Status",
      dataIndex: "orderStatus",
      key: "orderStatus",
      render: (text) => <a>{text}</a>,
    },
    // {
    //   title: "Order Note",
    //   dataIndex: "orderNote",
    //   key: "orderNote",
    //   render: (text) => <a>{text}</a>,
    // },

    {
      title: "Customer Email",
      dataIndex: "customer", // Cột này tham chiếu đến danh sách sản phẩm trong mỗi đơn hàng
      key: "phone",
      render: (customer) => {
        // Xác định cách hiển thị tên sản phẩm (ở đây tôi sử dụng dấu phẩy để nối các tên sản phẩm lại với nhau)
        const productNames = customer.phone
        return(<span>{productNames}</span>
        ) ;
      },
    },
    
    {
      title: "Customer Email",
      dataIndex: "customer", // Cột này tham chiếu đến danh sách sản phẩm trong mỗi đơn hàng
      key: "email",
      render: (customer) => {
        // Xác định cách hiển thị tên sản phẩm (ở đây tôi sử dụng dấu phẩy để nối các tên sản phẩm lại với nhau)
        const productNames = customer.email
        return(<span>{productNames}</span>
        ) ;
      },
    },

   
    // {
    //   title: "Shipping Yard",
    //   dataIndex: "shippingYard",
    //   key: "shippingYard",
    //   render: (text) => <a>{text}</a>,
    // },
    // {
    //   title: "Shipping District",
    //   dataIndex: "shippingDistrict",
    //   key: "shippingDistrict",
    //   render: (text) => <a>{text}</a>,
    // },
    // {
    //   title: "Shipping Province",
    //   dataIndex: "shippingProvince",
    //   key: "shippingProvince",
    //   render: (text) => <a>{text}</a>,
    // },
  
    // {
    //   title: "Customer ID",
    //   dataIndex: "customer",
    //   key: "customer",
    //   render: (text) => <a>{text}</a>,
    // },
    // {
    //   title: "Staff ID",
    //   dataIndex: "staff",
    //   key: "staff",
    //   render: (text) => <a>{text}</a>,
    // },


    {
      title: "Action",
      key: "action",
      render: (_, record) => (
        <Space size="middle">
          <Button
            type="dashed"
            onClick={() => {
              console.log("Edit", record);
              navigate(`/orders/${record._id}`)
              updateFormEdit.setFieldsValue(record);
            }}
          >
            View More
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
      <h1>Orders List</h1>

      {/* TABLE LIST */}
      <Table
        pagination={false}
        columns={columns}
        dataSource={queryOrder.data?.data.data.orders}
      />
      <div style={{ marginTop: 20 }}>
        <Pagination
          defaultCurrent={int_page}
          total={queryOrder.data?.data.data.totalItems}
          showSizeChanger
          defaultPageSize={int_limit}
          onChange={onChangePagination}
          showTotal={(total) => `Total ${total} items`}
        />
      </div>
      {/* end TABLE LIST */}
      {/* BEGIN MODAL EDIT */}
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
          initialValues={{ remember: true }}
          onFinish={onFinishEdit}
          onFinishFailed={onFinishEditFailed}
          autoComplete="off"
        >
          {/* <Form.Item<DataType>
            label="Product Name"
            name = "productName"
            // initialValue={queryOrder.data?.data.data.orders[0].orderItems[2].product.productName} // Lấy giá trị productName từ orderItems

            rules={[
              { required: true, message: "Please input category Name!" },
              { min: 4, message: "Tối thiểu 4 kí tự" },
            ]}        
          >
            

            <Input  />
          </Form.Item> */}

      
            

          <Form.Item<DataType>
            label="Description"
            name="orderDate"
            rules={[{ max: 500, message: "Tối đa 500 kí tự" }]}
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

          <Form.Item label="Id" name="_id">
            <Input />
          </Form.Item>
        </Form>
      </Modal>
      {/* END MODAL EDIT */}

    </div>
  );
};

export default OrdersPage;