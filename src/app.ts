import express, { Application } from 'express';
import morgan from 'morgan';
import indexRoutes from './routes/index.routes';
import authRoutes from './routes/auth.routes';
import cors from 'cors';
import dotenv from 'dotenv';

dotenv.config();

export class App {
  private app: Application;

  constructor(private port?: number) {
    this.app = express();
    this.settings();
    this.middlewares();
    this.routes();
  }

  settings() {
    this.app.set('port', this.port || process.env.PORT || 3000);
  }

  middlewares() {
    this.app.use(morgan('dev'));
    this.app.use(express.json());
    this.app.use(cors());
  }

  routes() {
    this.app.use(indexRoutes);
    this.app.use('/auth/login', authRoutes);
  }

  async listen(): Promise<void> {
    await this.app.listen(this.app.get('port'));
    console.log('Servidor ejecutando en el puerto:', this.app.get('port'));
  }
}
