import * as path from 'path';

export const handlerPath = (context: string): string => {
  const relative = path.relative(process.cwd(), context);
  return relative.replace(/\\/g, '/');
};
