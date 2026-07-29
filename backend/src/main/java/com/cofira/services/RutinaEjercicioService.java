package com.cofira.services;

import com.cofira.dto.ejercicios.EjerciciosDTO;
import com.cofira.dto.gimnasio.EjercicioProgresoDTO;
import com.cofira.dto.gimnasio.FeedbackEjercicioDTO;
import com.cofira.dto.gimnasio.GuardarProgresoRequestDTO;
import com.cofira.dto.gimnasio.HistorialEntrenamientoDTO;
import com.cofira.dto.rutinaejercicio.*;
import com.cofira.entities.DiaEjercicio;
import com.cofira.entities.Ejercicios;
import com.cofira.entities.FeedbackEjercicio;
import com.cofira.entities.HistorialEntrenamiento;
import com.cofira.entities.RutinaEjercicio;
import com.cofira.enums.DiaSemana;
import com.cofira.exceptions.RecursoNoEncontradoException;
import com.cofira.repositories.EjerciciosRepository;
import com.cofira.repositories.FeedbackEjercicioRepository;
import com.cofira.repositories.HistorialEntrenamientoRepository;
import com.cofira.repositories.RutinaEjercicioRepository;
import com.cofira.repositories.UsuarioRepository;
import com.cofira.entities.Usuario;
import com.cofira.dto.ollama.RutinaGeneradaDTO;
import com.cofira.dto.ollama.DiaEjercicioGeneradoDTO;
import com.cofira.dto.ollama.EjercicioGeneradoDTO;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDate;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.Optional;
import java.util.stream.Collectors;

@Service
public class RutinaEjercicioService {
    private static final String RUTINA_NO_ENCONTRADA = "Rutina de ejercicio no encontrada con id ";
    private static final String EJERCICIO_NO_ENCONTRADO = "Ejercicio no encontrado con id ";

    private final RutinaEjercicioRepository rutinaEjercicioRepository;
    private final EjerciciosRepository ejerciciosRepository;
    private final FeedbackEjercicioRepository feedbackEjercicioRepository;
    private final HistorialEntrenamientoRepository historialEntrenamientoRepository;
    private final UsuarioRepository usuarioRepository;

    public RutinaEjercicioService(RutinaEjercicioRepository rutinaEjercicioRepository,
                                  EjerciciosRepository ejerciciosRepository,
                                  FeedbackEjercicioRepository feedbackEjercicioRepository,
                                  HistorialEntrenamientoRepository historialEntrenamientoRepository,
                                  UsuarioRepository usuarioRepository) {
        this.rutinaEjercicioRepository = rutinaEjercicioRepository;
        this.ejerciciosRepository = ejerciciosRepository;
        this.feedbackEjercicioRepository = feedbackEjercicioRepository;
        this.historialEntrenamientoRepository = historialEntrenamientoRepository;
        this.usuarioRepository = usuarioRepository;
    }

    public List<RutinaEjercicioDTO> listarRutinas() {
        List<RutinaEjercicio> listaRutinas = rutinaEjercicioRepository.findAll();
        java.util.stream.Stream<RutinaEjercicioDTO> streamMapeado = listaRutinas.stream().map(this::convertirADTO);
        return streamMapeado.collect(Collectors.toList());
    }

    public RutinaEjercicioDTO obtenerRutina(Long id) {
        RutinaEjercicio rutina = rutinaEjercicioRepository.findById(id)
                .orElseThrow(() -> new RecursoNoEncontradoException(RUTINA_NO_ENCONTRADA + id));
        return convertirADTO(rutina);
    }

    @Transactional
    public RutinaEjercicioDTO crearRutina(CrearRutinaEjercicioDTO dto) {
        RutinaEjercicio rutina = new RutinaEjercicio();
        rutina.setFechaInicio(dto.getFechaInicio());

        List<CrearDiaEjercicioDTO> listaDiasDTO = dto.getDiasEjercicio();
        java.util.stream.Stream<DiaEjercicio> streamDiasMapeados = listaDiasDTO.stream().map(this::convertirDiaEjercicioDTOAEntidad);
        List<DiaEjercicio> dias = streamDiasMapeados.collect(Collectors.toList());

        rutina.setDiasEjercicio(dias);

        RutinaEjercicio guardada = rutinaEjercicioRepository.save(rutina);
        return convertirADTO(guardada);
    }

    @Transactional
    public void eliminarRutina(Long id) {
        RutinaEjercicio rutina = rutinaEjercicioRepository.findById(id)
                .orElseThrow(() -> new RecursoNoEncontradoException(RUTINA_NO_ENCONTRADA + id));
        rutinaEjercicioRepository.delete(rutina);
    }

    public RutinaEjercicioDTO convertirADTO(RutinaEjercicio rutina) {
        RutinaEjercicioDTO dto = new RutinaEjercicioDTO();
        dto.setId(rutina.getId());
        dto.setFechaInicio(rutina.getFechaInicio());

        if (rutina.getDiasEjercicio() != null) {
            List<DiaEjercicio> listaDias = rutina.getDiasEjercicio();
            java.util.stream.Stream<DiaEjercicioDTO> streamDiasMapeados = listaDias.stream().map(this::convertirDiaEjercicioADTO);
            List<DiaEjercicioDTO> diasDTO = streamDiasMapeados.collect(Collectors.toList());
            dto.setDiasEjercicio(diasDTO);
        }

        return dto;
    }

    private DiaEjercicioDTO convertirDiaEjercicioADTO(DiaEjercicio dia) {
        DiaEjercicioDTO dto = new DiaEjercicioDTO();
        dto.setId(dia.getId());
        dto.setDiaSemana(dia.getDiaSemana().name());

        if (dia.getEjercicios() != null) {
            List<Ejercicios> listaEjercicios = dia.getEjercicios();
            java.util.stream.Stream<EjerciciosDTO> streamEjerciciosMapeados = listaEjercicios.stream().map(this::convertirEjercicioADTO);
            List<EjerciciosDTO> ejerciciosDTO = streamEjerciciosMapeados.collect(Collectors.toList());
            dto.setEjercicios(ejerciciosDTO);
        }

        return dto;
    }

    private EjerciciosDTO convertirEjercicioADTO(Ejercicios ejercicio) {
        EjerciciosDTO dto = new EjerciciosDTO();
        dto.setId(ejercicio.getId());
        dto.setNombreEjercicio(ejercicio.getNombreEjercicio());
        dto.setSeries(ejercicio.getSeries());
        dto.setRepeticiones(ejercicio.getRepeticiones());
        dto.setTiempoDescansoSegundos(ejercicio.getTiempoDescansoSegundos());
        dto.setDescripcion(ejercicio.getDescripcion());
        dto.setGrupoMuscular(ejercicio.getGrupoMuscular());
        return dto;
    }

    private DiaEjercicio convertirDiaEjercicioDTOAEntidad(CrearDiaEjercicioDTO dto) {
        DiaEjercicio dia = new DiaEjercicio();
        dia.setDiaSemana(DiaSemana.valueOf(dto.getDiaSemana().toUpperCase()));

        if (dto.getEjerciciosIds() != null && !dto.getEjerciciosIds().isEmpty()) {
            List<Long> listaIds = dto.getEjerciciosIds();
            java.util.stream.Stream<Ejercicios> streamEjerciciosBuscados = listaIds.stream().map(id -> ejerciciosRepository.findById(id)
                    .orElseThrow(() -> new RecursoNoEncontradoException(EJERCICIO_NO_ENCONTRADO + id)));
            List<Ejercicios> ejercicios = streamEjerciciosBuscados.collect(Collectors.toList());
            dia.setEjercicios(ejercicios);
        }

        return dia;
    }

    @Transactional
    public FeedbackEjercicioDTO guardarFeedback(FeedbackEjercicioDTO feedbackDTO, Usuario usuario) {
        LocalDate fechaFeedback = feedbackDTO.getFechaFeedback();
        if (fechaFeedback == null) {
            fechaFeedback = LocalDate.now();
        }

        FeedbackEjercicio feedbackEntidad = FeedbackEjercicio.builder()
                .usuario(usuario)
                .fechaFeedback(fechaFeedback)
                .semanaNumero(feedbackDTO.getSemanaNumero())
                .ejerciciosDificiles(feedbackDTO.getEjerciciosDificiles())
                .puedeMasPeso(feedbackDTO.getPuedeMasPeso())
                .comentarios(feedbackDTO.getComentarios())
                .nivelFatiga(feedbackDTO.getNivelFatiga())
                .build();

        FeedbackEjercicio feedbackGuardado = feedbackEjercicioRepository.save(feedbackEntidad);
        FeedbackEjercicioDTO feedbackGuardadoDTO = mapearFeedbackADTO(feedbackGuardado);

        return feedbackGuardadoDTO;
    }

    public Optional<FeedbackEjercicioDTO> obtenerUltimoFeedback(Long usuarioId) {
        Optional<FeedbackEjercicio> ultimoFeedback = feedbackEjercicioRepository.findTopByUsuarioIdOrderBySemanaNumeroDesc(usuarioId);

        if (ultimoFeedback.isPresent()) {
            FeedbackEjercicioDTO feedbackDTO = mapearFeedbackADTO(ultimoFeedback.get());
            return Optional.of(feedbackDTO);
        }

        return Optional.empty();
    }

    public Optional<FeedbackEjercicioDTO> obtenerFeedbackPorSemana(Integer semanaNumero, Long usuarioId) {
        Optional<FeedbackEjercicio> feedbackSemana = feedbackEjercicioRepository
                .findTopBySemanaNumeroAndUsuarioIdOrderByFechaFeedbackDesc(semanaNumero, usuarioId);

        if (feedbackSemana.isPresent()) {
            FeedbackEjercicioDTO feedbackDTO = mapearFeedbackADTO(feedbackSemana.get());
            return Optional.of(feedbackDTO);
        }

        return Optional.empty();
    }

    // Todos los feedbacks diarios de una semana: la regeneración se los da a la IA
    public List<FeedbackEjercicioDTO> obtenerFeedbacksDeLaSemana(Integer semanaNumero, Long usuarioId) {
        List<FeedbackEjercicio> feedbacksSemana = feedbackEjercicioRepository
                .findBySemanaNumeroAndUsuarioIdOrderByFechaFeedbackAsc(semanaNumero, usuarioId);

        return feedbacksSemana.stream().map(this::mapearFeedbackADTO).collect(Collectors.toList());
    }

    @Transactional
    public List<HistorialEntrenamientoDTO> guardarProgreso(GuardarProgresoRequestDTO progresoDTO, Usuario usuario) {
        Integer semanaActual = calcularSemanaActual(usuario.getId());
        LocalDate fechaHoy = LocalDate.now();

        List<EjercicioProgresoDTO> listaEjerciciosProgreso = progresoDTO.getEjercicios();
        java.util.stream.Stream<HistorialEntrenamiento> streamHistorialesMapeados = listaEjerciciosProgreso.stream().map(ejercicioProgreso -> {
            HistorialEntrenamiento historial = HistorialEntrenamiento.builder()
                    .usuario(usuario)
                    .fechaEntrenamiento(fechaHoy)
                    .diaSemana(progresoDTO.getDiaSemana())
                    .nombreEjercicio(ejercicioProgreso.getNombreEjercicio())
                    .grupoMuscular(ejercicioProgreso.getGrupoMuscular())
                    .seriesCompletadas(ejercicioProgreso.getSeriesCompletadas())
                    .seriesObjetivo(ejercicioProgreso.getSeriesObjetivo())
                    .repeticiones(ejercicioProgreso.getRepeticiones())
                    .completado(ejercicioProgreso.getCompletado())
                    .pesoKg(ejercicioProgreso.getPesoKg())
                    .semanaNumero(semanaActual)
                    .build();
            return historial;
        });
        List<HistorialEntrenamiento> historialesAGuardar = streamHistorialesMapeados.collect(Collectors.toList());

        List<HistorialEntrenamiento> historialesGuardados = historialEntrenamientoRepository.saveAll(historialesAGuardar);

        java.util.stream.Stream<HistorialEntrenamientoDTO> streamHistorialesDTOMapeados = historialesGuardados.stream().map(this::mapearHistorialADTO);
        List<HistorialEntrenamientoDTO> historialesDTO = streamHistorialesDTOMapeados.collect(Collectors.toList());

        return historialesDTO;
    }

    public List<HistorialEntrenamientoDTO> obtenerProgresoPorSemana(Integer semanaNumero, Long usuarioId) {
        List<HistorialEntrenamiento> historialesSemana = historialEntrenamientoRepository
                .findBySemanaNumeroAndUsuarioId(semanaNumero, usuarioId);

        java.util.stream.Stream<HistorialEntrenamientoDTO> streamHistorialesMapeados = historialesSemana.stream().map(this::mapearHistorialADTO);
        List<HistorialEntrenamientoDTO> historialesDTO = streamHistorialesMapeados.collect(Collectors.toList());

        return historialesDTO;
    }

    public Map<String, Object> calcularEstadisticas(Long usuarioId) {
        Integer semanaActual = calcularSemanaActual(usuarioId);
        Long totalEjerciciosCompletados = historialEntrenamientoRepository.countCompletadosBySemanaYUsuario(semanaActual, usuarioId);

        Map<String, Object> estadisticas = new HashMap<>();
        estadisticas.put("semanaActual", semanaActual);
        estadisticas.put("ejerciciosCompletadosEstaSemana", totalEjerciciosCompletados);

        return estadisticas;
    }

    public Integer calcularSemanaActual(Long usuarioId) {
        Optional<FeedbackEjercicio> ultimoFeedback = feedbackEjercicioRepository.findTopByUsuarioIdOrderBySemanaNumeroDesc(usuarioId);

        if (ultimoFeedback.isPresent()) {
            Integer semanaSiguiente = ultimoFeedback.get().getSemanaNumero() + 1;
            return semanaSiguiente;
        }

        return 1;
    }

    // Historial reciente del usuario: alimenta el comentario motivacional de la IA
    public List<HistorialEntrenamientoDTO> obtenerHistorialReciente(Long usuarioId, int dias) {
        LocalDate desde = LocalDate.now().minusDays(dias);
        List<HistorialEntrenamiento> historiales = historialEntrenamientoRepository.findRecientesByUsuario(usuarioId, desde);

        return historiales.stream().map(this::mapearHistorialADTO).collect(Collectors.toList());
    }

    private FeedbackEjercicioDTO mapearFeedbackADTO(FeedbackEjercicio feedback) {
        FeedbackEjercicioDTO feedbackDTO = FeedbackEjercicioDTO.builder()
                .id(feedback.getId())
                .fechaFeedback(feedback.getFechaFeedback())
                .semanaNumero(feedback.getSemanaNumero())
                .ejerciciosDificiles(feedback.getEjerciciosDificiles())
                .puedeMasPeso(feedback.getPuedeMasPeso())
                .comentarios(feedback.getComentarios())
                .nivelFatiga(feedback.getNivelFatiga())
                .build();

        return feedbackDTO;
    }

    private HistorialEntrenamientoDTO mapearHistorialADTO(HistorialEntrenamiento historial) {
        HistorialEntrenamientoDTO historialDTO = HistorialEntrenamientoDTO.builder()
                .id(historial.getId())
                .fechaEntrenamiento(historial.getFechaEntrenamiento())
                .diaSemana(historial.getDiaSemana())
                .nombreEjercicio(historial.getNombreEjercicio())
                .grupoMuscular(historial.getGrupoMuscular())
                .seriesCompletadas(historial.getSeriesCompletadas())
                .seriesObjetivo(historial.getSeriesObjetivo())
                .repeticiones(historial.getRepeticiones())
                .completado(historial.getCompletado())
                .pesoKg(historial.getPesoKg())
                .semanaNumero(historial.getSemanaNumero())
                .build();

        return historialDTO;
    }

    public List<String> obtenerEjerciciosUnicos(Long usuarioId) {
        return historialEntrenamientoRepository.findDistinctNombreEjercicioByUsuario(usuarioId);
    }

    public List<HistorialEntrenamientoDTO> obtenerProgresoPorEjercicio(String nombreEjercicio, Long usuarioId) {
        List<HistorialEntrenamiento> historiales = historialEntrenamientoRepository
                .findByNombreEjercicioYUsuarioConPeso(nombreEjercicio, usuarioId);

        java.util.stream.Stream<HistorialEntrenamientoDTO> streamHistorialesProgresoMapeados = historiales.stream().map(this::mapearHistorialADTO);
        return streamHistorialesProgresoMapeados.collect(Collectors.toList());
    }

    public Optional<RutinaGeneradaDTO> obtenerMiRutina(Long usuarioId) {
        Optional<Usuario> usuarioOptional = usuarioRepository.findById(usuarioId);

        if (usuarioOptional.isEmpty()) {
            return Optional.empty();
        }

        Usuario usuario = usuarioOptional.get();
        RutinaEjercicio rutinaActual = usuario.getRutinaEjercicio();

        if (rutinaActual == null) {
            return Optional.empty();
        }

        LocalDate hoy = LocalDate.now();
        LocalDate fechaFinRutina = rutinaActual.getFechaFin();

        boolean rutinaExpirada = fechaFinRutina != null && hoy.isAfter(fechaFinRutina);
        if (rutinaExpirada) {
            return Optional.empty();
        }

        RutinaGeneradaDTO rutinaDTO = convertirRutinaEntidadARutinaGeneradaDTO(rutinaActual);
        return Optional.of(rutinaDTO);
    }

    private RutinaGeneradaDTO convertirRutinaEntidadARutinaGeneradaDTO(RutinaEjercicio rutina) {
        List<DiaEjercicio> diasEntidad = rutina.getDiasEjercicio();

        List<DiaEjercicioGeneradoDTO> diasDTO = diasEntidad.stream()
                .map(this::convertirDiaEntidadADiaGeneradoDTO)
                .collect(Collectors.toList());

        RutinaGeneradaDTO rutinaDTO = RutinaGeneradaDTO.builder()
                .diasEjercicio(diasDTO)
                .build();

        return rutinaDTO;
    }

    private DiaEjercicioGeneradoDTO convertirDiaEntidadADiaGeneradoDTO(DiaEjercicio diaEntidad) {
        List<Ejercicios> ejerciciosEntidad = diaEntidad.getEjercicios();

        List<EjercicioGeneradoDTO> ejerciciosDTO = ejerciciosEntidad.stream()
                .map(this::convertirEjercicioEntidadAEjercicioGeneradoDTO)
                .collect(Collectors.toList());

        String diaSemanaFormateado = formatearDiaSemana(diaEntidad.getDiaSemana());

        String grupoMuscular = "";
        if (ejerciciosEntidad != null && !ejerciciosEntidad.isEmpty()) {
            grupoMuscular = ejerciciosEntidad.get(0).getGrupoMuscular();
        }

        DiaEjercicioGeneradoDTO diaDTO = DiaEjercicioGeneradoDTO.builder()
                .diaSemana(diaSemanaFormateado)
                .grupoMuscular(grupoMuscular)
                .ejercicios(ejerciciosDTO)
                .build();

        return diaDTO;
    }

    private String formatearDiaSemana(DiaSemana diaSemana) {
        String nombreEnum = diaSemana.name();
        String primeraLetraMayuscula = nombreEnum.substring(0, 1);
        String restoMinusculas = nombreEnum.substring(1).toLowerCase();
        return primeraLetraMayuscula + restoMinusculas;
    }

    private EjercicioGeneradoDTO convertirEjercicioEntidadAEjercicioGeneradoDTO(Ejercicios ejercicioEntidad) {
        Integer repeticionesEntidad = ejercicioEntidad.getRepeticiones();
        String repeticionesComoTexto = repeticionesEntidad != null ? repeticionesEntidad.toString() : null;

        EjercicioGeneradoDTO ejercicioDTO = EjercicioGeneradoDTO.builder()
                .nombre(ejercicioEntidad.getNombreEjercicio())
                .series(ejercicioEntidad.getSeries())
                .repeticiones(repeticionesComoTexto)
                .descansoSegundos(ejercicioEntidad.getTiempoDescansoSegundos())
                .descripcion(ejercicioEntidad.getDescripcion())
                .grupoMuscular(ejercicioEntidad.getGrupoMuscular())
                .pesoSugeridoKg(ejercicioEntidad.getPesoSugeridoKg())
                .build();

        return ejercicioDTO;
    }
}
