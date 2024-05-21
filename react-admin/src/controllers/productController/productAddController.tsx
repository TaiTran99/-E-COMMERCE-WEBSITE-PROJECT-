import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { axiosClient } from "../../library/axiosClient";
import { useNavigate } from "react-router-dom";
import { message, Form } from 'antd';
import { DataType } from '../../models/product.model';

const useProductAddController = () => {
  const [messageApi, contextHolder] = message.useMessage();
  const navigate = useNavigate();
  const [updateFormEdit] = Form.useForm();

  const getCategories = async () => {
    return axiosClient.get(`/v1/categories`);
  };
  
  const queryCategory = useQuery({
    queryKey: ["categories"],
    queryFn: getCategories,
  });

  const getBrands = async () => {
    return axiosClient.get(`/v1/brands`);
  };

  const queryBrand = useQuery({
    queryKey: ["brands"],
    queryFn: getBrands,
  });

  const queryClient = useQueryClient();

  const fetchCreate = async (formData: DataType) => {
    return axiosClient.post(`/v1/products`, formData);
  };

  const mutationCreate = useMutation({
    mutationFn: fetchCreate,
    onSuccess: () => {
      console.log("Create success!");
      messageApi.open({
        type: "success",
        content: "Create success!",
      });
      queryClient.invalidateQueries({
        queryKey: ["products"],
      });
      updateFormEdit.resetFields();
    },
    onError: (error) => {
      messageApi.open({
        type: "error",
        content: "Create error!",
      });
    },
  });

  const onFinish = (values: DataType) => {
    console.log('Success:', values);
    mutationCreate.mutate(values);
  };

  const onFinishFailed = (errorInfo: any) => {
    console.log('Failed:', errorInfo);
  };

  return {
    contextHolder,
    queryCategory,
    queryBrand,
    mutationCreate,
    updateFormEdit,
    onFinish,
    onFinishFailed,
    navigate,
  };
};

export default useProductAddController;
