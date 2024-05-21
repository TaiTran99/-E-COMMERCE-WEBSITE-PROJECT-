import React from 'react';
import { Form, Checkbox, Input, InputNumber, Select, Button } from 'antd';
import useProductEditController from '../../../controllers/productController/productEditController';
import { DataType } from '../../../models/product.model';

const ProductEditPage = () => {
  const {
    contextHolder,
    queryCategory,
    queryBrand,
    mutationUpdate,
    updateFormEdit,
    onFinish,
    onFinishFailed,
    navigate,
  } = useProductEditController();

  return (
    <div>
      {contextHolder}
      <h1>ProductEditPage</h1>
      <Button type='primary' onClick={() => navigate('/products')}>Products List</Button>
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
          label="Product Name"
          name="productName"
          rules={[
            { required: true, message: "Please input product Name!" },
            { min: 4, message: "Tối thiểu 4 kí tự" },
          ]}
        >
          <Input />
        </Form.Item>
        <Form.Item<DataType>
          label="URL SEO"
          name="slug"
          rules={[
            { required: true, message: "Please input product slug!" },
            { min: 4, message: "Tối thiểu 4 kí tự" },
          ]}
        >
          <Input />
        </Form.Item>
        <Form.Item<DataType>
          label="Category"
          name="category"
          rules={[
            { required: true, message: "Please input product Category!" },
          ]}
        >
          <Select
            style={{ width: 120 }}
            options={
              queryCategory.data?.data.data.categories.map((c) => ({
                value: c._id,
                label: c.categoryName,
              }))
            }
          />
        </Form.Item>
        <Form.Item<DataType>
          label="Brand"
          name="brandId"
          rules={[
            { required: true, message: "Please input product Brand!" },
          ]}
        >
          <Select
            style={{ width: 120 }}
            options={
              queryBrand.data?.data.data.brands.map((c) => ({
                value: c._id,
                label: c.brandName,
              }))
            }
          />
        </Form.Item>
        <Form.Item<DataType>
          hasFeedback
          label="Price"
          name="price"
          rules={[
            { required: false, message: "Please input Price" },
            { type: "number", min: 0, message: "Tối thiểu phải là 0" },
          ]}
        >
          <InputNumber min={0} defaultValue={0} />
        </Form.Item>
        <Form.Item<DataType>
          hasFeedback
          label="Discount"
          name="discount"
          rules={[
            { required: false, message: "Please input Discount" },
            { type: "number", min: 0, message: "Tối thiểu phải là 0" },
          ]}
        >
          <InputNumber min={0} defaultValue={0} />
        </Form.Item>
        <Form.Item<DataType>
          hasFeedback
          label="Stock"
          name="stock"
          rules={[
            { required: false, message: "Please input Stock" },
            { type: "number", min: 0, message: "Tối thiểu phải là 0" },
          ]}
        >
          <InputNumber min={0} defaultValue={0} />
        </Form.Item>
        <Form.Item<DataType>
          label="Description"
          name="description"
          rules={[{ max: 500, message: "Tối đa 500 kí tự" }]}
        >
          <Input.TextArea />
        </Form.Item>
        <Form.Item<DataType>
          hasFeedback
          label="Sort"
          name="sort"
          rules={[
            { required: false, message: "Please input Sort" },
            { type: "number", min: 1, message: "Tối thiểu phải là 1" },
          ]}
        >
          <InputNumber min={0} defaultValue={50} />
        </Form.Item>
        <Form.Item>
          <Form.Item name="isHome" valuePropName="checked" noStyle>
            <Checkbox>is Home</Checkbox>
          </Form.Item>
        </Form.Item>
        <Form.Item>
          <Form.Item name="isActive" valuePropName="checked" noStyle>
            <Checkbox>Enable</Checkbox>
          </Form.Item>
        </Form.Item>
        <Form.Item<DataType>
          label="Thumbnail"
          name="thumbnail"
        >
          <Input />
        </Form.Item>
        <Form.Item hidden label="Id" name="_id">
          <Input />
        </Form.Item>
        <Form.Item wrapperCol={{ offset: 4, span: 20 }}>
          <Button 
            type="primary" 
            htmlType="submit"
            loading={mutationUpdate.isLoading}
          >
            Submit
          </Button>
        </Form.Item>
      </Form>
    </div>
  );
};

export default ProductEditPage;
