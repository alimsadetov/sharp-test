import * as path from 'path';

export const APP_ROOT = path.resolve(__dirname, '..', '..');
export const STATIC_DIR = path.resolve(APP_ROOT, 'static');
export const PORT = 'PORT';
export const PROXY = 'PROXY';
export const PROTOCOL_STR = 'PROTOCOL_STR';
export const DOMAIN_STR = 'DOMAIN_STR';1
export const IMAGES_DIR = "IMAGES_DIR"
export const BLUR_STRENGTH = 'BLUR_STRENGTH'

export default () => ({
  [PORT]: process.env[PORT] || 3000,
  [PROXY]: process.env[PROXY] || '',
  [PROTOCOL_STR]: process.env.PROTOCOL_STR || `http`,
  [DOMAIN_STR]: process.env.DOMAIN_STR || `localhost`,
  [IMAGES_DIR]: process.env[IMAGES_DIR] || 'images',
  [BLUR_STRENGTH]: process.env[BLUR_STRENGTH] || 5
});
