// app/types/index.ts
export interface User {
    id: string;
    email: string;
    name: string;
    type: 'user' | 'freelancer' | 'shop';
    photoURL?: string;
}

export interface AuthModalProps {
    isOpen: boolean;
    onClose: () => void;
    onSignIn: (userType: User['type']) => void;
}

export interface NavbarProps {
    onSignInClick: () => void;
}
