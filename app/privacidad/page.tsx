import type { Metadata } from "next";
import LegalPage, { LegalSection } from "../../components/legal/LegalPage";

export const metadata: Metadata = {
  title: "Política de privacidad | SICVPP-BUAP",
  description: "Política de privacidad del sistema SICVPP-BUAP.",
};

export default function PrivacyPage() {
  return (
    <LegalPage
      eyebrow="Información legal"
      title="Política de privacidad"
      description="Esta política explica qué información utiliza SICVPP-BUAP, para qué se utiliza y qué opciones tienen sus usuarios."
    >
      <LegalSection title="1. Responsable y alcance">
        <p>
          SICVPP-BUAP es un sistema para apoyar la evaluación de la pertinencia de programas de
          posgrado. Esta política se aplica a la información tratada al acceder y utilizar el sitio
          disponible en vvallejo.net.
        </p>
        <p>
          Para consultas relacionadas con privacidad puede escribir a{" "}
          <a className="font-medium text-sky-700 hover:underline" href="mailto:ssmppvallejo@gmail.com">
            ssmppvallejo@gmail.com
          </a>.
        </p>
      </LegalSection>

      <LegalSection title="2. Información que se recopila">
        <p>Dependiendo del uso del sistema, se puede tratar la siguiente información:</p>
        <ul className="list-disc space-y-2 pl-6">
          <li>Nombre, dirección de correo electrónico e imagen de perfil proporcionados por Google al iniciar sesión.</li>
          <li>Rol, estado de autorización y relación con programas de posgrado dentro del sistema.</li>
          <li>Asignaciones, respuestas, evaluaciones, observaciones y avances registrados por el usuario.</li>
          <li>Archivos de evidencia que el usuario decida cargar.</li>
          <li>Datos técnicos básicos necesarios para mantener la sesión, proteger el acceso y diagnosticar errores.</li>
        </ul>
        <p>
          El inicio de sesión con Google no concede al sistema acceso a la contraseña de la cuenta ni,
          de manera predeterminada, a Gmail, Drive, contactos u otros servicios de Google.
        </p>
      </LegalSection>

      <LegalSection title="3. Finalidades del tratamiento">
        <p>La información se utiliza para:</p>
        <ul className="list-disc space-y-2 pl-6">
          <li>Autenticar al usuario y administrar su cuenta, rol y permisos.</li>
          <li>Gestionar instrumentos, asignaciones y procesos de evaluación.</li>
          <li>Conservar evidencias y generar resultados relacionados con las actividades del sistema.</li>
          <li>Prevenir accesos no autorizados, investigar fallos y mantener la seguridad y disponibilidad del servicio.</li>
          <li>Atender solicitudes de soporte o privacidad.</li>
        </ul>
        <p>La información no se vende ni se utiliza para publicidad personalizada.</p>
      </LegalSection>

      <LegalSection title="4. Servicios tecnológicos y transferencias">
        <p>
          Para operar el sistema se emplean proveedores de infraestructura y autenticación, entre
          ellos Google para el inicio de sesión, Vercel para el alojamiento de la aplicación y
          Supabase para la infraestructura de base de datos. Estos proveedores pueden procesar datos
          técnicos o personales únicamente en la medida necesaria para prestar sus servicios y de
          acuerdo con sus propias condiciones y políticas.
        </p>
      </LegalSection>

      <LegalSection title="5. Conservación y seguridad">
        <p>
          La información se conserva durante el tiempo necesario para operar el sistema, cumplir sus
          finalidades académicas y administrativas, atender obligaciones aplicables y resolver
          controversias. Se aplican controles razonables de acceso, autenticación y protección de la
          información; sin embargo, ningún sistema conectado a Internet puede garantizar seguridad absoluta.
        </p>
      </LegalSection>

      <LegalSection title="6. Cookies y sesiones">
        <p>
          El sitio utiliza cookies o tecnologías equivalentes estrictamente necesarias para mantener
          la sesión iniciada, proteger el proceso de autenticación y recordar información esencial de
          funcionamiento. No se emplean para crear perfiles publicitarios.
        </p>
      </LegalSection>

      <LegalSection title="7. Derechos y solicitudes">
        <p>
          El usuario puede solicitar información sobre sus datos, así como su acceso, corrección,
          actualización, oposición o eliminación cuando resulte procedente. También puede revocar el
          acceso de la aplicación desde la configuración de seguridad de su cuenta de Google.
        </p>
        <p>
          Para presentar una solicitud, escriba a{" "}
          <a className="font-medium text-sky-700 hover:underline" href="mailto:ssmppvallejo@gmail.com">
            ssmppvallejo@gmail.com
          </a>{" "}
          indicando su nombre, correo asociado y una descripción clara de lo solicitado. Podrá pedirse
          información adicional para comprobar la identidad del solicitante.
        </p>
      </LegalSection>

      <LegalSection title="8. Cambios a esta política">
        <p>
          Esta política puede actualizarse para reflejar cambios funcionales, operativos o legales.
          La versión vigente se publicará en esta misma página con su fecha de actualización.
        </p>
      </LegalSection>
    </LegalPage>
  );
}
