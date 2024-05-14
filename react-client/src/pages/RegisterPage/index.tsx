
import {Form,Checkbox, Input,InputNumber, type FormProps,Button,message} from 'antd'
import { useMutation, useQueryClient ,useQuery} from "@tanstack/react-query";
import { axiosClient } from "../../library/axiosClient";
import axios from 'axios';




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
  
const RegisterPage = () => {
    const [messageApi, contextHolder] = message.useMessage();
    //const {user} = useAuth()

    // React.useEffect(()=>{
    //   if(user?.role != 'user'){
    //     messageApi.open({
    //       type: "success",
    //       content: "Ban khong co quyen Them moi",
    //     });
    //   }

    // },[user])

    let existingEmails: string[] = [];
    const getCustomers = async () => {
      return axiosClient.get(`/v1/customers`)
    };
    //Lấy danh sách về
    const queryCustomer = useQuery({
        queryKey: ["categories"],
        queryFn: getCustomers,
    });

    // Lấy danh sách khách hàng từ queryCustomer
    
    // Kiểm tra nếu dữ liệu khách hàng tồn tại
    if (queryCustomer) {
      // Tạo mảng để lưu trữ tất cả các địa chỉ email
    

      // Duyệt qua danh sách khách hàng và lấy ra các trường email
      queryCustomer.data?.data.data.customers.forEach((customer) => {
        existingEmails.push(customer.email);
      });

      // Kiểm tra mảng existingEmails để xem các địa chỉ email đã được lấy thành công
      console.log(existingEmails);
    } else {
      console.log("Dữ liệu khách hàng không tồn tại.");
    }



    
    const [updateFormEdit] = Form.useForm();
  
    
    const queryClient = useQueryClient();
    const checkEmailExists = async (email: string) => {
      // Giả sử bạn thực hiện kiểm tra email tồn tại ở phía máy chủ
      // Trong ví dụ này, tôi sẽ chỉ đơn giản trả về một giá trị cố định là false
      return false;
    };

  const fetchCreate = async (formData: DataType) => {
      const { email } = formData;
      const emailExists = existingEmails.includes(email);
      if (emailExists) {
        throw new Error('Email already exists');
      }
  
      // Kiểm tra xem email tồn tại trong cơ sở dữ liệu hay không
      const emailExistsInDatabase = await checkEmailExists(email);
  
      if (emailExistsInDatabase) {
        throw new Error('Email already exists in the database');
      }
      // Nếu email không tồn tại, thực hiện API để tạo mới dữ liệu
      return axiosClient.post(`/v1/customers`, formData);
  };
      
  const mutationCreate = useMutation({
    mutationFn: fetchCreate,
    onSuccess: () => {
      console.log('Create success !');
      messageApi.open({
        type: 'success',
        content: 'Create success !',
      });
      queryClient.invalidateQueries({
        queryKey: ['customers'],
      });
      updateFormEdit.resetFields();
    },
    onError: (error) => {
      if (error instanceof Error) {
        messageApi.open({
          type: 'error',
          content: error.message,
        });
      } else {
        messageApi.open({
          type: 'error',
          content: 'Something went wrong',
        });
      }
    },
  });

  const onFinish: FormProps<DataType>['onFinish'] = (values) => {
    console.log('Success:', values);
    mutationCreate.mutate(values);
  };

  const onFinishFailed: FormProps<DataType>['onFinishFailed'] = (errorInfo) => {
    console.log('Failed:', errorInfo);
  };
  return (
    <div>
        {contextHolder}
        <h1>RegisterPage</h1>
       
        <Form
          form={updateFormEdit}
          name="edit-form"
          labelCol={{ span: 4 }}
          wrapperCol={{ span: 20 }}
          initialValues={{ remember: true }}
          onFinish={onFinish}
          onFinishFailed={onFinishFailed}
          autoComplete="off"
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
          

            <Form.Item
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
          <Form.Item name="isActive" valuePropName="checked" noStyle>
              <Checkbox>Enable</Checkbox>
            </Form.Item>
          <Form.Item>
            

            <Button 
          type="primary" 
          htmlType="submit"
          loading={mutationCreate.isPending}
          >
            Submit
          </Button>
         
          </Form.Item>

        </Form>
    </div>
  )
}

export default RegisterPage