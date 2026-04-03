import 'next-auth';
import { UserRole } from '@prisma/client';

declare module 'next-auth' {
  interface User {
    id: string;
    role: UserRole;
    first_name: string;
    last_name: string;
    must_change_password?: boolean;
    is_active?: boolean;
  }

  interface Session {
    user: User & {
      id: string;
      role: UserRole;
      first_name: string;
      last_name: string;
      must_change_password?: boolean;
    };
  }
}

declare module 'next-auth/jwt' {
  interface JWT {
    id: string;
    role: UserRole;
    first_name: string;
    last_name: string;
    must_change_password?: boolean;
  }
}
