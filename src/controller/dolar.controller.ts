import dayjs from 'dayjs';
import { Request, Response } from 'express';
import { IAuth } from '../interface/auth.interface';
import { seguridadService } from '../service/seguridad.service';
import { subirDatosService } from '../service/subirDatos.service';
import { dolarService } from '../service/dolar.service';
import {
  ANIO_EMPTY,
  DATA_MAX,
  DAY,
  DAY_INIT,
  ERROR_SERVIDOR,
  MES_FIN,
  MES_INIT,
} from '../utils/constantes';

dayjs.locale('es');

const dolar = async (req: Request, res: Response) => {

  const auth: IAuth = <any>req.body;

  if (!auth.anio) {
    res.status(500).json({
      ok: false,
      msg: ANIO_EMPTY,
    });
  }

  let datosFull: any[] = [];

  try {
    let dia = auth.dia ? auth.dia : DAY_INIT;
    let mesInicio = auth.mes ? auth.mes : MES_INIT;
    let mesFin = auth.mes ? auth.mes : MES_FIN;
    let fechaInicioString = `${auth.anio}-${mesInicio}-${dia}`;

    const today = dayjs()
    let diasMes = dayjs(fechaInicioString).daysInMonth();

    let fechaFinString = `${auth.anio}-${mesFin}-${
      auth.dia ? auth.dia : diasMes
    }`;

    let fechaInicio = dayjs(fechaInicioString);

    let fechaFin = dayjs(fechaFinString);

    let arrEnviar: any = [];

    while (fechaInicio <= fechaFin) {
      if (fechaInicio.diff(today) <= 0) {
        const responseSeguridad = await dolarService(
          fechaInicio.format('YYYY-MM-DD')
        );
        fechaInicio = fechaInicio.add(1, DAY);
        datosFull = [...datosFull, responseSeguridad];
      }else {
        break
      }
    }

    for (let i = 0; i < datosFull.length; i++) {
      arrEnviar.push(datosFull[i]);
      if (i > 0 && i % DATA_MAX == 0) {
        await subirDatosService(arrEnviar,'dolar');
        arrEnviar = [];
      } else if (i == datosFull.length - 1) {
        await subirDatosService(arrEnviar,'dolar');
      }
    }

    res.status(200).json({
      ok: true,
      tamano: JSON.stringify(datosFull).length,
      data: datosFull,
    });
  } catch (error) {

    res.status(500).json({
      ok: false,
      msg: ERROR_SERVIDOR,
    });
  }
};

export default dolar;
