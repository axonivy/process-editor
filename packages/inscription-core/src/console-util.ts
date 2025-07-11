/* eslint-disable @typescript-eslint/no-explicit-any */
export function logIf(condition?: boolean, message?: any, ...optionalParams: any[]): void {
  if (condition) {
    console.log(message, ...optionalParams);
  }
}

export function timeIf(condition?: boolean, label?: string): void {
  if (condition) {
    console.time(label);
  }
}

export function timeEndIf(condition?: boolean, label?: string): void {
  if (condition) {
    console.timeEnd(label);
  }
}

export function timeLogIf(condition?: boolean, label?: string, ...data: any[]): void {
  if (condition) {
    console.timeLog(label, ...data);
  }
}

export class ConsoleTimer {
  constructor(
    protected condition: boolean | undefined,
    protected label: string
  ) {}

  log(message?: any, ...optionalParams: any[]) {
    logIf(this.condition, message, ...optionalParams);
  }

  start(): ConsoleTimer {
    timeIf(this.condition, this.label);
    return this;
  }

  step(...data: any[]): ConsoleTimer {
    timeLogIf(this.condition, this.label, ...data);
    return this;
  }

  end(): ConsoleTimer {
    timeEndIf(this.condition, this.label);
    return this;
  }
}
