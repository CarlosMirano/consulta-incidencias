import dayjs from 'dayjs';
import { Request, Response } from 'express';
import { validationResult } from 'express-validator';
import { IAuth } from '../interface/auth.interface';
import { authService } from '../service/auth.service';
import { seguridadService } from '../service/seguridad.service';
import { subirDatosService } from '../service/subirDatos.service';
import {
  ANIO_EMPTY,
  DATA_MAX,
  DAY,
  DAY_INIT,
  ERROR_SERVIDOR,
  MES_FIN,
  MES_INIT,
  NO_TOKEN,
} from '../utils/constantes';

dayjs.locale('es');

const login = async (req: Request, res: Response) => {
  const auth: IAuth = <any>req.body;

  if (!auth.anio) {
    res.status(500).json({
      ok: false,
      msg: ANIO_EMPTY,
    });
  }

  let datosFull: any[] = [];

  try {
    const token = await authService(auth);

    let dia = auth.dia ? auth.dia : DAY_INIT;
    let mesInicio = auth.mes ? auth.mes : MES_INIT;
    let mesFin = auth.mes ? auth.mes : MES_FIN;
    let fechaInicioString = `${auth.anio}-${mesInicio}-${dia}`;

    let diasMes = dayjs(fechaInicioString).daysInMonth();

    let fechaFinString = `${auth.anio}-${mesFin}-${
      auth.dia ? auth.dia : diasMes
    }`;

    let fechaInicio = dayjs(fechaInicioString);
    let fechaFin = dayjs(fechaFinString);

    let arrEnviar: any = [];

    if (token) {
      while (fechaInicio <= fechaFin) {
        const responseSeguridad = await seguridadService(fechaInicio, token);
        fechaInicio = fechaInicio.add(1, DAY);
        datosFull = [...datosFull, ...responseSeguridad.data];
      }

      for (let i = 0; i < datosFull.length; i++) {
        arrEnviar.push(datosFull[i]);
        if (i > 0 && i % DATA_MAX == 0) {
          await subirDatosService(arrEnviar);
          arrEnviar = [];
        } else if (i == datosFull.length - 1) {
          await subirDatosService(arrEnviar);
        }
      }

      res.status(200).json({
        ok: true,
        tamano: JSON.stringify(datosFull).length,
        data: datosFull,
      });
    } else {
      res.status(401).json({
        ok: true,
        msg: NO_TOKEN,
      });
    }
  } catch (error) {
    res.status(500).json({
      ok: false,
      msg: ERROR_SERVIDOR,
    });
  }
};

export default login;
