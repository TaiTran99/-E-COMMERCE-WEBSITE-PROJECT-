import createError from 'http-errors';
import jwt  from 'jsonwebtoken';
import Customer from  '../models/customer.model'
import globalConfig from '../constants/config';
import { ICustomer} from '../types/models';

const AuthLogin = async (customerBody: {email: string, password: string}) => {
  console.log('2 ==> ', customerBody);
  //Tìm xem có tồn tại customer có email không
  let customer = await Customer.findOne({
    email: customerBody.email,
  });

  if (!customer) {
    throw createError(401, 'Invalid email or password');
  }

  const invalidPasword: boolean = customer.comparePassword(customerBody.password);
  //const invalidPasword = customer.password === customerBody.password;

  if (!invalidPasword) throw  createError(401, 'Invalid email or password');

  //Tồn tại thì trả lại thông tin customer kèm token
  const token = jwt.sign(
    { _id: customer._id, email: customer.email},
    globalConfig.JWT_SECRET as string,
    {
        expiresIn: '7d', // expires in 7days
      }
  );

  const refreshToken  = jwt.sign(
    { _id: customer._id, email: customer.email},
    globalConfig.JWT_SECRET as string,
    {
      expiresIn: '365d', // expires in 24 hours (24 x 60 x 60)
    }
  );


  return {
    customer: { id: customer._id, email: customer.email},
    token,
    refreshToken
  };
}


const refreshToken  = async (customer: ICustomer) => {
  const refreshToken  = jwt.sign(
    { _id: customer._id, email: customer.email},
    globalConfig.JWT_SECRET as string,
    {
      expiresIn: '365d', // expires in 24 hours (24 x 60 x 60)
    }
  );
  return refreshToken;
}


const getProfile = async (id: string) => {
  // SELECT * FROM customer WHERE id = id
  console.log(id);

  const customer = await Customer.
  findOne({
    _id: id
  }).
  select('-password -__v');
  
  return customer;
};

export default {
  AuthLogin,
  refreshToken,
  getProfile
}