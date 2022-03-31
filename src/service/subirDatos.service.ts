import axios from 'axios';

const subirDatosService = async (
  datos: any,
  type: 'dolar' | 'incidencia' = 'incidencia'
) => {
  const headers = {
    'Content-Type': 'application/json',
    'X-Api-Key': process.env.KEY as string,
  };
  const LINK_SUBIR =
    type === 'incidencia'
      ? process.env.LINK_SUBIR
      : process.env.LINK_SUBIR_DOLAR;
  try {
    const a: any = await axios.post(LINK_SUBIR as string, JSON.stringify(datos), {
      headers,
    });
  } catch (error) {
    console.log(error);
  }
};

export { subirDatosService };
