import { supabase } from "@/lib/supabase";
import { redirect } from "@tanstack/react-router";
import { redirectByRole } from "@utils/redirect";

interface AuthSuccessResponse {
    [key: string]: any;
}

export const authMiddleware = async (pathname: string): Promise<AuthSuccessResponse | null> => {
    const { data: { session }, error: sessionError } = await supabase.auth.getSession();

    const isPublicPath = ["/", "/login", "/signup", "/register", "/auth/callback"].includes(pathname);

    if (sessionError || !session) {
        if (isPublicPath) return null;
        throw redirect({ to: "/", search: { redirect: pathname } });
    }

    const userId = session.user.id;
    let { data: user } = await supabase.from('users').select('role').eq('id', userId).single();
    let role = user?.role;

    if (!user) {
        const metadata = session.user.user_metadata || {};
        const userProfile = {
            id: userId,
            email: session.user.email,
            firstname: metadata.firstname || 'User',
            lastname: metadata.lastname || '',
            phone: metadata.phone || null,
            address: metadata.address || null,
            city: metadata.city || null,
            zipcode: metadata.zipcode || null,
            role: 'customer',
        };

        const { error: insertError } = await supabase.from('users').insert(userProfile);
        if (insertError) console.error(insertError);
        role = 'customer';
    }

    const resolvedRole = role || 'customer';
    const homePath = redirectByRole(resolvedRole);
    const elevated = ['admin', 'manager', 'staff'].includes(resolvedRole);

    if (isPublicPath) {
        throw redirect({ to: homePath });
    }

    if (pathname.startsWith("/dashboard") && !elevated) {
        throw redirect({ to: homePath });
    }

    return { token: session.access_token, role: resolvedRole };
};
