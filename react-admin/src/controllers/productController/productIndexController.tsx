import { useNavigate, useSearchParams } from "react-router-dom";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { axiosClient } from "../../library/axiosClient";
import useAuth from '../../hooks/useAuth';
import { message } from 'antd';
// import { DataType } from '../../../models/product.model';

const useProductController = () => {
  const [messageApi, contextHolder] = message.useMessage();
  const navigate = useNavigate();
  const [params] = useSearchParams();
  const page = params.get("page");
  const limit = params.get("limit");
  const int_page = page ? parseInt(page) : 1;
  const int_limit = limit ? parseInt(limit) : 10;
  
  const onChangePagination = (pageNumber: number) => {
    console.log("Page: ", pageNumber);
    navigate(`/products?page=${pageNumber}`);
  };

  const { user } = useAuth();

  const getProducts = async (page = 1, limit = 10) => {
    return axiosClient.get(`/v1/products?page=${page}&limit=${limit}`);
  };

  const queryProducts = useQuery({
    queryKey: ["products", int_page, int_limit],
    queryFn: () => getProducts(int_page, int_limit),
  });

  const queryClient = useQueryClient();

  const fetchDelete = async (id: string) => {
    return axiosClient.delete("/v1/products/" + id);
  };

  const deleteMutation = useMutation({
    mutationFn: fetchDelete,
    onSuccess: () => {
      console.log("Xóa category thành công !");
      messageApi.open({
        type: "success",
        content: "Delete success !",
      });
      queryClient.invalidateQueries({
        queryKey: ["products", int_page, int_limit],
      });
    },
    onError: (err) => {
      console.log("Xóa có lỗi !", err);
      messageApi.open({
        type: "error",
        content: "Delete fail !",
      });
    },
  });

  return {
    contextHolder,
    queryProducts,
    deleteMutation,
    onChangePagination,
    navigate,
    int_page,
    int_limit,
  };
};

export default useProductController;
