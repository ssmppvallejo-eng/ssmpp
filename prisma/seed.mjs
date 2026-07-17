/**
 * Seed del instrumento SICVPP-BUAP v1 (16-05-2026):
 * "Sistema de Indicadores Contextualizados para Valorar la Pertinencia de los
 * Programas de Posgrado de la BUAP".
 *
 * Jerarquia: Dimension -> Component -> Judgement (criterio) -> Indicator -> Descriptor.
 * Cada indicador tiene exactamente 3 descriptores de logro (RF-DES-015):
 *   1 = No logrado | 2 = En proceso | 3 = Plenamente logrado
 *
 * ADVERTENCIA: este script reemplaza todo el catalogo y elimina las
 * asignaciones existentes (dependen del catalogo anterior).
 *
 * Uso: npm run db:seed
 */
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

const DESCRIPTOR_TITLES = ["No logrado", "En proceso", "Plenamente logrado"];

// d: [descriptor 1, descriptor 2, descriptor 3]
const INSTRUMENT = [
  {
    code: "D1",
    title: "Teleológica y política",
    description: "¿Para qué? Coherencia entre la misión institucional y los fines públicos de la educación superior.",
    components: [
      {
        code: "D1.C1",
        title: "Alineación con misión institucional y marcos normativos",
        judgements: [
          {
            code: "D1.C1.CR1",
            title: "Coherencia entre misión, fines formativos y marcos normativos",
            description: "El programa debe demostrar coherencia estructural verificable entre su misión declarada, sus fines formativos y los principios de la educación superior como bien público, en correspondencia con la LGES (2021) y la LGMHCTI (2023).",
            indicators: [
              {
                description: "El documento curricular vigente incluye una declaración de misión que explicita la orientación del programa hacia fines sociales, democráticos y de desarrollo humano sostenible.",
                justification: "LGES (2021), Art. 8; UNESCO (1998)",
                d: [
                  "La misión del programa no está documentada o se limita a fines disciplinares sin referencia explícita a responsabilidad social ni a marcos normativos nacionales.",
                  "La misión está documentada e incluye referencias generales a la responsabilidad social, pero no establece vínculos explícitos y verificables con la LGES (2021) ni con los fines de la educación superior como bien público.",
                  "La misión está documentada, es pública y explicita con precisión la orientación del programa hacia la formación de ciudadanía crítica, el desarrollo humano sostenible y la atención de necesidades sociales, en alineación verificable con la LGES (2021) y la LGMHCTI (2023).",
                ],
              },
              {
                description: "El plan de estudios vigente articula explícitamente sus objetivos formativos con el Programa Sectorial de Ciencia, Humanidades, Tecnología e Innovación 2025-2030 (PSCHTI) y con los Lineamientos del SNP (SECIHTI, 2025).",
                justification: "Lineamientos SNP-SECIHTI (2025), Art. 14 Fracc. IX; PSCHTI 2025-2030",
                d: [
                  "El plan de estudios no contiene referencias a instrumentos de política pública nacionales vigentes ni evidencia de articulación con el PSCHTI 2025-2030 o los Lineamientos del SNP.",
                  "El plan de estudios menciona algunos ejes de política pública nacional, pero la articulación con el PSCHTI 2025-2030 y los Lineamientos del SNP es parcial, sin evidencia de su operacionalización en los contenidos o en el perfil de egreso.",
                  "El plan de estudios documenta y operacionaliza de manera sistemática la articulación de sus objetivos formativos y perfil de egreso con las prioridades estratégicas del PSCHTI 2025-2030 y los criterios del SNP-SECIHTI (2025), con evidencias verificables en el mapa curricular.",
                ],
              },
              {
                description: "El programa cuenta con mecanismos institucionales documentados de revisión periódica de la pertinencia normativa de su misión y plan de estudios frente a la legislación vigente.",
                justification: "Lineamientos SNP-SECIHTI (2025), Art. 14 Fracc. VI; Marco Gral. SEAES (2023)",
                d: [
                  "No existen mecanismos institucionales documentados para revisar la pertinencia normativa del programa; las actualizaciones curriculares son reactivas o inexistentes.",
                  "Existen mecanismos de revisión curricular, pero no se ejecutan de forma periódica ni sistemática, y sus resultados no se traducen en modificaciones verificables al plan de estudios.",
                  "El programa opera un mecanismo colegiado documentado de revisión normativa con periodicidad definida, cuyos resultados se traducen en ajustes verificables al plan de estudios y se reportan públicamente.",
                ],
              },
            ],
          },
          {
            code: "D1.C1.CR2",
            title: "Transversalización de derechos humanos, género y equidad",
            description: "El programa debe integrar transversalmente, en su diseño curricular, el enfoque de derechos humanos, la perspectiva de género y el compromiso ético con la equidad, como condiciones no negociables del ejercicio profesional.",
            indicators: [
              {
                description: "El mapa curricular documenta la transversalización del enfoque de derechos humanos y perspectiva de género en al menos el 70% de las unidades de aprendizaje o seminarios del programa.",
                justification: "LGES (2021), Art. 7; PNEAES (2022), Criterios Transversales",
                d: [
                  "El mapa curricular no incluye referencias explícitas al enfoque de derechos humanos ni a la perspectiva de género; su integración depende de la iniciativa individual de cada docente sin respaldo institucional.",
                  "El mapa curricular incluye al menos una unidad de aprendizaje dedicada a derechos humanos o género, pero la transversalización es incipiente y no se extiende sistemáticamente a los demás espacios curriculares.",
                  "El mapa curricular documenta de manera verificable la integración transversal del enfoque de derechos humanos y la perspectiva de género en al menos el 70% de las unidades de aprendizaje, con evidencias en programas de curso, criterios de evaluación y materiales didácticos.",
                ],
              },
              {
                description: "El programa cuenta con protocolos institucionales activos para la atención de controversias y violencia de género, socializados al 100% del estudiantado y el personal docente.",
                justification: "Lineamientos SNP-SECIHTI (2025), Art. 12 Fracc. II; LGES (2021), Art. 37",
                d: [
                  "No existen protocolos institucionales para la atención de violencia de género en el programa, o existen pero no han sido socializados ni operacionalizados.",
                  "Existen protocolos institucionales de atención a violencia de género, pero su socialización al estudiantado y personal docente es parcial o no está documentada sistemáticamente.",
                  "El programa opera protocolos institucionales activos de atención a violencia de género, documentados y socializados al 100% del estudiantado y personal docente, con evidencia de su aplicación en al menos un caso atendido durante el periodo de evaluación.",
                ],
              },
            ],
          },
        ],
      },
      {
        code: "D1.C2",
        title: "Soberanía científica y gobernanza ética",
        judgements: [
          {
            code: "D1.C2.CR1",
            title: "Contribución a la soberanía científica y gobernanza ética",
            description: "El programa debe demostrar su contribución activa a la soberanía científica y humanística nacional mediante la generación de conocimiento propio, libre, de acceso abierto y alineado con las prioridades de la Agenda Nacional.",
            indicators: [
              {
                description: "El 100% de los productos de investigación generados con financiamiento público en el programa están disponibles en acceso abierto en repositorios institucionales o nacionales reconocidos.",
                justification: "LGMHCTI (2023), Art. 11 Fracc. XXI",
                d: [
                  "Los productos de investigación del programa no están sistematizados ni disponibles en acceso abierto; la publicación se realiza sin política institucional de ciencia abierta.",
                  "Una proporción de los productos de investigación está disponible en acceso abierto, pero no se alcanza el 100% ni existe una política institucional documentada que garantice el cumplimiento progresivo de este requisito.",
                  "El programa documenta y verifica que el 100% de los productos de investigación financiados con recursos públicos están disponibles en acceso abierto en repositorios reconocidos, con una política institucional explícita y mecanismos de seguimiento activos.",
                ],
              },
              {
                description: "El programa cuenta con un Comité de Ética o Bioética activo que dictamina la integridad y viabilidad ética de todos los proyectos de investigación desarrollados en el programa.",
                justification: "LGMHCTI (2023), Art. 5; Lineamientos SNP-SECIHTI (2025), Art. 12 Fracc. III",
                d: [
                  "El programa carece de un Comité de Ética o Bioética activo; los proyectos de investigación no pasan por un proceso formal de evaluación ética antes de su ejecución.",
                  "Existe un Comité de Ética institucional, pero su funcionamiento no está articulado sistemáticamente con el programa de posgrado ni cubre la totalidad de los proyectos de investigación en curso.",
                  "El programa opera un Comité de Ética activo, con protocolo de dictaminación documentado y aplicado al 100% de los proyectos de investigación, cuyos dictámenes son de acceso público y se integran a los expedientes de los proyectos.",
                ],
              },
              {
                description: "El programa opera un mecanismo de autoevaluación y mejora continua participativo, con resultados documentados que alimentan la toma de decisiones curriculares y de gestión del posgrado.",
                justification: "Lineamientos SNP-SECIHTI (2025), Art. 12 Fracc. III; Marco Gral. SEAES (2023)",
                d: [
                  "El programa no cuenta con un mecanismo formal de autoevaluación; las decisiones de gestión y mejora curricular se toman sin datos sistemáticos ni participación de los actores del programa.",
                  "Existe un proceso de autoevaluación, pero es esporádico, no participativo o sus resultados no se traducen de manera verificable en decisiones de mejora curricular o de gestión.",
                  "El programa opera un proceso de autoevaluación periódica, participativo (que incluye a estudiantes, docentes, egresados y empleadores), con resultados documentados públicamente y con evidencia de su impacto en decisiones verificables de mejora curricular y de gestión.",
                ],
              },
            ],
          },
        ],
      },
    ],
  },
  {
    code: "D2",
    title: "Socio-contextual y cultural",
    description: "¿Para quién? Incidencia social y atención a problemáticas territoriales y sectores vulnerables.",
    components: [
      {
        code: "D2.C1",
        title: "Acceso con equidad e inclusión sustantiva",
        judgements: [
          {
            code: "D2.C1.CR1",
            title: "Acciones afirmativas en el acceso",
            description: "El proceso de admisión del programa debe operacionalizar acciones afirmativas verificables que reduzcan brechas de desigualdad y garanticen igualdad sustantiva en el acceso a grupos históricamente excluidos por género, origen étnico, discapacidad o condición económica.",
            indicators: [
              {
                description: "El reglamento de admisión vigente del programa documenta criterios de acción afirmativa para la inclusión de aspirantes en situación de vulnerabilidad (género, etnia, discapacidad, condición socioeconómica).",
                justification: "LGES (2021), Art. 8 y 37; Lineamientos SNP-SECIHTI (2025), Art. 14 Fracc. VI",
                d: [
                  "El reglamento de admisión no incluye criterios de acción afirmativa; el acceso se rige exclusivamente por criterios académicos uniformes sin diferenciación por condición de vulnerabilidad.",
                  "El reglamento de admisión menciona principios generales de equidad, pero no operacionaliza acciones afirmativas específicas ni establece mecanismos verificables para su aplicación.",
                  "El reglamento de admisión vigente establece acciones afirmativas concretas y verificables por grupo de vulnerabilidad (género, etnia, discapacidad, condición económica), con evidencia documentada de su aplicación en los últimos dos ciclos de admisión.",
                ],
              },
              {
                description: "El perfil de ingreso del programa valora explícitamente la vocación del aspirante para la incidencia social y la atención de problemáticas prioritarias de la Agenda Nacional, como criterio diferenciador de la selección.",
                justification: "LGMHCTI (2023), Art. 11 Fracc. II; Lineamientos SNP-SECIHTI (2025), Art. 14 Fracc. VI",
                d: [
                  "El perfil de ingreso se circunscribe a criterios de desempeño académico previo (promedio, exámenes, dominio de idiomas) sin contemplar la orientación del aspirante hacia la incidencia social.",
                  "El perfil de ingreso incluye referencias a la vocación social como criterio deseable, pero no establece instrumentos de evaluación específicos ni pondera esta dimensión en la decisión de admisión.",
                  "El perfil de ingreso incluye la vocación para la incidencia social como criterio evaluable y ponderado en el proceso de selección, con instrumentos documentados (ensayo de intención, entrevista estructurada) y evidencia de su aplicación sistemática.",
                ],
              },
              {
                description: "El programa cuenta con mecanismos documentados y operativos para garantizar la no discriminación económica, asegurando el cumplimiento progresivo del principio de gratuidad mediante becas, apoyos o exenciones de cuotas.",
                justification: "CPEUM (2025), Art. 3 Fracc. IV; LGES (2021), Art. 62; Lineamientos SNP-SECIHTI (2025), Art. 12 Fracc. I",
                d: [
                  "El programa no cuenta con mecanismos de apoyo económico ni estrategias para garantizar el principio de gratuidad; el pago de cuotas o colegiaturas opera como barrera de acceso sin alternativas institucionales.",
                  "Existen algunos mecanismos de apoyo económico (becas institucionales o externas), pero no cubren al conjunto de estudiantes en situación de vulnerabilidad económica y su otorgamiento no responde a criterios transparentes y sistemáticos.",
                  "El programa opera mecanismos institucionales documentados y transparentes para garantizar el principio de gratuidad progresiva, con cobertura verificable de al menos el 80% de los estudiantes en situación de vulnerabilidad económica mediante becas o exenciones.",
                ],
              },
            ],
          },
          {
            code: "D2.C1.CR2",
            title: "Acompañamiento y permanencia estudiantil",
            description: "El programa debe implementar estrategias institucionales de acompañamiento y nivelación académica que prevengan el abandono y aseguren trayectorias exitosas para el estudiantado en condición de vulnerabilidad o con rezago educativo previo.",
            indicators: [
              {
                description: "El programa opera un sistema de tutoría integral con una relación máxima de seis estudiantes por tutor del Núcleo Académico Básico (NAB), documentado en un plan tutorial institucional.",
                justification: "Lineamientos SNP-SECIHTI (2025), Art. 14 Fracc. IV inciso a)",
                d: [
                  "El programa no cuenta con un sistema de tutoría integral documentado; la asignación de tutores es informal, sin criterios de carga máxima ni plan tutorial institucional.",
                  "El programa opera un sistema de tutoría, pero la relación tutor-estudiante supera los seis estudiantes por docente del NAB, o el plan tutorial no está sistematizado ni incluye mecanismos de seguimiento.",
                  "El programa opera un sistema de tutoría integral documentado, con una relación máxima de seis estudiantes por tutor del NAB, plan tutorial institucional vigente y mecanismos de seguimiento colegiado con actas de reunión y evidencia de intervenciones preventivas del abandono.",
                ],
              },
              {
                description: "El programa mantiene una tasa de graduación ascendente con una meta mínima del 70%, documentada y reportada públicamente, con estrategias específicas de combate al rezago y la titulación oportuna.",
                justification: "Lineamientos SNP-SECIHTI (2025), Art. 14 Fracc. V",
                d: [
                  "La tasa de graduación del programa es inferior al 50% o no está documentada públicamente; no existen estrategias institucionales específicas para combatir el rezago y garantizar la titulación oportuna.",
                  "La tasa de graduación se documenta y reporta, pero se sitúa entre el 50 y el 70%; existen algunas estrategias de combate al rezago, pero no están sistematizadas ni evidencian impacto verificable en la mejora de la eficiencia terminal.",
                  "El programa documenta y reporta públicamente una tasa de graduación del 70% o superior, con tendencia ascendente en los últimos tres años, y opera estrategias sistematizadas y verificables de combate al rezago y titulación oportuna.",
                ],
              },
            ],
          },
        ],
      },
      {
        code: "D2.C2",
        title: "Retribución social e incidencia territorial",
        judgements: [
          {
            code: "D2.C2.CR1",
            title: "Retribución social del estudiantado",
            description: "El programa debe garantizar que el 100% del estudiantado realice actividades formales de Retribución Social, entendidas como procesos verificables de transferencia y apropiación social del conocimiento en sectores públicos o sociales, diferenciadas del servicio social administrativo.",
            indicators: [
              {
                description: "El programa cuenta con protocolos, convenios o cartas de intención que garantizan y documentan la realización de actividades de Retribución Social por el 100% del estudiantado durante su trayectoria formativa.",
                justification: "Lineamientos SNP-SECIHTI (2025), Art. 14 Fracc. X inciso a)",
                d: [
                  "El programa no cuenta con protocolos ni convenios para la Retribución Social; las actividades de vinculación social son esporádicas e informales, sin registro ni seguimiento institucional.",
                  "Existen convenios de Retribución Social con algunas organizaciones, pero no cubren al 100% del estudiantado o las actividades realizadas no están diferenciadas del servicio social administrativo convencional.",
                  "El programa opera protocolos y convenios vigentes que garantizan y documentan actividades de Retribución Social para el 100% del estudiantado, con evidencia verificable de transferencia y apropiación social del conocimiento en comunidades o instituciones de los sectores público y social.",
                ],
              },
              {
                description: "Los productos de investigación estudiantiles (tesis, proyectos terminales) demuestran alineación verificable con la atención de problemáticas locales, regionales o nacionales priorizadas en la Agenda Nacional.",
                justification: "Lineamientos SNP-SECIHTI (2025), Art. 14 Fracc. IX",
                d: [
                  "Los temas de investigación estudiantil se definen sin criterios de pertinencia social verificable; la orientación de los proyectos es predominantemente disciplinar o bibliográfica sin vinculación con problemáticas del entorno.",
                  "Algunos productos de investigación estudiantil abordan problemáticas del entorno, pero no existe un criterio institucional sistemático ni un mecanismo de seguimiento que garantice la alineación con la Agenda Nacional en el conjunto del estudiantado.",
                  "Los lineamientos y procesos académicos del programa establecen y verifican que todos los proyectos de investigación estudiantil se articulan explícitamente con problemáticas locales, regionales o nacionales priorizadas, con evidencia documentada en los protocolos aprobados.",
                ],
              },
              {
                description: "El programa evidencia proyectos activos de divulgación y apropiación social de la ciencia dirigidos a comunidades no especializadas, desarrollados con participación directa del estudiantado.",
                justification: "LGMHCTI (2023), Art. 53 Fracc. II",
                d: [
                  "El programa no cuenta con proyectos sistematizados de divulgación científica hacia comunidades no especializadas; las actividades de difusión se limitan a publicaciones arbitradas o eventos académicos entre pares.",
                  "Existen algunas actividades de divulgación científica hacia públicos no especializados, pero son iniciativas aisladas de docentes o estudiantes, sin respaldo institucional ni integración al currículo del programa.",
                  "El programa opera proyectos sistematizados y documentados de divulgación y apropiación social de la ciencia, integrados al currículo como actividad formativa evaluable, con participación verificable del estudiantado y evidencia de impacto en comunidades no especializadas.",
                ],
              },
            ],
          },
          {
            code: "D2.C2.CR2",
            title: "Incidencia social verificable",
            description: "El programa debe demostrar incidencia social verificable en la solución de problemáticas de la Agenda Nacional, con evidencia de apropiación social del conocimiento por parte de las comunidades o sectores usuarios.",
            indicators: [
              {
                description: "El programa documenta y reporta, con evidencias verificables, cómo sus resultados de investigación han contribuido a la solución de problemáticas concretas identificadas en la Agenda Nacional durante el periodo de evaluación.",
                justification: "Lineamientos SNP-SECIHTI (2025), Art. 14 Fracc. IX inciso a)",
                d: [
                  "El programa no cuenta con documentación sistemática sobre el impacto social de sus resultados de investigación; la incidencia social se describe de manera retórica sin evidencias verificables.",
                  "El programa reporta algunas evidencias de incidencia social, pero corresponden a casos aislados, no sistemáticos, o se limitan a la entrega de informes sin verificación de impacto en las comunidades beneficiarias.",
                  "El programa cuenta con un sistema de documentación y reporte de la incidencia social de sus resultados de investigación, con evidencias verificables de transformaciones en prácticas, políticas o condiciones de vida de comunidades concretas, revisadas con periodicidad definida.",
                ],
              },
              {
                description: "El programa participa formalmente en redes de cooperación académica solidaria y opera convenios activos con sectores estratégicos que potencian sus capacidades de investigación e incidencia social.",
                justification: "Lineamientos SNP-SECIHTI (2025), Art. 14 Fracc. X inciso b) y IX inciso a)",
                d: [
                  "El programa no participa en redes de cooperación académica ni cuenta con convenios activos con sectores estratégicos; la vinculación externa es inexistente o informal.",
                  "El programa cuenta con algunos convenios o membresías en redes académicas, pero éstos son mayoritariamente inactivos o no se traducen en actividades verificables de colaboración o incidencia social.",
                  "El programa participa activamente en al menos dos redes de cooperación académica reconocidas y opera convenios vigentes con organizaciones de sectores estratégicos, con evidencia de actividades colaborativas y productos conjuntos durante el periodo de evaluación.",
                ],
              },
            ],
          },
        ],
      },
    ],
  },
  {
    code: "D3",
    title: "Económico-laboral",
    description: "¿Con qué utilidad? Articulación con el mundo del trabajo y empleabilidad del egresado.",
    components: [
      {
        code: "D3.C1",
        title: "Pertinencia del perfil de egreso y articulación laboral",
        judgements: [
          {
            code: "D3.C1.CR1",
            title: "Seguimiento de egresados y adecuación del perfil de egreso",
            description: "El perfil de egreso del programa debe demostrar adecuación verificable con las demandas del entorno profesional nacional y regional, evidenciada mediante un sistema activo de seguimiento de egresados que retroalimenta la actualización curricular.",
            indicators: [
              {
                description: "El programa opera un sistema de seguimiento de egresados con datos actualizados sobre inserción laboral, trayectoria profesional y valoración de la pertinencia de la formación recibida frente a las demandas del entorno.",
                justification: "Lineamientos SNP-SECIHTI (2025), Art. 14 Fracc. VII inciso a)",
                d: [
                  "El programa no cuenta con un sistema de seguimiento de egresados; la información sobre inserción laboral y trayectoria profesional es inexistente o esporádica, obtenida de manera no sistemática.",
                  "Existe un sistema de seguimiento de egresados, pero los datos son parciales, desactualizados (más de tres años) o no se utilizan sistemáticamente para retroalimentar las decisiones curriculares del programa.",
                  "El programa opera un sistema de seguimiento de egresados con datos actualizados (menos de dos años), con tasa de respuesta documentada igual o superior al 60%, y evidencia de utilización de sus resultados en decisiones verificables de actualización curricular.",
                ],
              },
              {
                description: "El programa documenta la contribución sustantiva y ética de sus egresados en su ejercicio profesional, con evidencias de impacto en la sociedad que trascienden el ámbito laboral estrictamente individual.",
                justification: "PNEAES (2022), Formación de egresados",
                d: [
                  "El programa no cuenta con mecanismos para documentar el impacto social del ejercicio profesional de sus egresados; el seguimiento, cuando existe, se limita a datos de empleo sin evaluación de impacto.",
                  "El programa recopila algunos testimonios o evidencias sobre el desempeño profesional de egresados, pero no cuenta con un sistema estandarizado que documente la contribución ética y social de su ejercicio profesional.",
                  "El programa cuenta con un instrumento estandarizado para documentar y reportar la contribución sustantiva y ética de sus egresados en la sociedad, con al menos un estudio de impacto realizado durante el periodo de evaluación y con evidencias verificables de transformaciones atribuibles a su acción profesional.",
                ],
              },
            ],
          },
          {
            code: "D3.C1.CR2",
            title: "Convenios y diagnósticos del entorno profesional",
            description: "El programa debe contar con convenios activos que faciliten la inserción de estudiantes y egresados en sectores estratégicos para el desarrollo nacional, y con diagnósticos actualizados de las demandas del entorno profesional que fundamenten el diseño curricular.",
            indicators: [
              {
                description: "El programa cuenta con diagnósticos actualizados (no mayores a tres años) de las necesidades del entorno profesional y sectorial que fundamentan el diseño del perfil de egreso y el mapa curricular.",
                justification: "Lineamientos SNP-SECIHTI (2025), Art. 14 Fracc. IX",
                d: [
                  "El perfil de egreso y el mapa curricular no se sustentan en diagnósticos del entorno profesional documentados; el diseño curricular responde a lógicas disciplinares internas sin retroalimentación del sector productivo o social.",
                  "Existen diagnósticos del entorno profesional, pero tienen más de tres años de antigüedad o su aplicación en el diseño curricular no está documentada de manera verificable.",
                  "El programa sustenta su perfil de egreso y mapa curricular en diagnósticos actualizados (no mayores a tres años) del entorno profesional y sectorial, realizados con metodología documentada y con participación de empleadores, egresados y actores del sector social.",
                ],
              },
              {
                description: "El programa opera convenios activos con organizaciones de sectores estratégicos que generan oportunidades verificables de práctica profesional, estancias de investigación aplicada e inserción laboral para estudiantes y egresados.",
                justification: "Lineamientos SNP-SECIHTI (2025), Art. 14 Fracc. IX inciso a)",
                d: [
                  "El programa no cuenta con convenios activos con el sector productivo, público o social; las oportunidades de práctica profesional o inserción laboral para estudiantes dependen exclusivamente de gestiones individuales.",
                  "El programa cuenta con convenios formales con algunas organizaciones, pero éstos son mayoritariamente protocolarios o inactivos, sin evidencia de oportunidades concretas generadas para el estudiantado durante el periodo de evaluación.",
                  "El programa opera al menos cinco convenios activos con organizaciones de sectores estratégicos, con evidencia documentada de oportunidades de práctica, estancias o inserción laboral generadas para el estudiantado y egresados durante el periodo de evaluación.",
                ],
              },
            ],
          },
        ],
      },
      {
        code: "D3.C2",
        title: "Infraestructura institucional y recursos para la formación",
        judgements: [
          {
            code: "D3.C2.CR1",
            title: "Infraestructura suficiente, actualizada y accesible",
            description: "La institución debe garantizar infraestructura física, tecnológica y bibliográfica suficiente, actualizada y accesible universalmente, que respalde con calidad los procesos formativos e investigativos del programa.",
            indicators: [
              {
                description: "La institución cuenta con laboratorios, talleres o espacios especializados adecuados, suficientes y accesibles para el total de la matrícula del programa, con equipamiento actualizado y protocolos de uso documentados.",
                justification: "Lineamientos SNP-SECIHTI (2025), Art. 14 Fracc. III",
                d: [
                  "Los espacios especializados son insuficientes para la matrícula del programa, están desactualizados o no cuentan con protocolos de uso documentados que garanticen la equidad en el acceso.",
                  "Los espacios especializados son parcialmente suficientes para la matrícula, pero existen limitaciones de equipamiento, accesibilidad o actualización que afectan a una proporción del estudiantado.",
                  "La institución garantiza espacios especializados suficientes para el 100% de la matrícula, con equipamiento actualizado (no mayor a cinco años), accesibilidad universal documentada y protocolos de uso que garantizan la equidad en el acceso.",
                ],
              },
              {
                description: "La institución provee acceso actualizado y suficiente a acervos bibliográficos y recursos digitales de investigación necesarios para el nivel de posgrado, con cobertura verificable de las líneas de investigación del programa.",
                justification: "Lineamientos SNP-SECIHTI (2025), Art. 14 Fracc. III inciso b)",
                d: [
                  "El programa no cuenta con acceso suficiente a acervos bibliográficos actualizados ni a bases de datos especializadas acordes al nivel de posgrado; los recursos disponibles no cubren las líneas de investigación del programa.",
                  "El programa cuenta con acceso a algunos recursos bibliográficos y digitales, pero la cobertura es parcial respecto a las líneas de investigación activas o los recursos están desactualizados (más de cinco años en promedio para las fuentes principales).",
                  "La institución garantiza acceso pleno y actualizado a acervos bibliográficos y bases de datos especializadas que cubren el 100% de las líneas de investigación del programa, con política documentada de actualización periódica y evidencia de uso verificable.",
                ],
              },
              {
                description: "La infraestructura física y tecnológica del programa garantiza accesibilidad universal para personas con discapacidad, en cumplimiento de la normativa vigente.",
                justification: "PNEAES (2022), Inclusión; LGES (2021), Art. 10 Fracc. XII",
                d: [
                  "La infraestructura del programa no cumple con los estándares de accesibilidad universal; no existen adecuaciones documentadas para la inclusión de personas con discapacidad.",
                  "La institución ha realizado algunas adecuaciones de accesibilidad, pero éstas son parciales y no garantizan el acceso pleno de personas con discapacidad a todos los espacios y recursos del programa.",
                  "La infraestructura del programa cumple con los estándares de accesibilidad universal para personas con discapacidad en el 100% de sus espacios físicos y plataformas tecnológicas, con certificación o dictamen técnico documentado.",
                ],
              },
            ],
          },
        ],
      },
    ],
  },
  {
    code: "D4",
    title: "Epistemológica e investigativa",
    description: "¿Qué? Producción y validación de conocimiento riguroso, contextualizado y transdisciplinar.",
    components: [
      {
        code: "D4.C1",
        title: "Cuerpo académico y producción con incidencia social",
        judgements: [
          {
            code: "D4.C1.CR1",
            title: "Suficiencia y congruencia del Núcleo Académico Básico",
            description: "El Núcleo Académico Básico (NAB) debe demostrar suficiencia cuantitativa y congruencia cualitativa entre su perfil académico, su producción científica y las Líneas de Investigación e Incidencia Social (LIES) del programa, con equilibrio de género y renovación generacional.",
            indicators: [
              {
                description: "El programa cuenta con el mínimo requerido de integrantes del NAB con reconocimiento vigente en el SNII (mínimo 10 para programas orientados a la investigación; mínimo 8 para programas orientados a la profesionalización).",
                justification: "Lineamientos SNP-SECIHTI (2025), Art. 14 Fracc. I",
                d: [
                  "El NAB no alcanza el mínimo requerido de integrantes con reconocimiento SNII vigente para la orientación del programa.",
                  "El NAB alcanza el mínimo requerido de integrantes con SNII, pero una proporción significativa de los reconocimientos está próxima a vencer o el cuerpo académico depende de pocos investigadores para cumplir el mínimo.",
                  "El NAB supera el mínimo requerido de integrantes con reconocimiento SNII vigente, con una distribución equilibrada entre niveles del sistema y un plan documentado de renovación generacional.",
                ],
              },
              {
                description: "El perfil académico y la producción científica de cada integrante del NAB demuestran congruencia directa y verificable con las LIES del programa, establecida mediante un análisis de correspondencia documentado.",
                justification: "Lineamientos SNP-SECIHTI (2025), Art. 14 Fracc. II",
                d: [
                  "No existe un análisis documentado de congruencia entre el perfil y la producción del NAB y las LIES del programa; la asignación de docentes al programa no responde a criterios de pertinencia investigativa verificables.",
                  "Existe un análisis de congruencia, pero cubre parcialmente al NAB o evidencia desalineaciones significativas entre la producción de algunos integrantes y las LIES declaradas del programa.",
                  "El programa cuenta con un análisis de congruencia actualizado (no mayor a dos años) que documenta la pertinencia investigativa de cada integrante del NAB respecto a las LIES, con evidencia de producción académica verificable en las líneas declaradas.",
                ],
              },
              {
                description: "El NAB demuestra equilibrio de género y renovación generacional en su composición, con una estrategia institucional documentada para su mantenimiento y mejora progresiva.",
                justification: "Lineamientos SNP-SECIHTI (2025), Art. 14 Fracc. II inciso c)",
                d: [
                  "La composición del NAB muestra desbalance de género significativo (más del 70% de un solo género) sin estrategia institucional documentada para su corrección.",
                  "El NAB evidencia avances hacia el equilibrio de género, pero aún persiste un desbalance moderado (entre 60-70% de un solo género) o la estrategia de renovación generacional no está documentada.",
                  "El NAB cumple con una composición de género equilibrada (máximo 60% de un solo género) y cuenta con una estrategia documentada de renovación generacional con indicadores de seguimiento y metas verificables.",
                ],
              },
            ],
          },
          {
            code: "D4.C1.CR2",
            title: "Operación y colaboración de las LIES",
            description: "Las Líneas de Investigación e Incidencia Social (LIES) del programa deben operar con resultados tangibles y demostrar producción académica colaborativa orientada a la solución de problemas complejos del entorno, con participación en redes de investigación de incidencia nacional e internacional.",
            indicators: [
              {
                description: "Las LIES del programa cuentan con resultados tangibles documentados (publicaciones, patentes, informes técnicos, prototipos, políticas informadas) generados durante los últimos tres años en atención a problemáticas del entorno.",
                justification: "Lineamientos SNP-SECIHTI (2025), Art. 14 Fracc. II inciso b)",
                d: [
                  "Las LIES del programa son declarativas; no existen productos de investigación tangibles generados durante los últimos tres años que documenten su operación y su orientación al entorno.",
                  "Las LIES generan algunos productos de investigación, pero éstos corresponden predominantemente a producción individual del NAB, sin evidencia de trabajo colaborativo ni de orientación sistemática a problemáticas del entorno.",
                  "Las LIES del programa documentan productos de investigación tangibles y verificables generados durante los últimos tres años, con evidencia de producción colaborativa, diversidad tipológica de resultados y vinculación explícita con problemáticas priorizadas del entorno.",
                ],
              },
              {
                description: "El personal docente del programa participa activamente en Redes de Investigación e Incidencia, nacionales o internacionales, que atienden problemáticas de la Agenda Nacional.",
                justification: "LGMHCTI (2023), Art. 11 Fracc. IX",
                d: [
                  "El NAB no participa en redes de investigación formalmente constituidas; la colaboración interinstitucional es inexistente o se limita a contactos personales informales.",
                  "Algunos integrantes del NAB participan en redes de investigación, pero la participación es individual, no institucional, y no está articulada con las LIES del programa ni con la Agenda Nacional.",
                  "El programa documenta la participación formal de al menos el 70% del NAB en redes de investigación reconocidas nacionales o internacionales, con evidencia de productos colaborativos y de orientación a temáticas de la Agenda Nacional durante el periodo de evaluación.",
                ],
              },
            ],
          },
        ],
      },
      {
        code: "D4.C2",
        title: "Transdisciplinariedad y producción de conocimiento contextualizado",
        judgements: [
          {
            code: "D4.C2.CR1",
            title: "Diálogo de Saberes y transdisciplinariedad",
            description: "El plan de estudios debe integrar el Diálogo de Saberes como metodología de investigación y validación del conocimiento, reconociendo la pluralidad epistémica e incorporando saberes tradicionales y comunitarios para la atención de problemáticas del entorno.",
            indicators: [
              {
                description: "El mapa curricular integra seminarios o proyectos transdisciplinarios para el abordaje de problemáticas complejas que no pueden resolverse desde una sola disciplina.",
                justification: "LGMHCTI (2023), Art. 11 Fracc. XXV",
                d: [
                  "El mapa curricular es estrictamente monodisciplinar; no incluye espacios curriculares formales para el trabajo transdisciplinario ni para el abordaje de problemáticas complejas desde múltiples perspectivas.",
                  "El mapa curricular incluye algunos espacios interdisciplinarios o transdisciplinarios, pero éstos son periféricos al núcleo formativo del programa o no están articulados explícitamente con problemáticas concretas del entorno.",
                  "El mapa curricular incorpora al menos dos seminarios o proyectos transdisciplinarios articulados explícitamente con problemáticas complejas del entorno, con metodología documentada que integra perspectivas de múltiples disciplinas y actores.",
                ],
              },
              {
                description: "El programa incluye contenidos o actividades específicas para el Diálogo de Saberes que operacionalizan la pluralidad epistémica, incorporando saberes tradicionales y comunitarios como fuentes legítimas de conocimiento.",
                justification: "LGES (2021), Art. 7; Marco Gral. SEAES (2023), Criterio de Interculturalidad",
                d: [
                  "El programa no incluye contenidos ni actividades que reconozcan o integren saberes tradicionales o comunitarios como fuentes epistémicas legítimas; la formación se sustenta exclusivamente en la ciencia occidental convencional.",
                  "El programa menciona el Diálogo de Saberes en algunos documentos normativos o en el discurso institucional, pero no lo operacionaliza en contenidos, metodologías o actividades evaluables del currículo.",
                  "El programa operacionaliza el Diálogo de Saberes en al menos una unidad curricular con metodología documentada, criterios de evaluación definidos y evidencia de incorporación de saberes tradicionales y comunitarios como insumos epistémicos en proyectos de investigación estudiantil.",
                ],
              },
              {
                description: "La agenda de investigación del programa incluye proyectos activos orientados a la atención de problemáticas de zonas de atención prioritaria (territorialización), en co-creación con comunidades, gobierno o sector productivo.",
                justification: "LGES (2021), Art. 8 Fracc. XXII; PNEAES (2022), Innovación Social",
                d: [
                  "La agenda de investigación del programa no incluye proyectos orientados a zonas de atención prioritaria ni evidencia de co-creación con actores externos al ámbito académico.",
                  "El programa cuenta con algunos proyectos de investigación en zonas de atención prioritaria, pero son iniciativas individuales de docentes sin articulación institucional ni mecanismos formales de co-creación con actores externos.",
                  "El programa documenta al menos dos proyectos activos en zonas de atención prioritaria, desarrollados en co-creación formal con comunidades, gobierno o sector productivo, con convenios o acuerdos de colaboración vigentes y evidencia de participación de actores externos en el diseño y validación de los resultados.",
                ],
              },
            ],
          },
        ],
      },
    ],
  },
  {
    code: "D5",
    title: "Pedagógico-didáctica",
    description: "¿Cómo? Coherencia curricular, alineamiento constructivo y centralidad del aprendizaje.",
    components: [
      {
        code: "D5.C1",
        title: "Diseño curricular y coherencia didáctica",
        judgements: [
          {
            code: "D5.C1.CR1",
            title: "Justificación territorial y coherencia interna del plan de estudios",
            description: "El plan de estudios debe justificar su existencia en función de diagnósticos territoriales actualizados de necesidades prioritarias y demostrar coherencia interna entre sus objetivos, contenidos, metodologías de enseñanza-aprendizaje y sistemas de evaluación.",
            indicators: [
              {
                description: "El plan de estudios incluye un estudio de pertinencia o diagnóstico territorial de necesidades actualizado (no mayor a tres años) que fundamenta la existencia y el diseño del programa.",
                justification: "Lineamientos SNP-SECIHTI (2025), Art. 14 Fracc. IX",
                d: [
                  "El plan de estudios no cuenta con un estudio de pertinencia ni diagnóstico territorial documentado; la justificación del programa se basa en argumentos generales sin evidencia empírica del entorno.",
                  "El programa cuenta con un estudio de pertinencia, pero tiene más de tres años de antigüedad o no cubre las dimensiones relevantes del entorno territorial (sectores productivos, necesidades sociales, oferta académica competidora).",
                  "El plan de estudios se sustenta en un estudio de pertinencia o diagnóstico territorial actualizado (no mayor a tres años), con metodología documentada y cobertura de los sectores productivos, las necesidades sociales y la oferta académica del entorno, que justifica la orientación y diseño del programa.",
                ],
              },
              {
                description: "El mapa curricular evidencia alineamiento constructivo verificable entre los objetivos de aprendizaje de cada unidad, las actividades de enseñanza-aprendizaje propuestas y los sistemas de evaluación empleados.",
                justification: "PNEAES (2022), Vanguardia; Biggs (2005)",
                d: [
                  "El mapa curricular no evidencia alineamiento constructivo; los objetivos de aprendizaje, las actividades y los sistemas de evaluación se diseñan de manera independiente sin verificación de coherencia interna.",
                  "El alineamiento constructivo es parcialmente verificable en algunos cursos o seminarios, pero no es sistemático en el conjunto del mapa curricular y no existe un mecanismo institucional para su verificación periódica.",
                  "El mapa curricular documenta el alineamiento constructivo en el 100% de sus unidades de aprendizaje, con matrices de alineación accesibles, revisadas periódicamente mediante un proceso colegiado y con evidencia de su impacto en los resultados de aprendizaje.",
                ],
              },
              {
                description: "El programa incorpora contenidos o actividades enfocadas en el Desarrollo Humano Integral del estudiantado (ciudadanía, salud mental, cultura de paz), integrados al currículo como dimensión formativa reconocida.",
                justification: "LGES (2021), Art. 7",
                d: [
                  "El programa no incluye contenidos ni actividades relacionadas con el Desarrollo Humano Integral; la formación se circunscribe a los aspectos disciplinares e investigativos sin atención a la dimensión humana del estudiantado.",
                  "El programa cuenta con algunas actividades de desarrollo humano integral (talleres, seminarios optativos), pero éstas son periféricas al currículo, no evaluables formalmente y de asistencia voluntaria.",
                  "El programa integra al currículo formal, con carácter obligatorio y criterios de evaluación definidos, al menos dos actividades de Desarrollo Humano Integral (ciudadanía activa, salud mental, cultura de paz), articuladas con los objetivos formativos del perfil de egreso.",
                ],
              },
            ],
          },
          {
            code: "D5.C1.CR2",
            title: "Flexibilidad curricular e innovación metodológica",
            description: "El currículo del programa debe demostrar flexibilidad e innovación metodológica verificables, con mecanismos de movilidad estudiantil, reconocimiento de créditos y actualización periódica sustentada en las necesidades del entorno.",
            indicators: [
              {
                description: "El plan de estudios permite la movilidad y el reconocimiento de créditos en consonancia con el Sistema Nacional de Asignación, Acumulación y Transferencia de Créditos Académicos (SNAATCA), con evidencia de movilidad estudiantil en los últimos dos años.",
                justification: "LGES (2021), Art. 19; SNAATCA (2024)",
                d: [
                  "El plan de estudios no contempla mecanismos de movilidad ni reconocimiento de créditos externos; el currículo es cerrado y no permite la transferencia de aprendizajes adquiridos en otros programas o instituciones.",
                  "El plan de estudios contempla la posibilidad de movilidad y reconocimiento de créditos, pero no existen mecanismos operativos documentados ni evidencia de movilidad estudiantil efectiva en los últimos dos años.",
                  "El plan de estudios cuenta con un reglamento de movilidad y reconocimiento de créditos alineado al SNAATCA, con procesos documentados y evidencia verificable de al menos cinco casos de movilidad estudiantil (entrante o saliente) durante los últimos dos años.",
                ],
              },
              {
                description: "El programa incorpora metodologías de aprendizaje situado, participativo o basado en la solución de problemas reales del contexto como estrategia didáctica central, documentada en los programas de curso.",
                justification: "PNEAES (2022), Vanguardia",
                d: [
                  "Las metodologías de enseñanza-aprendizaje son predominantemente expositivas y centradas en el docente; los programas de curso no documentan estrategias de aprendizaje situado o basado en problemas reales.",
                  "Algunos programas de curso incluyen metodologías de aprendizaje situado o basado en problemas, pero no es una estrategia didáctica central ni sistemática en el conjunto del mapa curricular.",
                  "Al menos el 70% de los programas de curso documentan metodologías activas de aprendizaje situado, participativo o basado en problemas reales del contexto, con evidencia de su implementación en actas de sesión, productos de aprendizaje y valoraciones estudiantiles.",
                ],
              },
              {
                description: "El programa cuenta con un mecanismo de actualización curricular periódica, sustentado en el análisis sistemático de las necesidades del entorno y de los resultados de aprendizaje, con evidencia de ciclos de actualización realizados.",
                justification: "Lineamientos SNP-SECIHTI (2025), Art. 14 Fracc. VI",
                d: [
                  "No existe un mecanismo formal de actualización curricular; el plan de estudios no ha sido revisado en los últimos cinco años o las modificaciones realizadas no responden a diagnósticos del entorno.",
                  "Existe un proceso de revisión curricular, pero es esporádico, no responde a un calendario definido y no se sustenta sistemáticamente en diagnósticos del entorno ni en datos de resultados de aprendizaje.",
                  "El programa opera un mecanismo documentado de actualización curricular con periodicidad definida, sustentado en diagnósticos del entorno y análisis de resultados de aprendizaje, con evidencia de al menos un ciclo de actualización completado durante la vigencia del plan.",
                ],
              },
            ],
          },
        ],
      },
      {
        code: "D5.C2",
        title: "Idoneidad y desarrollo del personal docente",
        judgements: [
          {
            code: "D5.C2.CR1",
            title: "Actualización docente y calidad tutorial",
            description: "El personal docente del programa debe demostrar actualización continua en pedagogías innovadoras, perspectiva de género y derechos humanos, y realizar actividades de tutoría y acompañamiento dentro de los límites establecidos que garantizan calidad en la atención.",
            indicators: [
              {
                description: "El personal docente del programa evidencia actualización continua en pedagogías innovadoras, con participación documentada en cursos, diplomados o certificaciones en los últimos tres años.",
                justification: "PNEAES (2022), Profesionalización",
                d: [
                  "El personal docente no cuenta con evidencia documentada de actualización en pedagogías innovadoras en los últimos tres años; la formación pedagógica depende exclusivamente de la iniciativa individual sin respaldo institucional.",
                  "Algunos integrantes del NAB evidencian actualización en pedagogías innovadoras, pero la cobertura es menor al 60% del personal docente activo o los programas de actualización no responden a un plan institucional sistemático.",
                  "Al menos el 80% del personal docente activo del programa evidencia actualización en pedagogías innovadoras mediante participación documentada en programas institucionales de formación durante los últimos tres años, con un plan de actualización docente vigente.",
                ],
              },
              {
                description: "El personal docente del programa realiza actividades de tutoría sin exceder la carga máxima permitida de seis estudiantes por tutor, con evidencia de calidad en la atención y de ética en el ejercicio tutorial.",
                justification: "Lineamientos SNP-SECIHTI (2025), Art. 14 Fracc. IV",
                d: [
                  "No existen límites documentados para la carga tutorial del personal docente ni mecanismos de seguimiento; la asignación de tutorías se realiza sin criterios de calidad verificables.",
                  "Existe una normativa de carga máxima tutorial, pero no se aplica de manera sistemática; algunos docentes superan el límite de seis estudiantes sin intervención institucional correctiva.",
                  "El programa verifica y documenta que el 100% del personal docente cumple el límite máximo de seis estudiantes por tutor, con informes de actividad tutorial periódicos, mecanismos de retroalimentación estudiantil sobre la calidad de la tutoría y evidencia de intervenciones institucionales cuando se detectan incumplimientos.",
                ],
              },
            ],
          },
        ],
      },
    ],
  },
];

async function main() {
  console.log("Eliminando datos dependientes del catálogo anterior...");
  await prisma.assignmentIndicatorDescriptor.deleteMany();
  await prisma.assignmentIndicator.deleteMany();
  await prisma.userAssignTo.deleteMany();
  await prisma.assignment.deleteMany();
  await prisma.templateIndicator.deleteMany();
  await prisma.template.deleteMany();

  console.log("Eliminando catálogo anterior...");
  await prisma.descriptor.deleteMany();
  await prisma.indicator.deleteMany();
  await prisma.judgement.deleteMany();
  await prisma.component.deleteMany();
  await prisma.dimension.deleteMany();

  console.log("Sembrando instrumento SICVPP-BUAP v1...");
  let indicatorCount = 0;

  for (const dimension of INSTRUMENT) {
    const dbDimension = await prisma.dimension.create({
      data: {
        code: dimension.code,
        title: dimension.title,
        description: dimension.description,
      },
    });

    for (const component of dimension.components) {
      const dbComponent = await prisma.component.create({
        data: {
          code: component.code,
          title: component.title,
          dimensionId: dbDimension.id,
        },
      });

      for (const judgement of component.judgements) {
        const dbJudgement = await prisma.judgement.create({
          data: {
            code: judgement.code,
            title: judgement.title,
            description: judgement.description,
            componentId: dbComponent.id,
          },
        });

        for (const [index, indicator] of judgement.indicators.entries()) {
          indicatorCount += 1;
          await prisma.indicator.create({
            data: {
              code: `${judgement.code}.I${index + 1}`,
              description: indicator.description,
              justification: indicator.justification,
              judgementId: dbJudgement.id,
              descriptors: {
                create: indicator.d.map((description, position) => ({
                  title: DESCRIPTOR_TITLES[position],
                  value: position + 1,
                  description,
                })),
              },
            },
          });
        }
      }
    }
  }

  const counts = {
    dimensiones: await prisma.dimension.count(),
    componentes: await prisma.component.count(),
    criterios: await prisma.judgement.count(),
    indicadores: await prisma.indicator.count(),
    descriptores: await prisma.descriptor.count(),
  };
  console.log("Seed completado:", counts);
}

main()
  .catch((error) => {
    console.error(error);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());
