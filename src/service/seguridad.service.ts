import axios from 'axios';

const seguridadService = async (fecha: any, token: any) => {
  const headers = {
    'Content-Type': 'application/json',
    'x-access-token': token,
  };
  const a: any = await axios.post(
    process.env.DATOS as string,
    { fecha: fecha },
    { headers }
  );
  return a.data;
};

export { seguridadService };
