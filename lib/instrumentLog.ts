import { prisma } from "./prisma";
import { Session } from "next-auth";

type EntityType = "DIMENSION" | "COMPONENT" | "JUDGEMENT" | "INDICATOR" | "DESCRIPTOR";
type Action = "CREATE" | "UPDATE" | "DELETE";

interface LogInstrumentEditInput {
    session: Session;
    entityType: EntityType;
    entityId: number;
    entityCode?: string | null;
    action: Action;
    changes?: Record<string, unknown>;
}

/**
 * Bitacora de cambios al instrumento (dimensiones, componentes, criterios,
 * indicadores, descriptores). Se guarda "best effort": un fallo al escribir
 * el log nunca debe tumbar la operacion de CRUD que lo origino.
 */
export async function logInstrumentEdit(input: LogInstrumentEditInput): Promise<void> {
    try {
        await prisma.instrumentEditLog.create({
            data: {
                entityType: input.entityType,
                entityId: input.entityId,
                entityCode: input.entityCode ?? null,
                action: input.action,
                changes: input.changes ? JSON.parse(JSON.stringify(input.changes)) : undefined,
                userId: input.session.user.id,
                userEmail: input.session.user.email,
            },
        });
    } catch (error) {
        console.error("Error writing instrument edit log:", error);
    }
}
