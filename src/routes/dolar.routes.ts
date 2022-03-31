/**
 * Ruta: /api/login
 */

 import { Router } from 'express';
 import { check } from 'express-validator';

import dolar from '../controller/dolar.controller';

 const router = Router();

 router.post(
   '/',
   [
     check('anio', 'Digite el año que desea consultar').isEmpty(),
   ],
   dolar
 );

 export default router;
