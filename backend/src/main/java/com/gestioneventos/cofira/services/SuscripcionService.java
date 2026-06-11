package com.gestioneventos.cofira.services;

import java.time.LocalDate;
import java.time.temporal.ChronoUnit;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.gestioneventos.cofira.dto.suscripcion.SuscripcionEstadoDTO;
import com.gestioneventos.cofira.entities.Plan;
import com.gestioneventos.cofira.entities.Usuario;
import com.gestioneventos.cofira.exceptions.RecursoNoEncontradoException;
import com.gestioneventos.cofira.repositories.PlanRepository;
import com.gestioneventos.cofira.repositories.UsuarioRepository;

/**
 * Gestiona el estado PRO de un usuario en el SERVIDOR. El pago en sí está
 * simulado en el frontend, pero la decisión de quién es PRO vive aquí: el
 * cliente solo puede pedir activar/cancelar y consultar su estado real.
 */
@Service
public class SuscripcionService {

    private static final int DIAS_SUSCRIPCION = 30;
    private static final double PRECIO_PRO = 9.99;

    private final UsuarioRepository usuarioRepository;
    private final PlanRepository planRepository;

    public SuscripcionService(UsuarioRepository usuarioRepository, PlanRepository planRepository) {
        this.usuarioRepository = usuarioRepository;
        this.planRepository = planRepository;
    }

    @Transactional
    public SuscripcionEstadoDTO activar(String username) {
        Usuario usuario = buscarUsuario(username);

        Plan plan = planRepository.findByUsuarioId(usuario.getId()).orElseGet(() -> {
            Plan nuevo = new Plan();
            nuevo.setUsuario(usuario);
            return nuevo;
        });

        plan.setPrecio(PRECIO_PRO);
        plan.setSubscripcionActiva(true);
        plan.setFechaExpiracion(LocalDate.now().plusDays(DIAS_SUSCRIPCION));
        planRepository.save(plan);

        return calcularEstado(plan);
    }

    @Transactional(readOnly = true)
    public SuscripcionEstadoDTO estado(String username) {
        Usuario usuario = buscarUsuario(username);
        return planRepository.findByUsuarioId(usuario.getId())
                .map(this::calcularEstado)
                .orElseGet(SuscripcionService::sinSuscripcion);
    }

    @Transactional
    public SuscripcionEstadoDTO cancelar(String username) {
        Usuario usuario = buscarUsuario(username);
        Plan plan = planRepository.findByUsuarioId(usuario.getId())
                .orElseThrow(() -> new RecursoNoEncontradoException("No hay suscripción que cancelar"));

        plan.setSubscripcionActiva(false);
        planRepository.save(plan);

        return calcularEstado(plan);
    }

    private Usuario buscarUsuario(String username) {
        return usuarioRepository.findByUsername(username)
                .orElseThrow(() -> new RecursoNoEncontradoException("Usuario no encontrado: " + username));
    }

    private SuscripcionEstadoDTO calcularEstado(Plan plan) {
        boolean marcadaActiva = Boolean.TRUE.equals(plan.getSubscripcionActiva());
        LocalDate expiracion = plan.getFechaExpiracion();

        if (!marcadaActiva || expiracion == null) {
            return sinSuscripcion();
        }

        LocalDate hoy = LocalDate.now();
        boolean vigente = !expiracion.isBefore(hoy);
        long diasRestantes = vigente ? ChronoUnit.DAYS.between(hoy, expiracion) : 0;

        return SuscripcionEstadoDTO.builder()
                .esPro(vigente)
                .estado(vigente ? "activa" : "expirada")
                .fechaExpiracion(expiracion)
                .diasRestantes(diasRestantes)
                .build();
    }

    private static SuscripcionEstadoDTO sinSuscripcion() {
        return SuscripcionEstadoDTO.builder()
                .esPro(false)
                .estado("sin_suscripcion")
                .fechaExpiracion(null)
                .diasRestantes(0)
                .build();
    }
}
