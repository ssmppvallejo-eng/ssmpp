import Image from "next/image";
import Navbar from "../../components/landing/Navbar";
import {
    FiArrowUpRight,
    FiBarChart2,
    FiBookOpen,
    FiBriefcase,
    FiExternalLink,
    FiMail,
    FiMapPin,
    FiPhone,
    FiPlayCircle,
    FiSearch,
} from "react-icons/fi";
import { FaLinkedinIn, FaResearchgate } from "react-icons/fa";
import { SiGooglescholar, SiOrcid } from "react-icons/si";

const academicGrades = [
    "Doctorado en Administración",
    "Maestría en Administración y Gestión de Instituciones Educativas",
    "Licenciatura en Administración Turística",
    "Carrera Técnica en Computación y Procesamiento de Datos",
];

const professionalExperience = [
    "Profesor colaborador en la Facultad de Administración.",
    "Coordinador del Centro de Sistematización de Información del Posgrado de la Secretaría de Investigación y Estudios de Posgrado de la Facultad de Administración, desde el 3 de enero de 2018.",
    "Aerohive Certified Wireless Administrator, 2015.",
    "Administrador de Laboratorios de Cómputo de Licenciaturas y Posgrados de la Facultad de Ciencias Físico Matemáticas de la Benemérita Universidad Autónoma de Puebla, del 15 de febrero de 2002 al 1 de febrero de 2008.",
];

const academicNetworks = [
    { name: "Google Académico", href: "#", icon: SiGooglescholar },
    { name: "ResearchGate", href: "#", icon: FaResearchgate },
    { name: "ORCID", href: "#", icon: SiOrcid },
    { name: "LinkedIn", href: "https://www.linkedin.com/in/jvmvallejo/", icon: FaLinkedinIn },
];

const articles = [
    {
        year: "2024",
        citation:
            "Medina, J. C., López, N. A. S., Terrón, M. E. P., & Vallejo Córdoba, J. V. M. Kaizen: Improving Productivity and Reducing Waste in a Manufacturing Company: a Practical Case Study. International Journal of Professional Business Review, 9(1), e04241.",
        href: "https://doi.org/10.26668/businessreview/2024.v9i1.4241",
    },
    {
        year: "2023",
        citation:
            "Machado Durán, María Teresa, & Vallejo Córdoba, José Víctor Manuel. Perspectivas teóricas para un enfoque dialógico de la acreditación de posgrado en México. Humanidades Médicas, 23(2).",
        href: "http://scielo.sld.cu/scielo.php?script=sci_arttext&pid=S1727-81202023000200009&lng=es&tlng=pt",
    },
    {
        year: "2015",
        citation:
            "Vallejo Víctor, Santiesteban-López Angélica, Acle Ramón y Pérez María Elena. A proposal for a postgraduate education program in Tourism based on an integrated curriculum mode. UTSOE Journal Multidisciplinary Science, 2(4), 224-235.",
        href: "#",
    },
];

const bookChapters = [
    {
        label: "Capítulo 2",
        citation:
            "Atributos turísticos de los pueblos mágicos de Puebla - México. En D. B. Tapias Molina y V. H. Meriño Córdoba, Gestión del Conocimiento. Perspectiva Multidisciplinaria, Vol. 64, pp. 64-89. Fondo Editorial de la Universidad Nacional Experimental Sur del Lago Jesús María Semprum.",
        href: "https://doi.org/10.59899/Ges-cono-64-C2",
    },
    {
        label: "Capítulo 17",
        citation:
            "La importancia de los corredores gastronómicos como atractivo turístico. Caso Puebla-Atlixco - México, pp. 319-335. En Gestión del Conocimiento. Perspectiva Multidisciplinaria, Vol. 51, Colección Unión Global.",
        href: "#",
    },
    {
        label: "Capítulo",
        citation:
            "Mena Ramón Sebastián Acle, J. L. (2023). Nostalgia alimentaria como identidad cultural. En Estudios sobre y desde la frontera, pp. 755-765. Dykinson S. L.",
        href: "https://www.dykinson.com/cart/download/ebooks/18269/",
    },
    {
        label: "Capítulo 12",
        citation:
            "Políticas institucionales para el uso del Portafolio Electrónico a partir de la apreciación de los alumnos de la Facultad de Administración de la BUAP. En Comunidades de aprendizaje y recursos digitales. BUAP, 2017.",
        href: "#",
    },
];

const thesauri = [
    {
        name: "Tesauro UNESCO",
        description:
            "Lista controlada y estructurada de términos para educación, cultura, ciencias naturales, ciencias sociales, comunicación e información.",
        href: "https://vocabularies.unesco.org/browser/thesaurus/es/",
    },
    {
        name: "Tesauro UNBIS",
        description:
            "Tesauro multilingüe del Sistema de Información Bibliográfica de las Naciones Unidas.",
        href: "https://metadata.un.org/thesaurus/?lang=es",
    },
    {
        name: "Library of Congress Subject Headings",
        description:
            "Lista de encabezamientos temáticos y autoridades usada para describir y analizar colecciones.",
        href: "https://id.loc.gov/authorities/subjects.html",
    },
];

const repositories = [
    { name: "CORA TDX", detail: "Tesis Doctorals en Xarxa", href: "https://www.tdx.cat/" },
    { name: "ProQuest", detail: "Tesis y disertaciones en texto completo", href: "https://www.proquest.com/" },
    { name: "NDLTD", detail: "Networked Digital Library of Theses and Dissertations", href: "https://ndltd.org/" },
    { name: "OATD", detail: "Open Access Theses and Dissertations", href: "https://oatd.org/" },
    { name: "ÍNDIXE", detail: "Índice de Tesis Digitales", href: "#" },
    { name: "RI UAEM", detail: "Repositorio Institucional de la UAEM", href: "http://ri.uaemex.mx/" },
    { name: "RDI IPN", detail: "Repositorio Digital Institucional del IPN", href: "https://www.repositoriodigital.ipn.mx/" },
    { name: "Tesis UDLAP", detail: "Colección de tesis digitales", href: "https://catarina.udlap.mx/" },
    { name: "REMERI", detail: "Red Mexicana de Repositorios Institucionales", href: "http://www.remeri.org.mx/" },
];

const aiTools = [
    { name: "Elicit", detail: "Búsqueda y síntesis de literatura científica.", href: "https://elicit.com/" },
    { name: "ResearchRabbit", detail: "Exploración visual de redes de publicaciones.", href: "https://www.researchrabbit.ai/" },
    { name: "Scite", detail: "Análisis de citas y contexto de evidencia.", href: "https://scite.ai/" },
    { name: "Perplexity", detail: "Consulta asistida con fuentes enlazadas.", href: "https://www.perplexity.ai/" },
];

const indicators = [
    { name: "DataMéxico", href: "https://www.economia.gob.mx/datamexico/" },
    { name: "ExportaMx", href: "https://exportamx.economia.gob.mx/" },
    { name: "DENUE INEGI", href: "https://www.inegi.org.mx/app/mapa/denue/" },
    { name: "SIAVI", href: "https://www.economia-snci.gob.mx/" },
    { name: "SIAP - Indicadores económicos", href: "https://www.gob.mx/siap" },
    { name: "SIAP - Producción agrícola", href: "https://nube.siap.gob.mx/cierreagricola/" },
    { name: "SIE BANXICO", href: "https://www.banxico.org.mx/SieInternet/" },
    { name: "NATCAS", href: "https://unstats.un.org/unsd/nationalaccount/" },
    { name: "SIICEX", href: "https://www.siicex.gob.mx/" },
    { name: "OMC", href: "https://www.wto.org/" },
    { name: "SNCI", href: "https://www.economia-snci.gob.mx/" },
    { name: "OEC", href: "https://oec.world/" },
];

export default function Landing() {
    return (
        <main className="min-h-screen bg-white text-zinc-950">
            <Navbar />

            <section id="inicio" className="border-b border-zinc-200 bg-white">
                <div className="mx-auto grid min-h-[calc(100vh-73px)] max-w-7xl items-center gap-12 px-5 py-12 sm:px-8 lg:grid-cols-[1.05fr_0.95fr] lg:px-12">
                    <article className="max-w-3xl">
                        <p className="text-sm font-semibold uppercase text-sky-700">Portafolio académico</p>
                        <h1 className="mt-5 text-5xl font-semibold leading-[1.04] sm:text-6xl lg:text-7xl">
                            José Víctor Manuel Vallejo Córdoba
                        </h1>
                        <p className="mt-6 text-xl leading-8 text-zinc-600">Doctor en Administración</p>
                        <p className="mt-5 max-w-2xl text-base leading-7 text-zinc-600">
                            Docencia, administración, gestión educativa, turismo e investigación aplicada
                            a instituciones de educación superior.
                        </p>
                        <div className="mt-8 flex flex-col gap-3 sm:flex-row">
                            <a
                                href="#acerca"
                                className="inline-flex h-12 items-center justify-center rounded-md bg-zinc-950 px-6 text-sm font-semibold text-white transition hover:bg-sky-800"
                            >
                                Conocer trayectoria
                            </a>
                            <a
                                href="#investigacion"
                                className="inline-flex h-12 items-center justify-center rounded-md border border-zinc-300 px-6 text-sm font-semibold transition hover:border-sky-700 hover:text-sky-800"
                            >
                                Ver investigación
                            </a>
                        </div>
                    </article>

                    <aside className="relative flex min-h-[390px] items-center justify-center lg:min-h-[560px]">
                        <div className="absolute inset-8 border border-zinc-200 bg-stone-100" />
                        <div className="relative grid size-72 place-items-center rounded-full border border-zinc-200 bg-white sm:size-96">
                            <Image src="/logo.svg" alt="Identidad Vallejo" width={260} height={260} className="size-52 sm:size-64" />
                        </div>
                        <div className="absolute bottom-7 right-0 max-w-64 border-l-4 border-sky-700 bg-white px-5 py-4">
                            <p className="text-sm font-semibold">Benemérita Universidad Autónoma de Puebla</p>
                            <p className="mt-1 text-sm leading-5 text-zinc-500">Facultad de Administración</p>
                        </div>
                    </aside>
                </div>
            </section>

            <section id="acerca" className="px-5 py-20 sm:px-8 lg:px-12">
                <div className="mx-auto max-w-7xl">
                    <p className="text-sm font-semibold uppercase text-sky-700">Acerca de mí</p>
                    <h2 className="mt-3 max-w-3xl text-3xl font-semibold leading-tight sm:text-4xl">
                        Formación, experiencia y presencia académica
                    </h2>

                    <div className="mt-10 grid gap-5 lg:grid-cols-3">
                        <article className="rounded-md border border-zinc-200 p-6">
                            <FiBookOpen className="size-7 text-sky-700" />
                            <h3 className="mt-5 text-xl font-semibold">Grados académicos</h3>
                            <ul className="mt-5 divide-y divide-zinc-100">
                                {academicGrades.map((grade) => (
                                    <li key={grade} className="py-3 text-sm leading-6 text-zinc-600">{grade}</li>
                                ))}
                            </ul>
                        </article>

                        <article className="rounded-md border border-zinc-200 p-6">
                            <FiBriefcase className="size-7 text-sky-700" />
                            <h3 className="mt-5 text-xl font-semibold">Experiencia profesional</h3>
                            <ul className="mt-5 divide-y divide-zinc-100">
                                {professionalExperience.map((experience) => (
                                    <li key={experience} className="py-3 text-sm leading-6 text-zinc-600">{experience}</li>
                                ))}
                            </ul>
                        </article>

                        <article className="rounded-md border border-zinc-200 p-6">
                            <FiSearch className="size-7 text-sky-700" />
                            <h3 className="mt-5 text-xl font-semibold">Redes académicas</h3>
                            <div className="mt-5 divide-y divide-zinc-100">
                                {academicNetworks.map(({ name, href, icon: Icon }) => (
                                    <a
                                        key={name}
                                        href={href}
                                        target={href !== "#" ? "_blank" : undefined}
                                        rel={href !== "#" ? "noreferrer" : undefined}
                                        className="flex items-center justify-between py-4 text-sm font-semibold transition hover:text-sky-700"
                                    >
                                        <span className="flex items-center gap-3"><Icon className="size-5 text-sky-700" />{name}</span>
                                        <FiArrowUpRight />
                                    </a>
                                ))}
                            </div>
                        </article>
                    </div>
                </div>
            </section>

            <section id="investigacion" className="bg-zinc-950 px-5 py-20 text-white sm:px-8 lg:px-12">
                <div className="mx-auto max-w-7xl">
                    <p className="text-sm font-semibold uppercase text-sky-300">Investigación</p>
                    <h2 className="mt-3 text-3xl font-semibold sm:text-4xl">Producción académica</h2>

                    <div className="mt-12 grid gap-12 lg:grid-cols-2">
                        <div id="articulos">
                            <h3 className="text-2xl font-semibold">Artículos</h3>
                            <div className="mt-5 divide-y divide-zinc-800 border-t border-zinc-800">
                                {articles.map((article) => (
                                    <article key={article.citation} className="py-6">
                                        <p className="text-xs font-semibold uppercase text-sky-300">{article.year}</p>
                                        <p className="mt-3 text-sm leading-7 text-zinc-300">{article.citation}</p>
                                        <a href={article.href} target="_blank" rel="noreferrer" className="mt-4 inline-flex items-center gap-2 text-sm font-semibold text-sky-300 hover:text-white">
                                            Consultar publicación <FiExternalLink />
                                        </a>
                                    </article>
                                ))}
                            </div>
                        </div>

                        <div id="capitulos">
                            <h3 className="text-2xl font-semibold">Capítulos de libros</h3>
                            <div className="mt-5 divide-y divide-zinc-800 border-t border-zinc-800">
                                {bookChapters.map((chapter) => (
                                    <article key={chapter.citation} className="py-6">
                                        <p className="text-xs font-semibold uppercase text-sky-300">{chapter.label}</p>
                                        <p className="mt-3 text-sm leading-7 text-zinc-300">{chapter.citation}</p>
                                        <a href={chapter.href} target="_blank" rel="noreferrer" className="mt-4 inline-flex items-center gap-2 text-sm font-semibold text-sky-300 hover:text-white">
                                            Ver referencia <FiExternalLink />
                                        </a>
                                    </article>
                                ))}
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            <section id="sitios" className="px-5 py-20 sm:px-8 lg:px-12">
                <div className="mx-auto max-w-7xl">
                    <p className="text-sm font-semibold uppercase text-sky-700">Sitios de interés</p>
                    <h2 className="mt-3 text-3xl font-semibold sm:text-4xl">Fuentes para investigar y documentar</h2>

                    <div id="tesauros" className="mt-12">
                        <h3 className="text-2xl font-semibold">Tesauros</h3>
                        <div className="mt-5 grid gap-4 lg:grid-cols-3">
                            {thesauri.map((item) => (
                                <a key={item.name} href={item.href} target="_blank" rel="noreferrer" className="group rounded-md border border-zinc-200 p-6 transition hover:border-sky-500">
                                    <span className="text-xs font-semibold uppercase text-sky-700">Vocabulario especializado</span>
                                    <h4 className="mt-4 text-lg font-semibold group-hover:text-sky-700">{item.name}</h4>
                                    <p className="mt-3 text-sm leading-6 text-zinc-600">{item.description}</p>
                                    <FiArrowUpRight className="mt-5 text-sky-700" />
                                </a>
                            ))}
                        </div>
                    </div>

                    <div id="repositorios" className="mt-16">
                        <h3 className="text-2xl font-semibold">Repositorios de tesis</h3>
                        <div className="mt-5 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                            {repositories.map((repository) => (
                                <a key={repository.name} href={repository.href} target="_blank" rel="noreferrer" className="group flex min-h-36 flex-col justify-between rounded-md border border-zinc-200 p-5 transition hover:border-sky-500">
                                    <span className="text-xl font-semibold group-hover:text-sky-700">{repository.name}</span>
                                    <span className="mt-4 flex items-end justify-between gap-3 text-sm leading-6 text-zinc-500">
                                        {repository.detail}<FiArrowUpRight className="shrink-0 text-sky-700" />
                                    </span>
                                </a>
                            ))}
                        </div>
                    </div>
                </div>
            </section>

            <section id="tutoriales" className="border-y border-zinc-200 bg-stone-50 px-5 py-20 sm:px-8 lg:px-12">
                <div className="mx-auto grid max-w-7xl gap-10 lg:grid-cols-[0.8fr_1.2fr]">
                    <div>
                        <p className="text-sm font-semibold uppercase text-sky-700">Video tutoriales</p>
                        <h2 className="mt-3 text-3xl font-semibold leading-tight sm:text-4xl">Metodología de investigación</h2>
                        <p className="mt-5 text-sm leading-7 text-zinc-600">
                            Recursos audiovisuales para revisar el método científico, el planteamiento del problema,
                            las fuentes de información y el desarrollo de proyectos.
                        </p>
                    </div>
                    <div className="grid gap-4 sm:grid-cols-2">
                        {["Método científico y tipos de investigación", "Fuentes de información para la investigación"].map((title, index) => (
                            <a key={title} href="#" className="group rounded-md border border-zinc-200 bg-white p-6 transition hover:border-sky-500">
                                <span className="grid size-11 place-items-center rounded-md bg-sky-50 text-sky-700"><FiPlayCircle className="size-6" /></span>
                                <p className="mt-6 text-xs font-semibold uppercase text-zinc-400">Módulo {index + 1}</p>
                                <h3 className="mt-2 text-lg font-semibold group-hover:text-sky-700">{title}</h3>
                            </a>
                        ))}
                    </div>
                </div>
            </section>

            <section id="ia" className="px-5 py-20 sm:px-8 lg:px-12">
                <div className="mx-auto max-w-7xl">
                    <p className="text-sm font-semibold uppercase text-sky-700">Herramientas de IA</p>
                    <h2 className="mt-3 text-3xl font-semibold sm:text-4xl">Apoyo digital para investigación</h2>
                    <div className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
                        {aiTools.map((tool) => (
                            <a key={tool.name} href={tool.href} target="_blank" rel="noreferrer" className="group rounded-md border border-zinc-200 p-5 transition hover:border-sky-500">
                                <h3 className="text-lg font-semibold group-hover:text-sky-700">{tool.name}</h3>
                                <p className="mt-3 text-sm leading-6 text-zinc-600">{tool.detail}</p>
                                <FiArrowUpRight className="mt-5 text-sky-700" />
                            </a>
                        ))}
                    </div>
                </div>
            </section>

            <section id="indicadores" className="bg-zinc-950 px-5 py-20 text-white sm:px-8 lg:px-12">
                <div className="mx-auto max-w-7xl">
                    <div className="flex flex-col gap-5 md:flex-row md:items-end md:justify-between">
                        <div>
                            <p className="text-sm font-semibold uppercase text-sky-300">Indicadores y estadísticas</p>
                            <h2 className="mt-3 text-3xl font-semibold sm:text-4xl">Sistemas de información económica</h2>
                        </div>
                        <FiBarChart2 className="size-10 text-sky-300" />
                    </div>
                    <div className="mt-10 grid gap-px overflow-hidden rounded-md border border-zinc-800 bg-zinc-800 sm:grid-cols-2 lg:grid-cols-4">
                        {indicators.map((indicator) => (
                            <a key={indicator.name} href={indicator.href} target="_blank" rel="noreferrer" className="group flex min-h-24 items-center justify-between gap-4 bg-zinc-950 p-5 transition hover:bg-white hover:text-zinc-950">
                                <span className="text-sm font-semibold">{indicator.name}</span>
                                <FiArrowUpRight className="shrink-0 text-sky-300 group-hover:text-sky-700" />
                            </a>
                        ))}
                    </div>
                </div>
            </section>

            <footer id="contacto" className="bg-white px-5 py-12 sm:px-8 lg:px-12">
                <div className="mx-auto grid max-w-7xl gap-10 border-b border-zinc-200 pb-10 lg:grid-cols-[1fr_auto]">
                    <div>
                        <Image src="/logo.svg" alt="Vallejo" width={64} height={64} className="size-16" />
                        <p className="mt-4 max-w-lg text-sm leading-6 text-zinc-600">
                            Portafolio académico, producción científica y directorio de recursos de investigación.
                        </p>
                    </div>
                    <address className="grid gap-5 not-italic sm:grid-cols-3">
                        <a href="tel:2224657379" className="flex gap-3 text-sm text-zinc-600 hover:text-sky-700"><FiPhone className="mt-0.5 text-sky-700" />2224657379</a>
                        <a href="mailto:victor.vallejo@correo.buap.mx" className="flex gap-3 text-sm text-zinc-600 hover:text-sky-700"><FiMail className="mt-0.5 text-sky-700" />victor.vallejo@correo.buap.mx</a>
                        <p className="flex gap-3 text-sm text-zinc-600"><FiMapPin className="mt-0.5 shrink-0 text-sky-700" />Río Verde, San Manuel, Puebla</p>
                    </address>
                </div>
                <div className="mx-auto mt-6 flex max-w-7xl flex-col gap-3 text-xs text-zinc-500 sm:flex-row sm:justify-between">
                    <span>© 2026 José Víctor Manuel Vallejo Córdoba</span>
                    <span>Aviso de privacidad</span>
                </div>
            </footer>
        </main>
    );
}
