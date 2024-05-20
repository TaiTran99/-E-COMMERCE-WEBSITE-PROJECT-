import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { axiosClient } from "../../library/axiosClient";
import { message } from "antd";
import { DataType } from "../../models/order.model";

export const getOrders = async (page = 1, limit = 10) => {
  return axiosClient.get(`/v1/orders?page=${page}&limit=${limit}`);
};

export const useOrders = (page: number, limit: number) => {
  return useQuery({
    queryKey: ["orders", page, limit],
    queryFn: () => getOrders(page, limit),
  });
};

export const useUpdateOrder = (page: number, limit: number, messageApi: any) => {
  const queryClient = useQueryClient();
  const updateOrder = async (formData: DataType) => {
    const { _id, ...payload } = formData;
    await axiosClient.put(`/v1/orders/${_id}`, payload);
  };

  return useMutation({
    mutationFn: updateOrder,
    onSuccess: () => {
      messageApi.open({ type: "success", content: "Update success!" });
      queryClient.invalidateQueries({ queryKey: ["orders", page, limit] });
    },
    onError: () => {
      messageApi.open({ type: "error", content: "Update failed!" });
    },
  });
};

export const useDeleteOrder = (page: number, limit: number, messageApi: any) => {
  const queryClient = useQueryClient();
  const deleteOrder = async (id: string) => {
    await axiosClient.delete(`/v1/orders/${id}`);
  };

  return useMutation({
    mutationFn: deleteOrder,
    onSuccess: () => {
      messageApi.open({ type: "success", content: "Delete success!" });
      queryClient.invalidateQueries({ queryKey: ["orders", page, limit] });
    },
    onError: () => {
      messageApi.open({ type: "error", content: "Delete failed!" });
    },
  });
};
