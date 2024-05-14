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
      _id:string,
      stock:string
    }
}

const OrderViewMorePage = () => {
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
    navigate(`/orders/_id?page=${pageNumber}`);
  };

  //Lay danh sach danhmuc
  const getOrders = async (page = 1, limit = 10) => {
    return axiosClient.get(`/v1/orders/_id?page=${page}&limit=${limit}`);
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

export default OrderViewMorePage;