export interface DataType {
    _id?: string;
    orderDate: Date;
    orderStatus: String;
    requiredDate: Date;
    shippedDate: Date;
    paidDate: Date;
    orderNote: string;
    shippingAddress: string;
    shippingYard: string;
    shippingDistrict: string;
    shippingProvince: string;
    paymentType: string;
    customer:
      {
        _id?: string;
        firstName: string;
        lastName: string;
        email: string;
        phone: string;
        address: string;
        yard: string;
        district: string;
        province: string;
        password: string;
        sort: number;
        isActive: boolean;
      }
    staff:
      {
        _id?: string;
        firstName: string;
        lastName: string;
        email: string;
        phone: string;
        address: string;
        yard: string;
        district: string;
        province: string;
        password: string;
        sort: number;
        isActive: boolean;
      }
    orderItems: 
      {
        product: {
          _id?: string;
          productName: string;
          category: string,
          price: number;
          sort: number;
          isActive: boolean
        },
        quantity: number,
        price: number,
        discount: number,
        _id:string
      }
  }