// types.ts or a relevant file
export interface UserRole {
    role: string;
    permissions: any[]; // Adjust the type based on the structure of permissions
  }
  
  export interface User {
    id: string;
    userName: string;
    email: string;
    phoneNumber: string | null; // Assuming phoneNumber can be null
    roles: UserRole[];
  }
  
  export interface UsersProps {
    users: User[];
  }
  