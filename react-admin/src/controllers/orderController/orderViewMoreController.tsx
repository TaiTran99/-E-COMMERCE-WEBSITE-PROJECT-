import { useNavigate, useSearchParams } from "react-router-dom";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { axiosClient } from "../../library/axiosClient";
import { message } from "antd";

export const useOrderController = () => {
  const [params] = useSearchParams();
  const page = params.get("page");
  const limit = params.get("limit");
  const int_page = page ? parseInt(page) : 1;
  const int_limit = limit ? parseInt(limit) : 10;

  const navigate = useNavigate();
  const queryClient = useQueryClient();

  const showMessage = (text: string, level = "success") => {
    message.open({
      type: level,
      content: text,
    });
  };

  const getOrders = async (page = 1, limit = 10) => {
    return axiosClient.get(`/v1/orders?page=${page}&limit=${limit}`);
  };

  const queryOrder = useQuery({
    queryKey: ["orders", int_page, int_limit],
    queryFn: () => getOrders(int_page, int_limit),
  });

  const onChangePagination = (pageNumber: number, pageSize?: number) => {
    console.log("Page: ", pageNumber);
    navigate(`/orders/detail?page=${pageNumber}&limit=${pageSize || int_limit}`);
  };

  return {
    queryOrder,
    onChangePagination,
    showMessage,
    int_page,
    int_limit,
  };
};
