import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();
const email = process.argv[2]?.trim().toLowerCase();
const confirmed = process.argv.includes("--confirm");

function fail(message) {
  console.error(message);
  process.exitCode = 1;
}

async function main() {
  if (!email || !/^\S+@\S+\.\S+$/.test(email)) {
    fail("Uso: pnpm db:admin usuario@dominio.com --confirm");
    return;
  }

  if (!confirmed) {
    fail(
      `No se modificó ${email}. Repite con --confirm para asignar ADMINISTRADOR y APROBADO.`,
    );
    return;
  }

  const existing = await prisma.user.findUnique({
    where: { email },
    select: { id: true, email: true, role: true, accessStatus: true },
  });

  if (!existing) {
    fail(
      `No existe el usuario ${email}. Debe iniciar sesión con Google una vez antes de promoverlo.`,
    );
    return;
  }

  if (existing.role === "ADMINISTRADOR" && existing.accessStatus === "APROBADO") {
    console.log(`${email} ya es un administrador aprobado; no hubo cambios.`);
    return;
  }

  await prisma.user.update({
    where: { email },
    data: { role: "ADMINISTRADOR", accessStatus: "APROBADO" },
  });

  console.log(`${email} fue promovido a ADMINISTRADOR y APROBADO.`);
}

main()
  .catch((error) => {
    console.error("No se pudo promover al administrador:", error);
    process.exitCode = 1;
  })
  .finally(() => prisma.$disconnect());
