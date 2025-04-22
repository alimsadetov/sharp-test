import { Inject, Injectable, LoggerService, Scope } from '@nestjs/common';

type LogAdditionalInfo = {
  [key: string]: number | string | boolean;
};
const logger = console;

@Injectable({ scope: Scope.TRANSIENT })
export class CustomLoggerService implements LoggerService {
  private service: string;
  constructor() {}

  setContext(serviceName: string) {
    this.service = serviceName;
  }

  private getMessage(
    msg: string,
    level: 'error' | 'info' | 'warn',
    additional?: LogAdditionalInfo,
  ) {
    return JSON.stringify({
      ...additional,
      msg,
      level,
      service: this.service,
      time: new Date().toISOString(),
    });
  }

  error(msg: string, additional?: LogAdditionalInfo | string): any {
    logger.error(
      this.getMessage(
        msg,
        'error',
        typeof additional == 'string'
          ? { context: String(additional) }
          : additional,
      ),
    );
  }

  log(msg: string, additional?: LogAdditionalInfo | string): any {
    logger.info(
      this.getMessage(
        msg,
        'info',
        typeof additional == 'string'
          ? { context: String(additional) }
          : additional,
      ),
    );
  }

  warn(msg: string, additional?: LogAdditionalInfo | string): any {
    logger.warn(
      this.getMessage(
        msg,
        'warn',
        typeof additional == 'string'
          ? { context: String(additional) }
          : additional,
      ),
    );
  }
}
