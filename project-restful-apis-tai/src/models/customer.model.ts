import { Schema, model } from 'mongoose';
import { ICustomer , CustomerModel, ICustomerMethods } from '../types/models';
import bcrypt from 'bcrypt'
const SALT_WORK_FACTOR = 10;

const customerSchema = new Schema<ICustomer,CustomerModel, ICustomerMethods>(
    {
      firstName: {
        type: String,
        required: true,
        trim: true,
        min: [6, 'Too few eggs'],
        max: [12, 'Only allow Max 12 characters'],
      },
      lastName: {
        type: String,
        required: true,
        trim: true,
        min: [6, 'Too few eggs'],
        max: [12, 'Only allow Max 12 characters'],
      },
      email: {
        type: String,
        required: true,
        trim: true,
        unique: true,
        lowercase: true,
        validate: {
          validator: function (v: string) {
            return /^(([^<>()[\]\.,;:\s@\"]+(\.[^<>()[\]\.,;:\s@\"]+)*)|(\".+\"))@(([^<>()[\]\.,;:\s@\"]+\.)+[^<>()[\]\.,;:\s@\"]{2,})$/i.test(v);
          },
          message: (props:any) => `${props.value} is not a valid email!`,
        },
      },
      phone: {
        type: String,
        required: true,
        trim: true,
        unique: true,
        lowercase: true,
        minLength: 10,
        validate: {
          validator: function (value: string) {
            const phoneRegex = /(0[3|5|7|8|9])([0-9]{8})/i;
            return phoneRegex.test(value);
          },
          message: `{VALUE} is not a valid phone!`,
          // message: (props) => `{props.value} is not a valid email!`,
        },
      },
      //địa chỉ
      address: {
        type: String,
        required: true,
        trim: true,
        maxLength: 255,
      },
      //xả phường
      yard: {
        type: String,
        required: true,
        trim: true,
        maxLength: 50,
      },
      //quận huyện
      district: {
        type: String,
        required: true,
        trim: true,
        maxLength: 50,
      },
      //tỉnh thành phố
      province: {
        type: String,
        required: true,
        trim: true,
        maxLength: 50,
      },
      /**
       * Cho phép mua hàng không đăng nhập
       * Do vậy ko yêu cầu pass
       * Nếu có pass thì validate
       */
      password: {
        type: String,
        required: false,
        trim: true,
        minLength: 8,
        validate: {
          validator: function (v: string) {
            return /^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[@!*%$#]).{8,}$/.test(v);
          },
          message: (props) => `${props.value} is not a valid password!`,
        },
      },
      isEmailVerified: {
        type: Boolean,
        enum: ['true', 'false'],
        default: false,
      },
      sort: {
        type: Number,
        default: 50,
        min: 1
      },
      isActive: {
        type: Boolean,
        default: true,
        enum: ['true', 'false']
      }
    },
    { 
      timestamps: true 
    }
);

//Đăng ký một phương thức để so sánh mật khẩu
customerSchema.method('comparePassword', function comparePassword(candidatePassword: string) {
  return bcrypt.compare(candidatePassword, this.password);
});


//Đăng ký middleware
customerSchema.pre('save', function (next) {
  var customer = this;

  // only hash the password if it has been modified (or is new)
  if (!customer.isModified('password')) return next();

  /**
   * Mã hóa mật khẩu mỗi ghi save, update
   */
  bcrypt.genSalt(SALT_WORK_FACTOR, function (err, salt) {
    if (err) return next(err);
    // hash the password using our new salt
    bcrypt.hash(customer.password, salt, function (err, hash) {
      if (err) return next(err);
      // override the cleartext password with the hashed one
      customer.password = hash;
      next();
    });
  });
});


const Customer = model<ICustomer, CustomerModel>('Customer', customerSchema);
export default Customer;