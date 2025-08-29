import { bootstrapApplication } from '@angular/platform-browser';
import { AppCmp } from './app/app';
import { config } from './app/app.config.server';

const bootstrap = () => bootstrapApplication(AppCmp, config);

export default bootstrap;
