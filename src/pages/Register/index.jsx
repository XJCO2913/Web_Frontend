// import { useDispatch } from 'react-redux';
// import { useNavigate } from 'react-router-dom';
// import { Form, Input, Select, DatePicker, Checkbox, Button, Card, message } from 'antd';
// import { fetchRegister } from '@/store/modules/user';
// import { CityCascader } from '@/components/cityCascader/index'
// import moment from 'moment';
// import logo from '@/assets/logo.png';

// const { Option } = Select;
// const Register = () => {
//     const dispatch = useDispatch();
//     const navigate = useNavigate();
//     const [form] = Form.useForm();

//     const onFinish = async (formValues) => {
//         const genderValue = formValues.gender === 'male' ? 0 : formValues.gender === 'female' ? 1 : 2;
//         const birthdayValue = formValues.birthday ? moment(formValues.birthday).format('YYYY-MM-DD') : '';
//         const [province, city] = formValues.location || [];

//         // Combine province and city in the format "Province-City".
//         const locationFormatted = `${province}-${city}`;
//         // If one of the province and city is null, use the empty string
//         const regionValue = (province && city) ? locationFormatted : '';

//         const signUpForm = {
//             ...formValues,
//             gender: genderValue,
//             birthday: birthdayValue,
//             region: regionValue,
//         };

//         await dispatch(fetchRegister(signUpForm));
//         navigate('/login');
//         message.success('Register Successfully');
//     };

//     return (
//         <div className="register">
//             <Card className="register-container">
//                 <img className="register-logo" src={logo} alt="Logo" />
//                 <Form form={form} onFinish={onFinish} validateTrigger='onBlur'>
//                     <Form.Item
//                         name="username"
//                         rules={[
//                             { required: true, message: 'Please enter your username' }
//                         ]}>
//                         <Input size="large" placeholder="Username" />
//                     </Form.Item>

//                     <Form.Item
//                         name="password"
//                         rules={[
//                             { required: true, message: 'Please enter your password' }
//                         ]}>
//                         <Input.Password size="large" placeholder="Password" />
//                     </Form.Item>

//                     <Form.Item
//                         name="gender"
//                         rules={[
//                             { required: true, message: 'Please select your gender' }
//                         ]}>
//                         <Select size="large" placeholder="Select your gender">
//                             <Option value="male">Male</Option>
//                             <Option value="female">Female</Option>
//                         </Select>
//                     </Form.Item>

//                     <Form.Item
//                         name="birthday"
//                         rules={[
//                             { required: true, message: 'Please input your birthday' }
//                         ]}>
//                         <DatePicker size="large" style={{ width: '100%' }} />
//                     </Form.Item>

//                     <Form.Item
//                         name="location"
//                         label="Location"
//                     >
//                         <CityCascader onChange={(value) => {
//                             form.setFieldsValue({ location: value });
//                         }} />

//                     </Form.Item>

//                     <Form.Item>
//                         <Checkbox className="register-checkbox-label">
//                             I have read and agree to the 「User Agreement」 and 「Privacy Policy」.
//                         </Checkbox>
//                     </Form.Item>

//                     <Form.Item>
//                         <Button type="primary" htmlType="submit" size="large" block>
//                             Sign Up
//                         </Button>
//                     </Form.Item>
//                 </Form>
//             </Card>
//         </div>
//     );
// };

// export default Register; 