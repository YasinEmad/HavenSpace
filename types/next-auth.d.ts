import { DefaultSession } from 'next-auth';

declare module 'next-auth' {
  interface Session extends DefaultSession {
    user?: DefaultSession['user'] & {
      id?: string;
    };
  }

  interface User {
    id?: string;
  }
}

declare global {
  var mongoose: {
    conn: any;
    promise: Promise<any> | null;
  };
}
