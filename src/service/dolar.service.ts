import axios from 'axios';

const dolarService = async (fecha: any) => {
  const a: any = await axios.get(
    `${process.env.DOLAR}?fecha=${fecha}` as string,
  );
  return a.data;
};

export { dolarService };
  