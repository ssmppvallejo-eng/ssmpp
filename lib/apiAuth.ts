import { getServerSession } from "next-auth";
import { NextResponse } from "next/server";
import { Session } from "next-auth";
import { authOptions } from "./auth";
import { AccessStatus, Role } from "../src/core/domain/entities/User";

type SessionResult =
    | { session: Session; error: null }
    | { session: null; error: NextResponse };

/**
 * Valida que exista sesion, que la cuenta este aprobada y, opcionalmente,
 * que el usuario tenga alguno de los roles permitidos.
 */
export async function requireApprovedSession(allowedRoles?: Role[]): Promise<SessionResult> {
    const session = await getServerSession(authOptions);

    if (!session) {
        return {
            session: null,
            error: NextResponse.json({ message: "Unauthorized" }, { status: 401 }),
        };
    }

    if (session.user.accessStatus !== AccessStatus.APROBADO) {
        return {
            session: null,
            error: NextResponse.json({ message: "Forbidden: cuenta no aprobada" }, { status: 403 }),
        };
    }

    if (allowedRoles && !allowedRoles.includes(session.user.role as Role)) {
        return {
            session: null,
            error: NextResponse.json({ message: "Forbidden" }, { status: 403 }),
        };
    }

    return { session, error: null };
}
