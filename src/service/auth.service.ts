import axios from 'axios';
import { IAuth } from '../interface/auth.interface';

const authService = async (auth: IAuth) => {
  const a: any = await axios.post(process.env.LOGIN as string, auth);
  let token = a.data['sesion']['token'];
  return token;
};

export { authService };
