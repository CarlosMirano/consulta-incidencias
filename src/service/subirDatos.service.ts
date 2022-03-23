import axios from 'axios';

const subirDatosService = async (datos: any) => {
  const headers = {
    'Content-Type': 'application/json',
    'X-Api-Key': process.env.KEY as string,
  };
  try {
    const a: any = await axios.post(
      process.env.LINK_SUBIR as string,
      JSON.stringify(datos),
      { headers }
    );
  } catch (error) {
    console.log(error);
  }
};

export { subirDatosService };
