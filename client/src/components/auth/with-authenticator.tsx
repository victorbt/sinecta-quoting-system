// with-authenticator.tsx
'use client';

import React, { ComponentType, PropsWithChildren } from 'react';
import { useAuth, Role } from '../../contexts/auth/jwt-context';

export type WithJwtOptions = {
    SignInComponent?: ComponentType;
    LoadingComponent?: ComponentType;
    ForbiddenComponent?: ComponentType;
    requireRole?: Role | Role[];
};

export function withJwtAuthenticator<P extends object>(
    Wrapped: ComponentType<P>,
    options: WithJwtOptions = {}
): ComponentType<P> {
    const {
        SignInComponent = DefaultSignIn,
        LoadingComponent = DefaultLoading,
        ForbiddenComponent = DefaultForbidden,
        requireRole,
    } = options;

    const Guarded: React.FC<P> = (props: PropsWithChildren<P>) => {
        const { isInitialized, isAuthenticated, user } = useAuth();

        // // 1) Aún cargando estado de sesión: no decidas todavía
        // if (isInitialized) return <LoadingComponent />;

        // 2) Sin sesión: muestra el SignIn embebido (BYO backend)
        if (!isAuthenticated) return <SignInComponent />;

        // 3) Con sesión pero sin rol requerido: 403
        // if (requireRole) {
        //   const need = Array.isArray(requireRole) ? requireRole : [requireRole];
        //   if (!user || !need.includes(user.role)) {
        //     return <ForbiddenComponent />;
        //   }
        // }

        // 👇 El cast ayuda a JSX cuando P lleva children opcional
        return <Wrapped {...(props as P)} />;
    };

    Guarded.displayName = `withJwtAuthenticator(${Wrapped.displayName || Wrapped.name || 'Component'})`;
    return Guarded;
}

/* --------- Defaults simples (reemplázalos por los tuyos) ---------- */
const DefaultLoading: React.FC = () => <div style={{ padding: 16 }}>Cargando…</div>;

const DefaultForbidden: React.FC = () => (
    <div style={{ padding: 16 }}>
        <h3>Acceso restringido</h3>
        <p>No tienes permisos para ver esta sección.</p>
    </div>
);

const DefaultSignIn: React.FC = () => {
    const { signIn } = useAuth();
    const [email, setEmail] = React.useState('demo@sinecta.dev');
    const [password, setPassword] = React.useState('demo123');
    const [loading, setLoading] = React.useState(false);
    const [error, setError] = React.useState<string | null>(null);

    const onSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError(null);
        setLoading(true);
        try {
            signIn(email, password);
        } catch {
            setError('Credenciales inválidas');
        } finally {
            setLoading(false);
        }
    };

    return (
        <form onSubmit={onSubmit} style={{ display: 'grid', gap: 8, maxWidth: 320, margin: '48px auto' }}>
            <h3>Inicia sesión</h3>
            <input value={email} onChange={(e) => setEmail(e.target.value)} placeholder="Email" />
            <input value={password} onChange={(e) => setPassword(e.target.value)} type="password" placeholder="Password" />
            <button type="submit" disabled={loading}>{loading ? 'Entrando…' : 'Entrar'}</button>
            {error && <small style={{ color: 'crimson' }}>{error}</small>}
        </form>
    );
};
