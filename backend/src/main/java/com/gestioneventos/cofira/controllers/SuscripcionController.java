package com.gestioneventos.cofira.controllers;

import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.gestioneventos.cofira.dto.suscripcion.SuscripcionEstadoDTO;
import com.gestioneventos.cofira.services.SuscripcionService;

import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;

/**
 * Suscripción PRO. El usuario SIEMPRE se obtiene del token autenticado
 * (authentication.getName()), nunca de un parámetro del cliente. Así el
 * frontend no puede auto-otorgarse PRO.
 */
@RestController
@RequestMapping("/api/suscripcion")
@Tag(name = "Suscripción", description = "Gestión del estado PRO del usuario autenticado")
public class SuscripcionController {

    private final SuscripcionService suscripcionService;

    public SuscripcionController(SuscripcionService suscripcionService) {
        this.suscripcionService = suscripcionService;
    }

    @Operation(summary = "Activar PRO para el usuario autenticado")
    @PostMapping("/activar")
    public ResponseEntity<SuscripcionEstadoDTO> activar(Authentication authentication) {
        return ResponseEntity.ok(suscripcionService.activar(authentication.getName()));
    }

    @Operation(summary = "Consultar el estado PRO del usuario autenticado")
    @GetMapping("/estado")
    public ResponseEntity<SuscripcionEstadoDTO> estado(Authentication authentication) {
        return ResponseEntity.ok(suscripcionService.estado(authentication.getName()));
    }

    @Operation(summary = "Cancelar la suscripción PRO del usuario autenticado")
    @PostMapping("/cancelar")
    public ResponseEntity<SuscripcionEstadoDTO> cancelar(Authentication authentication) {
        return ResponseEntity.ok(suscripcionService.cancelar(authentication.getName()));
    }
}
