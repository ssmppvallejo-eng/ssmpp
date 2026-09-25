import type { Metadata } from "next";
import LegalPage, { LegalSection } from "../../components/legal/LegalPage";

export const metadata: Metadata = {
  title: "Términos y condiciones | SICVPP-BUAP",
  description: "Términos y condiciones de uso del sistema SICVPP-BUAP.",
};

export default function TermsPage() {
  return (
    <LegalPage
      eyebrow="Información legal"
      title="Términos y condiciones"
      description="Estos términos establecen las reglas para acceder y utilizar SICVPP-BUAP."
    >
      <LegalSection title="1. Aceptación de los términos">
        <p>
          Al iniciar sesión o utilizar SICVPP-BUAP, el usuario reconoce que ha leído y acepta estos
          términos y la Política de privacidad. Si no está de acuerdo, deberá abstenerse de utilizar el sistema.
        </p>
      </LegalSection>

      <LegalSection title="2. Finalidad del servicio">
        <p>
          SICVPP-BUAP proporciona herramientas para administrar instrumentos, asignaciones, evidencias
          y evaluaciones relacionadas con la pertinencia de programas de posgrado. La disponibilidad de
          funciones depende del rol y del estado de autorización asignados a cada cuenta.
        </p>
      </LegalSection>

      <LegalSection title="3. Registro, acceso y cuentas">
        <ul className="list-disc space-y-2 pl-6">
          <li>El acceso se realiza mediante una cuenta de Google válida.</li>
          <li>El usuario debe proporcionar información auténtica y mantener segura su cuenta de Google.</li>
          <li>Una autenticación correcta no garantiza acceso inmediato: una cuenta puede quedar pendiente de autorización.</li>
          <li>Los roles y permisos son asignados por los administradores del sistema y no deben eludirse.</li>
          <li>El usuario es responsable de las acciones realizadas durante su sesión y debe cerrarla en equipos compartidos.</li>
        </ul>
      </LegalSection>

      <LegalSection title="4. Uso permitido">
        <p>El usuario se compromete a utilizar el sistema únicamente para fines académicos y administrativos autorizados. Queda prohibido:</p>
        <ul className="list-disc space-y-2 pl-6">
          <li>Acceder o intentar acceder a información, funciones o cuentas sin autorización.</li>
          <li>Cargar archivos maliciosos, ilícitos, engañosos o que vulneren derechos de terceros.</li>
          <li>Alterar, interferir, automatizar abusivamente o afectar la disponibilidad o seguridad del servicio.</li>
          <li>Compartir información confidencial obtenida mediante el sistema fuera de los fines autorizados.</li>
          <li>Suplantar identidades o presentar como propia información que no corresponda al usuario.</li>
        </ul>
      </LegalSection>

      <LegalSection title="5. Contenido y evidencias">
        <p>
          El usuario conserva la responsabilidad sobre los datos, textos y archivos que aporte. Al
          cargarlos, declara contar con autorización suficiente para utilizarlos y permite su
          procesamiento dentro del sistema para cumplir las finalidades de evaluación correspondientes.
          No deberá incluir información personal sensible o confidencial que no sea estrictamente necesaria.
        </p>
      </LegalSection>

      <LegalSection title="6. Disponibilidad y modificaciones">
        <p>
          Se procurará mantener el servicio disponible y correcto, pero pueden existir interrupciones
          por mantenimiento, actualizaciones, fallos técnicos o causas externas. Las funciones y estos
          términos podrán actualizarse cuando sea necesario; la versión vigente estará disponible en este sitio.
        </p>
      </LegalSection>

      <LegalSection title="7. Suspensión o cancelación">
        <p>
          El acceso podrá limitarse o suspenderse cuando exista uso indebido, riesgo de seguridad,
          incumplimiento de estos términos, pérdida de la autorización académica o administrativa, o
          cuando sea necesario para proteger a los usuarios y al sistema.
        </p>
      </LegalSection>

      <LegalSection title="8. Responsabilidad">
        <p>
          El sistema es una herramienta de apoyo. Las decisiones académicas o administrativas deben ser
          revisadas y adoptadas por las personas responsables conforme a los procedimientos aplicables.
          En la medida permitida por la normativa aplicable, no se garantiza que el servicio esté libre
          de interrupciones o errores en todo momento.
        </p>
      </LegalSection>

      <LegalSection title="9. Contacto">
        <p>
          Para dudas sobre estos términos o para reportar un uso indebido, escriba a{" "}
          <a className="font-medium text-sky-700 hover:underline" href="mailto:ssmppvallejo@gmail.com">
            ssmppvallejo@gmail.com
          </a>.
        </p>
      </LegalSection>
    </LegalPage>
  );
}
