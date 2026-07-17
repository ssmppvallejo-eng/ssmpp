import { Prisma } from "@prisma/client";
import { NextResponse } from "next/server";
import { z } from "zod";

/**
 * Mapea errores comunes del CRUD del catalogo a respuestas HTTP:
 * validacion Zod -> 400, codigo duplicado -> 409, registro en uso -> 409,
 * registro inexistente -> 404. Devuelve null si el error no es reconocido.
 */
export function catalogErrorResponse(error: unknown): NextResponse | null {
    if (error instanceof z.ZodError) {
        return NextResponse.json({
            error: "Error de validación",
            details: error.issues,
        }, { status: 400 });
    }

    if (error instanceof Prisma.PrismaClientKnownRequestError) {
        if (error.code === "P2002") {
            return NextResponse.json({
                message: "Ya existe un registro con ese código",
            }, { status: 409 });
        }
        if (error.code === "P2003") {
            return NextResponse.json({
                message: "No se puede eliminar: el registro tiene elementos asociados o está en uso en asignaciones",
            }, { status: 409 });
        }
        if (error.code === "P2025") {
            return NextResponse.json({ message: "Registro no encontrado" }, { status: 404 });
        }
    }

    return null;
}
