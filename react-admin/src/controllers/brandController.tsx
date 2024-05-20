import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { axiosClient } from "../library/axiosClient";
import { message } from "antd";
import { DataType } from "../models/brand.model";

export const getBrands = async (page = 1, limit = 10) => {
  const response = await axiosClient.get(`/v1/brands?page=${page}&limit=${limit}`);
  return response.data?.data;
  
};

export const useBrands = (page: number, limit: number) => {
  return useQuery({
    queryKey: ["brands", page, limit],
    queryFn: () => getBrands(page, limit),
  });
};

export const useUpdateBrand = (page: number, limit: number, messageApi: any) => {
  const queryClient = useQueryClient();
  const updateBrand = async (formData: DataType) => {
    const { _id, ...payload } = formData;
    await axiosClient.put(`/v1/brands/${_id}`, payload);
  };

  return useMutation( {
    mutationFn: updateBrand,
    onSuccess: () => {
      messageApi.open({ type: "success", content: "Update success!" });
      queryClient.invalidateQueries({
        queryKey: ["brands", page, limit],
      });
    },
    onError: () => {
      messageApi.open({ type: "error", content: "Update failed!" });
    },
  });
};

export const useDeleteBrand = (page: number, limit: number, messageApi: any) => {
  const queryClient = useQueryClient();
  const deleteBrand = async (id: string) => {
    await axiosClient.delete(`/v1/brands/${id}`);
  };

  return useMutation({
    mutationFn: deleteBrand,
    onSuccess: () => {
      messageApi.open({ type: "success", content: "Delete success!" });
      queryClient.invalidateQueries({
        queryKey: ["brands", page, limit],
      });
    },
    onError: () => {
      messageApi.open({ type: "error", content: "Delete failed!" });
    },
  });
};

export const useCreateBrand = (page: number, limit: number, messageApi: any) => {
  const queryClient = useQueryClient();
  const createBrand = async (formData: DataType) => {
    await axiosClient.post("/v1/brands", formData);
  };

  return useMutation( {
    mutationFn: createBrand,
    onSuccess: () => {
      messageApi.open({ type: "success", content: "Create success!" });
      queryClient.invalidateQueries({
        queryKey: ["brands", page, limit],
      });
    },
    onError: (error: any) => {
      messageApi.open({ type: "error", content: error.response.data.message || "Create failed!" });
    },
  });
};
