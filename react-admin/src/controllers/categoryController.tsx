import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { axiosClient } from "../library/axiosClient";
import { message } from "antd";
import { DataType } from "../models/category.model";

export const getCategories = async (page = 1, limit = 10) => {
  const response = await axiosClient.get(`/v1/categories?page=${page}&limit=${limit}`);
  return response.data?.data;
};

export const useCategories = (page: number, limit: number) => {
  return useQuery({
    queryKey: ["categories", page, limit],
    queryFn: () => getCategories(page, limit),
  });
};

export const useUpdateCategory = (page: number, limit: number, messageApi: any) => {
  const queryClient = useQueryClient();
  const updateCategory = async (formData: DataType) => {
    const { _id, ...payload } = formData;
    await axiosClient.put(`/v1/categories/${_id}`, payload);
  };

  return useMutation({
    mutationFn: updateCategory,
    onSuccess: () => {
      messageApi.open({ type: "success", content: "Update success!" });
      queryClient.invalidateQueries({
        queryKey: ["categories", page, limit],
      });
    },
    onError: () => {
      messageApi.open({ type: "error", content: "Update failed!" });
    },
  });
};

export const useDeleteCategory = (page: number, limit: number, messageApi: any) => {
  const queryClient = useQueryClient();
  const deleteCategory = async (id: string) => {
    await axiosClient.delete(`/v1/categories/${id}`);
  };

  return useMutation({
    mutationFn: deleteCategory,
    onSuccess: () => {
      messageApi.open({ type: "success", content: "Delete success!" });
      queryClient.invalidateQueries({
        queryKey: ["categories", page, limit],
      });
    },
    onError: () => {
      messageApi.open({ type: "error", content: "Delete failed!" });
    },
  });
};

export const useCreateCategory = (page: number, limit: number, messageApi: any) => {
  const queryClient = useQueryClient();
  const createCategory = async (formData: DataType) => {
    await axiosClient.post("/v1/categories", formData);
  };

  return useMutation({
    mutationFn: createCategory,
    onSuccess: () => {
      messageApi.open({ type: "success", content: "Create success!" });
      queryClient.invalidateQueries({
        queryKey: ["categories", page, limit],
      });
    },
    onError: (error: any) => {
      messageApi.open({ type: "error", content: error.response.data.message || "Create failed!" });
    },
  });
};
