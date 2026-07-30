package com.cofira.controllers;

import com.cofira.api.RutinaEjercicioControllerApi;
import com.cofira.dto.gimnasio.FeedbackEjercicioDTO;
import com.cofira.dto.gimnasio.GuardarProgresoRequestDTO;
import com.cofira.dto.gimnasio.HistorialEntrenamientoDTO;
import com.cofira.dto.gimnasio.MotivacionDTO;
import com.cofira.dto.ollama.GenerarRutinaRequestDTO;
import com.cofira.dto.ollama.RutinaGeneradaDTO;
import com.cofira.dto.rutinaejercicio.CrearRutinaEjercicioDTO;
import com.cofira.dto.rutinaejercicio.RutinaEjercicioDTO;
import com.cofira.entities.Usuario;
import com.cofira.repositories.UsuarioRepository;
import com.cofira.services.GeminiService;
import com.cofira.services.RutinaEjercicioService;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;
import java.util.Optional;

@RestController
@RequestMapping("/api/rutinas-ejercicio")
public class RutinaEjercicioController implements RutinaEjercicioControllerApi {

    private final RutinaEjercicioService rutinaEjercicioService;
    private final GeminiService geminiService;
    private final UsuarioRepository usuarioRepository;

    public RutinaEjercicioController(RutinaEjercicioService rutinaEjercicioService,
                                     GeminiService geminiService,
                                     UsuarioRepository usuarioRepository) {
        this.rutinaEjercicioService = rutinaEjercicioService;
        this.geminiService = geminiService;
        this.usuarioRepository = usuarioRepository;
    }

    @GetMapping
    public ResponseEntity<List<RutinaEjercicioDTO>> listarRutinas() {
        List<RutinaEjercicioDTO> rutinas = rutinaEjercicioService.listarRutinas();
        return ResponseEntity.ok(rutinas);
    }

    @GetMapping("/{id}")
    public ResponseEntity<RutinaEjercicioDTO> obtenerRutina(@PathVariable Long id) {
        RutinaEjercicioDTO rutina = rutinaEjercicioService.obtenerRutina(id);
        return ResponseEntity.ok(rutina);
    }

    @PostMapping
    public ResponseEntity<RutinaEjercicioDTO> crearRutina(@RequestBody @Valid CrearRutinaEjercicioDTO dto) {
        RutinaEjercicioDTO nuevaRutina = rutinaEjercicioService.crearRutina(dto);
        return ResponseEntity.status(HttpStatus.CREATED).body(nuevaRutina);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<?> eliminarRutina(@PathVariable Long id) {
        rutinaEjercicioService.eliminarRutina(id);
        return ResponseEntity.noContent().build();
    }

    @PostMapping("/generar")
    public ResponseEntity<RutinaGeneradaDTO> generarRutinaConIA(@RequestBody @Valid GenerarRutinaRequestDTO solicitud) {
        RutinaGeneradaDTO rutinaGenerada = geminiService.generarRutinaEjercicio(solicitud);
        return ResponseEntity.ok(rutinaGenerada);
    }

    @GetMapping("/ia/estado")
    public ResponseEntity<Map<String, Object>> verificarEstadoIA() {
        boolean conexionActiva = geminiService.verificarConexion();
        Map<String, Object> respuesta = Map.of(
            "conectado", conexionActiva,
            "mensaje", conexionActiva ? "Gemini funcionando correctamente" : "No se puede conectar con Gemini"
        );
        return ResponseEntity.ok(respuesta);
    }

    @PostMapping("/feedback")
    public ResponseEntity<FeedbackEjercicioDTO> guardarFeedback(@RequestBody @Valid FeedbackEjercicioDTO feedbackDTO,
                                                                @AuthenticationPrincipal UserDetails userDetails) {
        Usuario usuario = obtenerUsuarioDesdeUserDetails(userDetails);
        FeedbackEjercicioDTO feedbackGuardado = rutinaEjercicioService.guardarFeedback(feedbackDTO, usuario);
        return ResponseEntity.status(HttpStatus.CREATED).body(feedbackGuardado);
    }

    @GetMapping("/feedback/ultimo")
    public ResponseEntity<FeedbackEjercicioDTO> obtenerUltimoFeedback(@AuthenticationPrincipal UserDetails userDetails) {
        Usuario usuario = obtenerUsuarioDesdeUserDetails(userDetails);
        Optional<FeedbackEjercicioDTO> ultimoFeedback = rutinaEjercicioService.obtenerUltimoFeedback(usuario.getId());

        if (ultimoFeedback.isPresent()) {
            return ResponseEntity.ok(ultimoFeedback.get());
        }

        return ResponseEntity.noContent().build();
    }

    @GetMapping("/feedback/semana/{semana}")
    public ResponseEntity<FeedbackEjercicioDTO> obtenerFeedbackPorSemana(@PathVariable Integer semana,
                                                                         @AuthenticationPrincipal UserDetails userDetails) {
        Usuario usuario = obtenerUsuarioDesdeUserDetails(userDetails);
        Optional<FeedbackEjercicioDTO> feedbackSemana = rutinaEjercicioService.obtenerFeedbackPorSemana(semana, usuario.getId());

        if (feedbackSemana.isPresent()) {
            return ResponseEntity.ok(feedbackSemana.get());
        }

        return ResponseEntity.noContent().build();
    }

    @GetMapping("/feedback/semana/{semana}/todos")
    public ResponseEntity<List<FeedbackEjercicioDTO>> obtenerFeedbacksDeLaSemana(@PathVariable Integer semana,
                                                                                 @AuthenticationPrincipal UserDetails userDetails) {
        Usuario usuario = obtenerUsuarioDesdeUserDetails(userDetails);
        List<FeedbackEjercicioDTO> feedbacks = rutinaEjercicioService.obtenerFeedbacksDeLaSemana(semana, usuario.getId());
        return ResponseEntity.ok(feedbacks);
    }

    @PostMapping("/progreso")
    public ResponseEntity<List<HistorialEntrenamientoDTO>> guardarProgreso(@RequestBody @Valid GuardarProgresoRequestDTO progresoDTO,
                                                                           @AuthenticationPrincipal UserDetails userDetails) {
        Usuario usuario = obtenerUsuarioDesdeUserDetails(userDetails);
        List<HistorialEntrenamientoDTO> progresosGuardados = rutinaEjercicioService.guardarProgreso(progresoDTO, usuario);
        return ResponseEntity.status(HttpStatus.CREATED).body(progresosGuardados);
    }

    @GetMapping("/progreso/semana/{semana}")
    public ResponseEntity<List<HistorialEntrenamientoDTO>> obtenerProgresoPorSemana(@PathVariable Integer semana,
                                                                                    @AuthenticationPrincipal UserDetails userDetails) {
        Usuario usuario = obtenerUsuarioDesdeUserDetails(userDetails);
        List<HistorialEntrenamientoDTO> progresosSemana = rutinaEjercicioService.obtenerProgresoPorSemana(semana, usuario.getId());
        return ResponseEntity.ok(progresosSemana);
    }

    @GetMapping("/progreso/estadisticas")
    public ResponseEntity<Map<String, Object>> obtenerEstadisticas(@AuthenticationPrincipal UserDetails userDetails) {
        Usuario usuario = obtenerUsuarioDesdeUserDetails(userDetails);
        Map<String, Object> estadisticas = rutinaEjercicioService.calcularEstadisticas(usuario.getId());
        return ResponseEntity.ok(estadisticas);
    }

    @GetMapping("/semana-actual")
    public ResponseEntity<Map<String, Integer>> obtenerSemanaActual(@AuthenticationPrincipal UserDetails userDetails) {
        Usuario usuario = obtenerUsuarioDesdeUserDetails(userDetails);
        Integer semanaActual = rutinaEjercicioService.calcularSemanaActual(usuario.getId());
        Map<String, Integer> respuesta = Map.of("semanaActual", semanaActual);
        return ResponseEntity.ok(respuesta);
    }

    @GetMapping("/ejercicios-unicos")
    public ResponseEntity<List<String>> obtenerEjerciciosUnicos(@AuthenticationPrincipal UserDetails userDetails) {
        Usuario usuario = obtenerUsuarioDesdeUserDetails(userDetails);
        List<String> ejercicios = rutinaEjercicioService.obtenerEjerciciosUnicos(usuario.getId());
        return ResponseEntity.ok(ejercicios);
    }

    @GetMapping("/progreso/ejercicio/{nombreEjercicio}")
    public ResponseEntity<List<HistorialEntrenamientoDTO>> obtenerProgresoPorEjercicio(@PathVariable String nombreEjercicio,
                                                                                       @AuthenticationPrincipal UserDetails userDetails) {
        Usuario usuario = obtenerUsuarioDesdeUserDetails(userDetails);
        List<HistorialEntrenamientoDTO> progreso = rutinaEjercicioService.obtenerProgresoPorEjercicio(nombreEjercicio, usuario.getId());
        return ResponseEntity.ok(progreso);
    }

    @GetMapping("/mi-rutina")
    public ResponseEntity<RutinaGeneradaDTO> obtenerMiRutina(@AuthenticationPrincipal UserDetails userDetails) {
        Usuario usuario = obtenerUsuarioDesdeUserDetails(userDetails);
        Optional<RutinaGeneradaDTO> miRutinaOptional = rutinaEjercicioService.obtenerMiRutina(usuario.getId());

        if (miRutinaOptional.isPresent()) {
            return ResponseEntity.ok(miRutinaOptional.get());
        }

        return ResponseEntity.noContent().build();
    }

    @GetMapping("/video-tecnica")
    public ResponseEntity<Map<String, String>> obtenerVideoTecnica(@RequestParam String ejercicio) {
        String videoId = geminiService.buscarVideoTecnica(ejercicio);
        return ResponseEntity.ok(Map.of("videoId", videoId));
    }

    @GetMapping("/motivacion")
    public ResponseEntity<MotivacionDTO> obtenerComentarioMotivacional(@AuthenticationPrincipal UserDetails userDetails) {
        Usuario usuario = obtenerUsuarioDesdeUserDetails(userDetails);
        String resumenDatos = construirResumenParaMotivacion(usuario);
        MotivacionDTO motivacion = geminiService.generarComentarioMotivacional(resumenDatos);
        return ResponseEntity.ok(motivacion);
    }

    // Resumen en texto plano de los ultimos 14 dias: es lo que lee la IA para motivar
    private String construirResumenParaMotivacion(Usuario usuario) {
        List<HistorialEntrenamientoDTO> historial = rutinaEjercicioService.obtenerHistorialReciente(usuario.getId(), 14);

        long ejerciciosCompletados = historial.stream()
                .filter(registro -> Boolean.TRUE.equals(registro.getCompletado()))
                .count();
        long diasEntrenados = historial.stream()
                .filter(registro -> Boolean.TRUE.equals(registro.getCompletado()))
                .map(HistorialEntrenamientoDTO::getFechaEntrenamiento)
                .distinct()
                .count();

        StringBuilder resumen = new StringBuilder();
        resumen.append("- Dias entrenados en los ultimos 14 dias: ").append(diasEntrenados).append("\n");
        resumen.append("- Ejercicios completados en ese periodo: ").append(ejerciciosCompletados).append("\n");

        Optional<FeedbackEjercicioDTO> ultimoFeedback = rutinaEjercicioService.obtenerUltimoFeedback(usuario.getId());
        ultimoFeedback.ifPresent(feedback -> {
            if (feedback.getComentarios() != null && !feedback.getComentarios().isEmpty()) {
                resumen.append("- Ultimo comentario tras entrenar: \"").append(feedback.getComentarios()).append("\"\n");
            }
            if (feedback.getNivelFatiga() != null) {
                resumen.append("- Ultima fatiga reportada (1 facil - 5 agotado): ").append(feedback.getNivelFatiga()).append("\n");
            }
        });

        if (historial.isEmpty()) {
            resumen.append("- Todavia no ha registrado ningun entrenamiento en la app\n");
        }

        return resumen.toString();
    }

    private Usuario obtenerUsuarioDesdeUserDetails(UserDetails userDetails) {
        return usuarioRepository.findByUsername(userDetails.getUsername())
                .orElseThrow(() -> new RuntimeException("Usuario no encontrado"));
    }
}
