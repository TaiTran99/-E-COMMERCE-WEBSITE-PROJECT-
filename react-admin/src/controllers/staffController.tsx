import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { axiosClient } from "../library/axiosClient";
import { message } from "antd";
import { DataType } from "../models/staff.model";

export const getStaffs = async (page = 1, limit = 10) => {
  return axiosClient.get(`/v1/staffs?page=${page}&limit=${limit}`);
};

export const useStaffs = (page: number, limit: number) => {
  return useQuery({
    queryKey: ["staffs", page, limit],
    queryFn: () => getStaffs(page, limit),
  });
};

export const useUpdateStaff = (page: number, limit: number, messageApi: any) => {
  const queryClient = useQueryClient();
  const updateStaff = async (formData: DataType) => {
    const { _id, ...payload } = formData;
    await axiosClient.put(`/v1/staffs/${_id}`, payload);
  };

  return useMutation({
    mutationFn: updateStaff,
    onSuccess: () => {
      messageApi.open({ type: "success", content: "Update success!" });
      queryClient.invalidateQueries({ queryKey: ["staffs", page, limit] });
    },
    onError: () => {
      messageApi.open({ type: "error", content: "Update failed!" });
    },
  });
};

export const useDeleteStaff = (page: number, limit: number, messageApi: any) => {
  const queryClient = useQueryClient();
  const deleteStaff = async (id: string) => {
    await axiosClient.delete(`/v1/staffs/${id}`);
  };

  return useMutation({
    mutationFn: deleteStaff,
    onSuccess: () => {
      messageApi.open({ type: "success", content: "Delete success!" });
      queryClient.invalidateQueries({ queryKey: ["staffs", page, limit] });
    },
    onError: () => {
      messageApi.open({ type: "error", content: "Delete failed!" });
    },
  });
};

export const useCreateStaff = (page: number, limit: number, messageApi: any) => {
  const queryClient = useQueryClient();
  const createStaff = async (formData: DataType) => {
    await axiosClient.post("/v1/staffs", formData);
  };

  return useMutation({
    mutationFn: createStaff,
    onSuccess: () => {
      messageApi.open({ type: "success", content: "Create success!" });
      queryClient.invalidateQueries({ queryKey: ["staffs", page, limit] });
    },
    onError: (error: any) => {
      messageApi.open({ type: "error", content: error.response.data.message || "Create failed!" });
    },
  });
};
