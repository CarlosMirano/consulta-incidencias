/**
 * Ruta: /api/login
 */

import { Router } from 'express';
import { check } from 'express-validator';

import login from '../controller/auth.controller';

const router = Router();

router.post(
  '/',
  [
    check('u', 'Digite el correo electrónico').isEmail(),
    check('p', 'Digite la contraseña').not().isEmpty(),
    check('anio', 'Digite el año que desea consultar').isEmpty(),
  ],
  login
);


export default router;
