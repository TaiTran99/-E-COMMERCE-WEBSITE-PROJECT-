import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { axiosClient } from "../library/axiosClient";
import { message } from "antd";
import { DataType } from "../models/customer.model";

export const getCustomers = async (page = 1, limit = 10) => {
  const response = await axiosClient.get(`/v1/customers?page=${page}&limit=${limit}`);
  return response.data?.data;
};

export const useCustomers = (page: number, limit: number) => {
  return useQuery({
    queryKey: ["customers", page, limit],
    queryFn: () => getCustomers(page, limit),
  });
};

export const useUpdateCustomer = (page: number, limit: number, messageApi: any) => {
  const queryClient = useQueryClient();
  const updateCustomer = async (formData: DataType) => {
    const { _id, ...payload } = formData;
    await axiosClient.put(`/v1/customers/${_id}`, payload);
  };

  return useMutation({
    mutationFn: updateCustomer,
    onSuccess: () => {
      messageApi.open({ type: "success", content: "Update success!" });
      queryClient.invalidateQueries({ queryKey: ["customers", page, limit] });
    },
    onError: () => {
      messageApi.open({ type: "error", content: "Update failed!" });
    },
  });
};

export const useDeleteCustomer = (page: number, limit: number, messageApi: any) => {
  const queryClient = useQueryClient();
  const deleteCustomer = async (id: string) => {
    await axiosClient.delete(`/v1/customers/${id}`);
  };

  return useMutation({
    mutationFn: deleteCustomer,
    onSuccess: () => {
      messageApi.open({ type: "success", content: "Delete success!" });
      queryClient.invalidateQueries({ queryKey: ["customers", page, limit] });
    },
    onError: () => {
      messageApi.open({ type: "error", content: "Delete failed!" });
    },
  });
};

export const useCreateCustomer = (page: number, limit: number, messageApi: any) => {
  const queryClient = useQueryClient();
  const createCustomer = async (formData: DataType) => {
    await axiosClient.post("/v1/customers", formData);
  };

  return useMutation({
    mutationFn: createCustomer,
    onSuccess: () => {
      messageApi.open({ type: "success", content: "Create success!" });
      queryClient.invalidateQueries({ queryKey: ["customers", page, limit] });
    },
    onError: (error: any) => {
      messageApi.open({ type: "error", content: error.response.data.message || "Create failed!" });
    },
  });
};
