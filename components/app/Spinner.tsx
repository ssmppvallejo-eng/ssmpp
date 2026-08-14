import { FiLoader } from "react-icons/fi";

type SpinnerProps = {
    label?: string;
    className?: string;
};

/** Indicador de carga reutilizable para peticiones cuyo resultado aún no está disponible. */
export default function Spinner({ label = "Cargando…", className = "" }: SpinnerProps) {
    return (
        <div className={`flex items-center gap-3 text-sm text-zinc-600 ${className}`} role="status" aria-live="polite">
            <FiLoader className="size-5 animate-spin text-sky-700" aria-hidden="true" />
            <span>{label}</span>
            <span className="sr-only">Por favor espera.</span>
        </div>
    );
}
