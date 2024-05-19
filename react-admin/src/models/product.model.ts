export interface DataType {
    _id?: string;
    productName: string;
    category: string,
    brandId: string,
    price: number;
    sort: number;
    isActive: boolean,
    description?: string,
    discount: number,
    stock: number,
    modelYear: number,
    thumbnail?: string,
    slug: string,
    isHome?: boolean
  }