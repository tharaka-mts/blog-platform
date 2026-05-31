import { Request, Response, NextFunction } from 'express';

export function errorMiddleware(
  err: any,
  _req: Request,
  res: Response,
  _next: NextFunction
): void {
  console.error('[ERROR]', err.message || err);

  if (Array.isArray(err)) {
    res.status(422).json({ success: false, errors: err });
    return;
  }

  const status: number  = err.status  || 500;
  const message: string = err.message || 'Internal server error.';
  res.status(status).json({ success: false, message });
}
