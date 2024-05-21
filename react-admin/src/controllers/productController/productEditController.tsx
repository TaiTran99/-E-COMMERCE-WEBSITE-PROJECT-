import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { axiosClient } from "../../library/axiosClient";
import { useNavigate, useParams } from "react-router-dom";
import { message, Form } from 'antd';
import { DataType } from '../../models/product.model';

const useProductEditController = () => {
  const navigate = useNavigate();
  const [messageApi, contextHolder] = message.useMessage();
  const [updateFormEdit] = Form.useForm();
  const params = useParams();
  const { id } = params;

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

  const getProduct = async () => {
    return axiosClient.get(`/v1/products/${id}`);
  };

  const queryProduct = useQuery({
    queryKey: ["products-detail", id],
    queryFn: getProduct,
  });

  let productData = {};
  if (queryProduct.isSuccess) {
    productData = queryProduct.data.data.data;
    updateFormEdit.setFieldsValue(productData);
  }

  const queryClient = useQueryClient();

  const fetchUpdate = async (formData: DataType) => {
    return axiosClient.put(`/v1/products/${id}`, formData);
  };

  const mutationUpdate = useMutation({
    mutationFn: fetchUpdate,
    onSuccess: () => {
      messageApi.open({
        type: "success",
        content: "Update success!",
      });
      queryClient.invalidateQueries({
        queryKey: ["products-detail"],
      });
    },
    onError: () => {
      messageApi.open({
        type: "error",
        content: "Update error!",
      });
    },
  });

  const onFinish = (values: DataType) => {
    mutationUpdate.mutate(values);
  };

  const onFinishFailed = (errorInfo: any) => {
    console.log('Failed:', errorInfo);
  };

  return {
    contextHolder,
    queryCategory,
    queryBrand,
    queryProduct,
    mutationUpdate,
    updateFormEdit,
    onFinish,
    onFinishFailed,
    navigate,
  };
};

export default useProductEditController;
