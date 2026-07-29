package com.cofira.services;

import com.cofira.dto.gimnasio.MotivacionDTO;

import java.io.IOException;
import java.time.DayOfWeek;
import java.time.LocalDate;
import java.util.ArrayList;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpEntity;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.http.client.SimpleClientHttpRequestFactory;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;
import org.springframework.web.servlet.mvc.method.annotation.SseEmitter;

import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.cofira.dto.consumo.AnalisisImagenDTO;
import com.cofira.dto.ollama.AlimentoGeneradoDTO;
import com.cofira.dto.ollama.ComidaGeneradaDTO;
import com.cofira.dto.ollama.GenerarMenuRequestDTO;
import com.cofira.dto.ollama.GenerarRutinaRequestDTO;
import com.cofira.dto.ollama.MenuDiaDTO;
import com.cofira.dto.ollama.MenuGeneradoDTO;
import com.cofira.dto.ollama.MenuSemanalGeneradoDTO;
import com.cofira.dto.ollama.RutinaGeneradaDTO;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

@Service
public class GeminiService {

    private static final Logger logger = LoggerFactory.getLogger(GeminiService.class);
    private static final String OPENROUTER_URL = "https://openrouter.ai/api/v1/chat/completions";

    private final RestTemplate restTemplate;
    private final ObjectMapper objectMapper;

    @Value("${openrouter.api-key}")
    private String openRouterApiKey;

    @Value("${openrouter.model:openai/gpt-4o-mini}")
    private String modeloOpenRouter;

    public GeminiService() {
        SimpleClientHttpRequestFactory factoriaConexiones = new SimpleClientHttpRequestFactory();
        factoriaConexiones.setConnectTimeout(30000);
        factoriaConexiones.setReadTimeout(120000);
        this.restTemplate = new RestTemplate(factoriaConexiones);
        this.objectMapper = new ObjectMapper();
    }

    public RutinaGeneradaDTO generarRutinaEjercicio(GenerarRutinaRequestDTO solicitud) {
        logger.info("Generando rutina de ejercicio para: objetivo={}, nivel={}, dias={}",
            solicitud.getObjetivoPrincipal(),
            solicitud.getNivelFitness(),
            solicitud.getDiasEntrenamientoPorSemana());

        String promptGenerado = construirPromptRutina(solicitud);
        logger.debug("Prompt generado para rutina de ejercicio");

        String respuestaOpenRouter = llamarOpenRouter(promptGenerado);
        logger.debug("Respuesta recibida de OpenRouter, longitud: {} caracteres", respuestaOpenRouter.length());

        RutinaGeneradaDTO rutinaParseada = parsearRespuestaRutina(respuestaOpenRouter);
        logger.info("Rutina generada exitosamente con {} dias de ejercicio",
            rutinaParseada.getDiasEjercicio() != null ? rutinaParseada.getDiasEjercicio().size() : 0);

        return rutinaParseada;
    }

    private String construirPromptRutina(GenerarRutinaRequestDTO solicitud) {
        String equipamientoTexto = solicitud.getEquipamientoDisponible() != null
                ? String.join(", ", solicitud.getEquipamientoDisponible())
                : "sin equipamiento especifico";

        String lesionesTexto = solicitud.getLesiones() != null && !solicitud.getLesiones().isEmpty()
                ? String.join(", ", solicitud.getLesiones())
                : "ninguna";

        String condicionesTexto = solicitud.getCondicionesMedicas() != null && !solicitud.getCondicionesMedicas().isEmpty()
                ? String.join(", ", solicitud.getCondicionesMedicas())
                : "ninguna";

        String deportesTexto = solicitud.getDeportesDisponibles() != null && !solicitud.getDeportesDisponibles().isEmpty()
                ? String.join(", ", solicitud.getDeportesDisponibles())
                : "ninguno";

        String ubicacionTexto = mapearUbicacionEntrenamiento(solicitud.getUbicacionEntrenamiento());
        String nivelIntensidad = calcularNivelIntensidad(solicitud);
        String seccionProgresion = construirSeccionProgresion(solicitud);

        int semanaActual = solicitud.getSemanaActual() != null ? solicitud.getSemanaActual() : 1;
        double pesoKg = solicitud.getPesoKg() != null ? solicitud.getPesoKg() : 70.0;
        double alturaCm = solicitud.getAlturaCm() != null ? solicitud.getAlturaCm() : 170.0;
        double imc = solicitud.getImc() != null ? solicitud.getImc() : 24.0;
        int duracionMinutos = solicitud.getDuracionSesionMinutos() != null ? solicitud.getDuracionSesionMinutos() : 60;

        String promptCompleto = String.format("""
            Genera una rutina de ejercicios SEMANA %d para una persona con estas caracteristicas:

            === DATOS PERSONALES ===
            - Objetivo: %s
            - Nivel de fitness: %s
            - Genero: %s
            - Edad: %d anos
            - Peso: %.1f kg
            - Altura: %.1f cm
            - IMC: %.1f

            === ENTRENAMIENTO ===
            - Dias de entrenamiento: %d dias por semana
            - Duracion por sesion: %d minutos
            - Ubicacion: %s
            - Equipamiento disponible: %s
            - Deportes que puede practicar: %s

            === SALUD Y LIMITACIONES (MUY IMPORTANTE) ===
            - Lesiones: %s
            - Condiciones medicas: %s

            === PROGRESION ===
            - Semana actual: %d
            - Nivel de intensidad sugerido: %s
            %s

            REGLAS IMPORTANTES:
            1. NO incluyas ejercicios que puedan agravar las lesiones indicadas
            2. Adapta la intensidad segun las condiciones medicas
            3. Si es ubicacion CASA, usa ejercicios sin maquinas pesadas
            4. Si es ubicacion GYM, puedes incluir maquinas y pesos libres
            5. Aumenta progresivamente la dificultad cada semana
            6. IMPORTANTE: Incluye pesoSugeridoKg para CADA ejercicio basandote en:
               - Nivel de fitness del usuario
               - Genero (hombres suelen levantar mas que mujeres)
               - Tipo de ejercicio (compuestos vs aislamiento)
               - Si es CASA o sin equipamiento, pon 0 para ejercicios de peso corporal
            7. Si tiene deportes disponibles (distinto de "ninguno"), programa 1-2 de sus dias como sesion de
               ESE deporte en vez de gimnasio, alternando: dia de deporte = grupoMuscular "Cardio y resistencia",
               pesoSugeridoKg 0, y ejercicios con nombre concreto de la sesion (ej: "Carrera continua zona 2",
               "Series de natacion 8x50m", "Salida en bici 40 km/h suave") con series/repeticiones adaptadas
               (ej: series=1, repeticiones="35 min" o series=8, repeticiones="50 m") y la pauta en la descripcion.
            8. Entrena como un ENTRENADOR PROFESIONAL: en cada descripcion incluye tecnica en 1 frase +
               intensidad objetivo (RPE 6-9 o %% aproximado) y tempo en los compuestos (ej: "tempo 3-1-1").
               En el PRIMER ejercicio de cada dia anade al inicio de la descripcion un calentamiento de 1 linea.

            Responde UNICAMENTE con un JSON valido con esta estructura exacta, sin texto adicional:
            {
              "diasEjercicio": [
                {
                  "diaSemana": "Lunes",
                  "grupoMuscular": "Pecho y Triceps",
                  "ejercicios": [
                    {
                      "nombre": "Press de banca",
                      "series": 4,
                      "repeticiones": "8-10",
                      "descansoSegundos": 90,
                      "descripcion": "Acostado en banco, bajar barra al pecho y empujar",
                      "grupoMuscular": "Pecho",
                      "pesoSugeridoKg": 40.0
                    }
                  ]
                }
              ]
            }
            """,
                semanaActual,
                solicitud.getObjetivoPrincipal(),
                solicitud.getNivelFitness(),
                solicitud.getGenero(),
                solicitud.getEdad(),
                pesoKg,
                alturaCm,
                imc,
                solicitud.getDiasEntrenamientoPorSemana(),
                duracionMinutos,
                ubicacionTexto,
                equipamientoTexto,
                deportesTexto,
                lesionesTexto,
                condicionesTexto,
                semanaActual,
                nivelIntensidad,
                seccionProgresion
        );

        return promptCompleto;
    }

    private String calcularNivelIntensidad(GenerarRutinaRequestDTO solicitud) {
        int semana = solicitud.getSemanaActual() != null ? solicitud.getSemanaActual() : 1;
        boolean feedbackPositivo = Boolean.TRUE.equals(solicitud.getFeedbackPositivo());

        if (semana == 1) {
            return "MODERADO (semana inicial de adaptacion)";
        } else if (feedbackPositivo) {
            return "ALTO (usuario indica que puede mas)";
        } else {
            return "MODERADO-ALTO (progresion gradual)";
        }
    }

    private String construirSeccionProgresion(GenerarRutinaRequestDTO solicitud) {
        if (solicitud.getSemanaActual() == null || solicitud.getSemanaActual() <= 1) {
            return "";
        }

        StringBuilder seccion = new StringBuilder();
        seccion.append("\n=== AJUSTES BASADOS EN FEEDBACK ===\n");

        if (Boolean.TRUE.equals(solicitud.getFeedbackPositivo())) {
            seccion.append("- El usuario indica que PUEDE LEVANTAR MAS PESO\n");
            seccion.append("- Aumenta series en 1 o repeticiones en 2-3 respecto a la semana anterior\n");
        }

        if (solicitud.getEjerciciosDificiles() != null && !solicitud.getEjerciciosDificiles().isEmpty()) {
            seccion.append("- Ejercicios que resultaron DIFICILES: ").append(solicitud.getEjerciciosDificiles()).append("\n");
            seccion.append("- Considera reducir intensidad o sustituir estos ejercicios\n");
        }

        if (solicitud.getComentariosSemana() != null && !solicitud.getComentariosSemana().isEmpty()) {
            seccion.append("- Comentarios diarios del usuario esta semana (dia a dia):\n");
            seccion.append(solicitud.getComentariosSemana()).append("\n");
            seccion.append("- Ajusta la nueva semana segun estos comentarios: volumen, sustituciones y descansos\n");
        }

        if (solicitud.getNivelFatigaMedio() != null) {
            seccion.append("- Fatiga media reportada (1 muy facil - 5 agotado): ")
                    .append(solicitud.getNivelFatigaMedio())
                    .append(" (4-5: reduce volumen ~20%%; 1-2: sube la exigencia)\n");
        }

        return seccion.toString();
    }

    private String mapearUbicacionEntrenamiento(String ubicacion) {
        if (ubicacion == null) {
            return "Gimnasio";
        }

        return switch (ubicacion) {
            case "HOME" -> "Casa (equipamiento limitado)";
            case "GYM" -> "Gimnasio (equipamiento completo)";
            case "OUTDOOR" -> "Aire libre (sin equipamiento)";
            case "MIXED" -> "Mixto (casa y gimnasio)";
            default -> "Gimnasio";
        };
    }

    private String llamarOpenRouter(String prompt) {
        logger.info("Llamando a OpenRouter con modelo: {}", modeloOpenRouter);

        Map<String, Object> mensaje = Map.of(
                "role", "user",
                "content", prompt
        );

        Map<String, Object> cuerpoSolicitud = Map.of(
                "model", modeloOpenRouter,
                "messages", List.of(mensaje),
                "temperature", 0.7
        );

        try {
            HttpHeaders cabeceras = new HttpHeaders();
            cabeceras.setContentType(MediaType.APPLICATION_JSON);
            cabeceras.setBearerAuth(openRouterApiKey);
            cabeceras.set("HTTP-Referer", "https://cofira.app");
            cabeceras.set("X-Title", "Cofira");

            String cuerpoJson = objectMapper.writeValueAsString(cuerpoSolicitud);
            HttpEntity<String> solicitudHttp = new HttpEntity<>(cuerpoJson, cabeceras);

            logger.debug("Enviando solicitud a OpenRouter...");
            String respuestaCompleta = restTemplate.postForObject(OPENROUTER_URL, solicitudHttp, String.class);
            logger.debug("Respuesta completa recibida de OpenRouter");

            JsonNode nodoRespuesta = objectMapper.readTree(respuestaCompleta);

            JsonNode errorNode = nodoRespuesta.get("error");
            if (errorNode != null) {
                String mensajeError = errorNode.has("message") ? errorNode.get("message").asText() : "Error desconocido de OpenRouter";
                logger.error("OpenRouter devolvio error: {}", mensajeError);
                throw new RuntimeException("Error de OpenRouter: " + mensajeError);
            }

            JsonNode choices = nodoRespuesta.get("choices");
            if (choices == null || choices.isEmpty()) {
                logger.error("OpenRouter no devolvio choices. Respuesta completa: {}", respuestaCompleta);
                throw new RuntimeException("OpenRouter no devolvio choices en la respuesta");
            }

            String textoRespuesta = choices.get(0).get("message").get("content").asText();
            logger.info("Respuesta de OpenRouter recibida exitosamente, longitud: {} caracteres", textoRespuesta.length());

            return textoRespuesta;

        } catch (Exception excepcion) {
            logger.error("Error al comunicarse con OpenRouter: {}", excepcion.getMessage(), excepcion);
            throw new RuntimeException("Error al comunicarse con OpenRouter: " + excepcion.getMessage(), excepcion);
        }
    }

    private RutinaGeneradaDTO parsearRespuestaRutina(String respuestaJson) {
        try {
            String jsonLimpio = limpiarRespuestaJson(respuestaJson);
            logger.debug("JSON limpio para parsear rutina, longitud: {} caracteres", jsonLimpio.length());

            RutinaGeneradaDTO rutinaParsesada = objectMapper.readValue(jsonLimpio, RutinaGeneradaDTO.class);
            return rutinaParsesada;

        } catch (JsonProcessingException excepcion) {
            logger.error("Error al parsear respuesta de rutina. Respuesta original: {}", respuestaJson);
            logger.error("Detalle del error de parsing: {}", excepcion.getMessage());
            throw new RuntimeException("Error al parsear respuesta de OpenRouter: " + excepcion.getMessage(), excepcion);
        }
    }

    private String limpiarRespuestaJson(String respuesta) {
        if (respuesta == null || respuesta.isEmpty()) {
            logger.warn("Respuesta vacia recibida de OpenRouter");
            return "{}";
        }

        String respuestaLimpia = respuesta.trim();

        if (respuestaLimpia.startsWith("```json")) {
            respuestaLimpia = respuestaLimpia.substring(7);
            logger.debug("Eliminado prefijo ```json de la respuesta");
        } else if (respuestaLimpia.startsWith("```")) {
            respuestaLimpia = respuestaLimpia.substring(3);
            logger.debug("Eliminado prefijo ``` de la respuesta");
        }

        if (respuestaLimpia.endsWith("```")) {
            respuestaLimpia = respuestaLimpia.substring(0, respuestaLimpia.length() - 3);
            logger.debug("Eliminado sufijo ``` de la respuesta");
        }

        return respuestaLimpia.trim();
    }

    public boolean verificarConexion() {
        try {
            Map<String, Object> mensaje = Map.of(
                    "role", "user",
                    "content", "Responde solo: OK"
            );

            Map<String, Object> cuerpoSolicitud = Map.of(
                    "model", modeloOpenRouter,
                    "messages", List.of(mensaje),
                    "max_tokens", 10
            );

            HttpHeaders cabeceras = new HttpHeaders();
            cabeceras.setContentType(MediaType.APPLICATION_JSON);
            cabeceras.setBearerAuth(openRouterApiKey);
            cabeceras.set("HTTP-Referer", "https://cofira.app");

            String cuerpoJson = objectMapper.writeValueAsString(cuerpoSolicitud);
            HttpEntity<String> solicitudHttp = new HttpEntity<>(cuerpoJson, cabeceras);

            String respuesta = restTemplate.postForObject(OPENROUTER_URL, solicitudHttp, String.class);

            return respuesta != null;

        } catch (Exception excepcion) {
            // Sin este log el "conectado: false" no dice nunca su causa real
            logger.warn("Fallo verificando conexion con OpenRouter: {}", excepcion.getMessage());
            return false;
        }
    }

    // Cache en memoria: el mismo ejercicio no se busca dos veces en YouTube
    private final java.util.concurrent.ConcurrentHashMap<String, String> cacheVideosTecnica = new java.util.concurrent.ConcurrentHashMap<>();

    /* Primer resultado de YouTube para "tecnica {ejercicio}", sin API key: el
       videoId viaja dentro del HTML de la pagina de resultados */
    public String buscarVideoTecnica(String nombreEjercicio) {
        return cacheVideosTecnica.computeIfAbsent(nombreEjercicio.toLowerCase(), clave -> {
            try {
                /* Sin tildes: con "Pájaros" acentuado YouTube devolvia otro
                   ranking y colaba un press; normalizado sale el correcto */
                String nombreNormalizado = java.text.Normalizer.normalize(nombreEjercicio.toLowerCase(), java.text.Normalizer.Form.NFD)
                        .replaceAll("\\p{M}", "");
                String consulta = java.net.URLEncoder.encode("tecnica ejercicio " + nombreNormalizado, java.nio.charset.StandardCharsets.UTF_8);
                String html = restTemplate.getForObject("https://www.youtube.com/results?search_query=" + consulta, String.class);
                if (html == null) {
                    return "";
                }

                java.util.LinkedHashSet<String> candidatos = new java.util.LinkedHashSet<>();
                java.util.regex.Matcher buscador = java.util.regex.Pattern.compile("\"videoId\":\"([\\w-]{11})\"").matcher(html);
                while (buscador.find() && candidatos.size() < 10) {
                    candidatos.add(buscador.group(1));
                }

                /* El primer resultado no siempre es del ejercicio (nombres
                   ambiguos): gana el primer candidato cuyo TITULO contenga la
                   palabra clave del ejercicio */
                String palabraClave = extraerPalabraClave(nombreEjercicio);
                String primerCandidato = "";
                for (String videoId : candidatos) {
                    if (primerCandidato.isEmpty()) {
                        primerCandidato = videoId;
                    }
                    String titulo = obtenerTituloVideo(videoId);
                    if (titulo.contains(palabraClave)) {
                        return videoId;
                    }
                }
                return primerCandidato;
            } catch (Exception excepcion) {
                logger.warn("No se pudo buscar el video de tecnica de {}: {}", nombreEjercicio, excepcion.getMessage());
                return "";
            }
        });
    }

    // Primera palabra significativa del nombre, sin tildes ("Pájaros..." → "pajaros")
    private String extraerPalabraClave(String nombreEjercicio) {
        String normalizado = java.text.Normalizer.normalize(nombreEjercicio.toLowerCase(), java.text.Normalizer.Form.NFD)
                .replaceAll("\\p{M}", "");
        for (String palabra : normalizado.split("\\s+")) {
            if (palabra.length() > 3) {
                return palabra;
            }
        }
        return normalizado;
    }

    // Titulo del video via oembed, normalizado; vacio si el video no es embebible
    private String obtenerTituloVideo(String videoId) {
        try {
            String json = restTemplate.getForObject(
                    "https://www.youtube.com/oembed?url=https://www.youtube.com/watch?v=" + videoId + "&format=json",
                    String.class);
            if (json == null) {
                return "";
            }
            return java.text.Normalizer.normalize(json.toLowerCase(), java.text.Normalizer.Form.NFD).replaceAll("\\p{M}", "");
        } catch (Exception excepcion) {
            return "";
        }
    }

    // Comentario motivacional para la pagina de progreso, con datos reales del usuario
    public MotivacionDTO generarComentarioMotivacional(String resumenDatos) {
        String promptMotivacion = String.format("""
            Eres el entrenador personal de la app de fitness Cofira. Estos son los datos REALES
            de las ultimas dos semanas de tu cliente:

            %s

            Escribe en espanol, tuteando, cercano y motivador pero HONESTO (si ha entrenado poco,
            diselo con tacto y sin sermones). Menciona algun dato concreto de arriba.

            Responde UNICAMENTE con un JSON valido con esta estructura exacta, sin texto adicional:
            {
              "comentario": "2 o 3 frases sobre como va su progreso esta semana",
              "consejo": "1 frase con el consejo mas util para los proximos dias"
            }
            """, resumenDatos);

        String respuestaOpenRouter = llamarOpenRouter(promptMotivacion);
        return parsearRespuestaMotivacion(respuestaOpenRouter);
    }

    private MotivacionDTO parsearRespuestaMotivacion(String respuestaJson) {
        try {
            String jsonLimpio = limpiarRespuestaJson(respuestaJson);
            return objectMapper.readValue(jsonLimpio, MotivacionDTO.class);
        } catch (JsonProcessingException excepcion) {
            logger.error("Error al parsear respuesta de motivacion: {}", excepcion.getMessage());
            throw new RuntimeException("Error al parsear respuesta de OpenRouter: " + excepcion.getMessage(), excepcion);
        }
    }

    public MenuGeneradoDTO generarMenuDiario(GenerarMenuRequestDTO solicitud) {
        String promptGenerado = construirPromptMenuDiario(solicitud);

        String respuestaOpenRouter = llamarOpenRouter(promptGenerado);

        MenuGeneradoDTO menuParseado = parsearRespuestaMenu(respuestaOpenRouter);

        return menuParseado;
    }

    private String construirPromptMenuDiario(GenerarMenuRequestDTO solicitud) {
        String alergiasTexto = solicitud.getAlergias() != null && !solicitud.getAlergias().isEmpty()
                ? String.join(", ", solicitud.getAlergias())
                : "ninguna";

        String promptCompleto = String.format("""
            Genera un menu diario de alimentacion para una persona con estas caracteristicas:
            - Tipo de dieta: %s
            - Alergias o intolerancias: %s
            - Numero de comidas al dia: %d
            - Calorias diarias objetivo: %.0f kcal
            - Proteinas objetivo: %.0f gramos
            - Carbohidratos objetivo: %.0f gramos
            - Grasas objetivo: %.0f gramos
            - Objetivo principal: %s
            - Genero: %s
            - Edad: %d anos

            IMPORTANTE - ALERGIAS:
            - NO incluyas ningun alimento que contenga los alergenos indicados
            - Distribuye las calorias y macros de forma equilibrada entre las comidas

            IMPORTANTE - COHERENCIA DE INGREDIENTES:
            - Cada comida tiene un array de "alimentos" que son los INGREDIENTES del plato
            - Los ingredientes DEBEN corresponder logicamente con el nombre del plato
            - Ejemplo correcto: "Pizza casera" tiene ingredientes: harina, tomate, queso, etc.
            - Ejemplo incorrecto: "Proteina en polvo" NO debe tener harina, queso, etc. Solo: proteina en polvo
            - Si el plato es un ingrediente simple (batido de proteina, fruta, yogur), solo lista ESE ingrediente
            - Los gramos de cada ingrediente deben sumar aproximadamente el peso total de la porcion del plato
            - Las calorias de los ingredientes deben ser coherentes con caloriasEstimadas del plato

            IMPORTANTE - PREPARACION COMO RECETA REAL:
            - El campo "preparacion" son 2-4 pasos NUMERADOS ("1. ... 2. ... 3. ...")
            - Cada paso de coccion indica TIEMPO en minutos y nivel de fuego o temperatura
              (ej: "1. Sofrie la cebolla 5 min a fuego medio. 2. Anade el arroz y cuece 18 min...")
            - Nada de "cocinar hasta que este listo": tiempos concretos siempre

            Responde UNICAMENTE con un JSON valido con esta estructura exacta, sin texto adicional:
            {
              "comidas": [
                {
                  "tipoComida": "DESAYUNO",
                  "nombre": "Tostadas con aguacate y huevos",
                  "caloriasEstimadas": 450,
                  "proteinasGramos": 20,
                  "carbohidratosGramos": 35,
                  "grasasGramos": 25,
                  "alimentos": [
                    {
                      "nombre": "Pan integral",
                      "cantidad": "2 rebanadas",
                      "gramos": 60,
                      "icono": "pan"
                    }
                  ],
                  "preparacion": "1. Primer paso con tiempo y fuego concretos. 2. Segundo paso. 3. Ultimo paso"
                }
              ],
              "resumenNutricional": {
                "caloriasTotal": 2000,
                "proteinasTotal": 120,
                "carbohidratosTotal": 200,
                "grasasTotal": 70
              }
            }

            Los tipos de comida validos son: DESAYUNO, ALMUERZO, COMIDA, MERIENDA, CENA
            Los iconos validos son: pan, fruta, verdura, proteina, lacteo, bebida, cereal, legumbre, fruto-seco
            """,
                solicitud.getTipoDieta(),
                alergiasTexto,
                solicitud.getComidasPorDia(),
                solicitud.getCaloriasDiarias(),
                solicitud.getProteinasGramos(),
                solicitud.getCarbohidratosGramos(),
                solicitud.getGrasasGramos(),
                solicitud.getObjetivoPrincipal(),
                solicitud.getGenero(),
                solicitud.getEdad()
        );

        return promptCompleto;
    }

    private MenuGeneradoDTO parsearRespuestaMenu(String respuestaJson) {
        try {
            String jsonLimpio = limpiarRespuestaJson(respuestaJson);
            MenuGeneradoDTO menuParseado = objectMapper.readValue(jsonLimpio, MenuGeneradoDTO.class);
            normalizarCapitalizacionMenu(menuParseado);
            return menuParseado;

        } catch (JsonProcessingException excepcion) {
            logger.error("Error al parsear respuesta de menu. Respuesta original: {}", respuestaJson);
            throw new RuntimeException("Error al parsear respuesta de menu de OpenRouter: " + excepcion.getMessage(), excepcion);
        }
    }

    private void normalizarCapitalizacionMenu(MenuGeneradoDTO menu) {
        if (menu == null || menu.getComidas() == null) {
            return;
        }

        for (ComidaGeneradaDTO comida : menu.getComidas()) {
            if (comida.getNombre() != null) {
                comida.setNombre(capitalizarEstiloEspanol(comida.getNombre()));
            }

            if (comida.getAlimentos() != null) {
                for (AlimentoGeneradoDTO alimento : comida.getAlimentos()) {
                    if (alimento.getNombre() != null) {
                        alimento.setNombre(capitalizarEstiloEspanol(alimento.getNombre()));
                    }
                    if (alimento.getCantidad() != null) {
                        alimento.setCantidad(capitalizarEstiloEspanol(alimento.getCantidad()));
                    }
                }
            }
        }
    }

    private String capitalizarEstiloEspanol(String texto) {
        if (texto == null || texto.isEmpty()) {
            return texto;
        }

        String textoMinusculas = texto.toLowerCase();
        String primeraLetra = textoMinusculas.substring(0, 1).toUpperCase();
        String restoTexto = textoMinusculas.substring(1);

        return primeraLetra + restoTexto;
    }

    public MenuSemanalGeneradoDTO generarMenuSemanal(GenerarMenuRequestDTO solicitud) {
        List<MenuDiaDTO> menusPorDia = new ArrayList<>();

        LocalDate hoy = LocalDate.now();
        LocalDate lunesSemanaActual = hoy.with(DayOfWeek.MONDAY);
        LocalDate fechaInicio = lunesSemanaActual;

        List<String> platosYaGenerados = new ArrayList<>();

        for (int indiceDia = 0; indiceDia < 14; indiceDia++) {
            LocalDate fechaDelDia = fechaInicio.plusDays(indiceDia);
            int numeroDia = indiceDia + 1;

            String promptDelDia = construirPromptMenuDelDia(solicitud, numeroDia, platosYaGenerados);

            String respuestaOpenRouter = llamarOpenRouter(promptDelDia);

            MenuGeneradoDTO menuDelDia = parsearRespuestaMenu(respuestaOpenRouter);

            MenuDiaDTO menuDiaDTO = MenuDiaDTO.builder()
                    .fecha(fechaDelDia.toString())
                    .numeroDia(numeroDia)
                    .comidas(menuDelDia.getComidas())
                    .resumenNutricional(menuDelDia.getResumenNutricional())
                    .build();

            menusPorDia.add(menuDiaDTO);

            List<ComidaGeneradaDTO> comidasDelDia = menuDelDia.getComidas();
            java.util.stream.Stream<String> streamNombres = comidasDelDia.stream().map(ComidaGeneradaDTO::getNombre);
            List<String> nombresDelDia = streamNombres.collect(Collectors.toList());
            platosYaGenerados.addAll(nombresDelDia);
        }

        MenuSemanalGeneradoDTO menuSemanal = MenuSemanalGeneradoDTO.builder()
                .menusPorDia(menusPorDia)
                .fechaInicio(fechaInicio.toString())
                .fechaFin(fechaInicio.plusDays(13).toString())
                .build();

        return menuSemanal;
    }

    public void generarMenuSemanalConStreaming(GenerarMenuRequestDTO solicitud, SseEmitter emisorEventos) {
        LocalDate hoy = LocalDate.now();
        LocalDate lunesSemanaActual = hoy.with(DayOfWeek.MONDAY);
        LocalDate fechaInicio = lunesSemanaActual;

        List<String> platosYaGenerados = new ArrayList<>();
        int totalDias = 14;

        try {
            Map<String, String> eventoInicio = Map.of(
                "tipo", "inicio",
                "totalDias", String.valueOf(totalDias),
                "fechaInicio", fechaInicio.toString(),
                "fechaFin", fechaInicio.plusDays(totalDias - 1).toString()
            );
            emisorEventos.send(SseEmitter.event()
                .name("inicio")
                .data(objectMapper.writeValueAsString(eventoInicio)));

            for (int indiceDia = 0; indiceDia < totalDias; indiceDia++) {
                LocalDate fechaDelDia = fechaInicio.plusDays(indiceDia);
                int numeroDia = indiceDia + 1;

                String promptDelDia = construirPromptMenuDelDia(solicitud, numeroDia, platosYaGenerados);
                String respuestaOpenRouter = llamarOpenRouter(promptDelDia);
                MenuGeneradoDTO menuDelDia = parsearRespuestaMenu(respuestaOpenRouter);

                MenuDiaDTO menuDiaDTO = MenuDiaDTO.builder()
                    .fecha(fechaDelDia.toString())
                    .numeroDia(numeroDia)
                    .comidas(menuDelDia.getComidas())
                    .resumenNutricional(menuDelDia.getResumenNutricional())
                    .build();

                String menuDiaJson = objectMapper.writeValueAsString(menuDiaDTO);
                emisorEventos.send(SseEmitter.event()
                    .name("menu-dia")
                    .data(menuDiaJson));

                List<ComidaGeneradaDTO> comidasDelDiaStream = menuDelDia.getComidas();
                java.util.stream.Stream<String> streamNombresComidas = comidasDelDiaStream.stream().map(ComidaGeneradaDTO::getNombre);
                List<String> nombresDelDia = streamNombresComidas.collect(Collectors.toList());
                platosYaGenerados.addAll(nombresDelDia);
            }

            Map<String, String> eventoFin = Map.of("tipo", "completado");
            emisorEventos.send(SseEmitter.event()
                .name("fin")
                .data(objectMapper.writeValueAsString(eventoFin)));

            emisorEventos.complete();

        } catch (IOException excepcion) {
            emisorEventos.completeWithError(excepcion);
        } catch (Exception excepcion) {
            try {
                Map<String, String> eventoError = Map.of(
                    "tipo", "error",
                    "mensaje", excepcion.getMessage() != null ? excepcion.getMessage() : "Error desconocido"
                );
                emisorEventos.send(SseEmitter.event()
                    .name("error")
                    .data(objectMapper.writeValueAsString(eventoError)));
            } catch (IOException ioExcepcion) {
                emisorEventos.completeWithError(ioExcepcion);
            }
            emisorEventos.completeWithError(excepcion);
        }
    }

    private String construirPromptMenuDelDia(GenerarMenuRequestDTO solicitud, int numeroDia, List<String> platosYaGenerados) {
        String alergiasTexto = solicitud.getAlergias() != null && !solicitud.getAlergias().isEmpty()
                ? String.join(", ", solicitud.getAlergias())
                : "ninguna";

        String platosEvitarTexto = platosYaGenerados.isEmpty()
                ? "ninguno (es el primer dia)"
                : String.join(", ", platosYaGenerados);

        String promptCompleto = String.format("""
            Genera el menu del DIA %d de 14 para una persona con estas caracteristicas:
            - Tipo de dieta: %s
            - Alergias o intolerancias: %s
            - Numero de comidas al dia: %d
            - Calorias diarias objetivo: %.0f kcal
            - Proteinas objetivo: %.0f gramos
            - Carbohidratos objetivo: %.0f gramos
            - Grasas objetivo: %.0f gramos
            - Objetivo principal: %s
            - Genero: %s
            - Edad: %d anos

            IMPORTANTE - REGLAS DE VARIEDAD:
            - Este es el dia %d de un plan de 14 dias
            - NO repitas estos platos que ya se generaron en dias anteriores: %s
            - Genera platos DIFERENTES y VARIADOS para mantener la dieta interesante
            - Usa ingredientes de temporada y recetas distintas cada dia
            - Prioriza platos REALES de cocina espanola y mediterranea (guisos, plancha, horno),
              con nombres apetecibles, y ajusta las raciones al objetivo de la persona

            IMPORTANTE - ALERGIAS:
            - NO incluyas ningun alimento que contenga los alergenos indicados
            - Distribuye las calorias y macros de forma equilibrada entre las comidas

            IMPORTANTE - COHERENCIA DE INGREDIENTES:
            - Cada comida tiene un array de "alimentos" que son los INGREDIENTES del plato
            - Los ingredientes DEBEN corresponder logicamente con el nombre del plato
            - Ejemplo correcto: "Pizza casera" tiene ingredientes: harina, tomate, queso, etc.
            - Ejemplo incorrecto: "Proteina en polvo" NO debe tener harina, queso, etc. Solo: proteina en polvo
            - Si el plato es un ingrediente simple (batido de proteina, fruta, yogur), solo lista ESE ingrediente
            - Los gramos de cada ingrediente deben sumar aproximadamente el peso total de la porcion del plato
            - Las calorias de los ingredientes deben ser coherentes con caloriasEstimadas del plato

            IMPORTANTE - PREPARACION COMO RECETA REAL:
            - El campo "preparacion" son 2-4 pasos NUMERADOS ("1. ... 2. ... 3. ...")
            - Cada paso de coccion indica TIEMPO en minutos y nivel de fuego o temperatura
              (ej: "1. Sofrie la cebolla 5 min a fuego medio. 2. Anade el arroz y cuece 18 min...")
            - Nada de "cocinar hasta que este listo": tiempos concretos siempre

            Responde UNICAMENTE con un JSON valido con esta estructura exacta, sin texto adicional:
            {
              "comidas": [
                {
                  "tipoComida": "DESAYUNO",
                  "nombre": "Nombre del plato",
                  "caloriasEstimadas": 450,
                  "proteinasGramos": 20,
                  "carbohidratosGramos": 35,
                  "grasasGramos": 25,
                  "alimentos": [
                    {
                      "nombre": "Ingrediente",
                      "cantidad": "cantidad descriptiva",
                      "gramos": 60,
                      "icono": "pan"
                    }
                  ],
                  "preparacion": "1. Primer paso con tiempo y fuego concretos. 2. Segundo paso. 3. Ultimo paso"
                }
              ],
              "resumenNutricional": {
                "caloriasTotal": 2000,
                "proteinasTotal": 120,
                "carbohidratosTotal": 200,
                "grasasTotal": 70
              }
            }

            Los tipos de comida validos son: DESAYUNO, ALMUERZO, COMIDA, MERIENDA, CENA
            Los iconos validos son: pan, fruta, verdura, proteina, lacteo, bebida, cereal, legumbre, fruto-seco
            """,
                numeroDia,
                solicitud.getTipoDieta(),
                alergiasTexto,
                solicitud.getComidasPorDia(),
                solicitud.getCaloriasDiarias(),
                solicitud.getProteinasGramos(),
                solicitud.getCarbohidratosGramos(),
                solicitud.getGrasasGramos(),
                solicitud.getObjetivoPrincipal(),
                solicitud.getGenero(),
                solicitud.getEdad(),
                numeroDia,
                platosEvitarTexto
        );

        return promptCompleto;
    }

    public AnalisisImagenDTO analizarImagenComida(String imagenBase64) {
        logger.info("Analizando imagen de comida con modelo de vision");

        String promptAnalisis = """
            Analiza esta imagen de comida y proporciona una estimacion nutricional.

            IMPORTANTE:
            - Identifica el plato o comida que aparece en la imagen
            - Estima las calorias basandote en una porcion normal
            - Estima los macronutrientes (proteinas, carbohidratos, grasas) en gramos
            - Lista los ingredientes principales que puedas identificar
            - Indica tu nivel de confianza: "alta" si la imagen es clara y la comida es reconocible,
              "media" si hay algo de incertidumbre, "baja" si la imagen es borrosa o dificil de identificar

            Responde UNICAMENTE con un JSON valido con esta estructura exacta:
            {
              "nombreComida": "Nombre descriptivo del plato",
              "caloriasEstimadas": 450,
              "proteinasGramos": 25,
              "carbohidratosGramos": 40,
              "grasasGramos": 20,
              "ingredientesDetectados": ["ingrediente1", "ingrediente2"],
              "confianza": "alta"
            }
            """;

        String respuestaOpenRouter = llamarOpenRouterConVision(promptAnalisis, imagenBase64);
        AnalisisImagenDTO analisisParseado = parsearRespuestaAnalisis(respuestaOpenRouter);

        logger.info("Imagen analizada: {} con confianza {}",
            analisisParseado.getNombreComida(),
            analisisParseado.getConfianza());

        return analisisParseado;
    }

    private String llamarOpenRouterConVision(String prompt, String imagenBase64) {
        logger.info("Llamando a OpenRouter con modelo de vision: openai/gpt-4o");

        String formatoImagen = detectarFormatoImagen(imagenBase64);
        String dataUri = "data:image/" + formatoImagen + ";base64," + imagenBase64;

        List<Map<String, Object>> contenidoMensaje = List.of(
            Map.of("type", "text", "text", prompt),
            Map.of("type", "image_url", "image_url", Map.of("url", dataUri))
        );

        Map<String, Object> mensaje = Map.of(
            "role", "user",
            "content", contenidoMensaje
        );

        Map<String, Object> cuerpoSolicitud = Map.of(
            "model", "openai/gpt-4o",
            "messages", List.of(mensaje),
            "temperature", 0.3,
            "max_tokens", 1000
        );

        try {
            HttpHeaders cabeceras = new HttpHeaders();
            cabeceras.setContentType(MediaType.APPLICATION_JSON);
            cabeceras.setBearerAuth(openRouterApiKey);
            cabeceras.set("HTTP-Referer", "https://cofira.app");
            cabeceras.set("X-Title", "Cofira - Analisis de Comida");

            String cuerpoJson = objectMapper.writeValueAsString(cuerpoSolicitud);
            HttpEntity<String> solicitudHttp = new HttpEntity<>(cuerpoJson, cabeceras);

            logger.debug("Enviando imagen a OpenRouter para analisis...");
            String respuestaCompleta = restTemplate.postForObject(OPENROUTER_URL, solicitudHttp, String.class);

            JsonNode nodoRespuesta = objectMapper.readTree(respuestaCompleta);

            JsonNode errorNode = nodoRespuesta.get("error");
            if (errorNode != null) {
                String mensajeError = errorNode.has("message") ? errorNode.get("message").asText() : "Error desconocido";
                logger.error("OpenRouter devolvio error en analisis de imagen: {}", mensajeError);
                throw new RuntimeException("Error de OpenRouter: " + mensajeError);
            }

            JsonNode choices = nodoRespuesta.get("choices");
            if (choices == null || choices.isEmpty()) {
                throw new RuntimeException("OpenRouter no devolvio choices en la respuesta");
            }

            String textoRespuesta = choices.get(0).get("message").get("content").asText();
            logger.info("Respuesta de analisis de imagen recibida");

            return textoRespuesta;

        } catch (Exception excepcion) {
            logger.error("Error al analizar imagen con OpenRouter: {}", excepcion.getMessage());
            throw new RuntimeException("Error al analizar imagen: " + excepcion.getMessage(), excepcion);
        }
    }

    private String detectarFormatoImagen(String base64) {
        if (base64.startsWith("/9j/")) {
            return "jpeg";
        } else if (base64.startsWith("iVBOR")) {
            return "png";
        } else if (base64.startsWith("UklGR")) {
            return "webp";
        }
        return "jpeg";
    }

    private AnalisisImagenDTO parsearRespuestaAnalisis(String respuestaJson) {
        try {
            String jsonLimpio = limpiarRespuestaJson(respuestaJson);
            AnalisisImagenDTO analisisParseado = objectMapper.readValue(jsonLimpio, AnalisisImagenDTO.class);
            return analisisParseado;

        } catch (JsonProcessingException excepcion) {
            logger.error("Error al parsear respuesta de analisis: {}", excepcion.getMessage());
            return AnalisisImagenDTO.builder()
                .nombreComida("Comida no identificada")
                .caloriasEstimadas(300)
                .proteinasGramos(15)
                .carbohidratosGramos(30)
                .grasasGramos(15)
                .ingredientesDetectados(List.of("No identificados"))
                .confianza("baja")
                .build();
        }
    }
}
