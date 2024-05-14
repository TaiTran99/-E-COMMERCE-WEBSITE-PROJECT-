
import {Form,Checkbox, Input,InputNumber, type FormProps,Button,message} from 'antd'
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { axiosClient } from "../../library/axiosClient";



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

    
    const [updateFormEdit] = Form.useForm();
  
    
    const queryClient = useQueryClient();
    const checkEmailExists = async (email: string) => {
      // Thực hiện yêu cầu kiểm tra email tồn tại
      // Ví dụ: gửi yêu cầu đến máy chủ của bạn để kiểm tra email
      // Trả về true nếu email đã tồn tại, ngược lại trả về false
      // Ví dụ:
      // const response = await axiosClient.get(`/check-email/${email}`);
      // return response.data.exists;
      return false; // Giả sử mã nguồn của bạn cần thay đổi để thực hiện kiểm tra này
  };

  const fetchCreate = async (formData: DataType) => {
      const { email } = formData;
      const emailExists = await checkEmailExists(email);
      if (emailExists) {
          throw new Error("Email already exists"); // Ném một lỗi nếu email đã tồn tại
      }
      // Nếu email không tồn tại, thực hiện API để tạo mới dữ liệu
      return axiosClient.post(`/v1/customers`, formData);
  };
      // Hàm kiểm tra xem email đã tồn tại trong cơ sở dữ liệu hay chưa
     
    
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
            queryKey: ["customers"],
          });
          //
          updateFormEdit.resetFields();
        },
        onError: (error) => {
          // Kiểm tra xem lỗi có phải là "Email đã tồn tại" hay không
          if (error instanceof Error && error.message === "Email already exists") {
              messageApi.open({
                  type: "error",
                  content: "Email đã tồn tại",
              });
          } else {
              // Nếu không phải lỗi "Email đã tồn tại", hiển thị thông báo lỗi khác
              messageApi.open({
                  type: "error",
                  content: "Email đã tồn tại",
              });
          }
      },
  });

    
    const onFinish: FormProps<DataType>["onFinish"] = (values) => {
        console.log('Success:', values);
        mutationCreate.mutate(values)
      };
      
      const onFinishFailed: FormProps<DataType>["onFinishFailed"] = (errorInfo) => {
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