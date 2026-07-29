package com.cofira.controllers;

import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.*;

import com.cofira.dto.onboarding.ActualizarDeportesDTO;
import com.cofira.dto.onboarding.NutritionTargetsDTO;
import com.cofira.dto.onboarding.OnboardingRequestDTO;
import com.cofira.dto.onboarding.OnboardingResponseDTO;
import com.cofira.entities.Usuario;
import com.cofira.exceptions.ResourceNotFoundException;
import com.cofira.repositories.UsuarioRepository;
import com.cofira.services.OnboardingService;

import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;

@RestController
@RequestMapping("/api/onboarding")
@RequiredArgsConstructor
public class OnboardingController {

    private final OnboardingService onboardingService;
    private final UsuarioRepository usuarioRepository;

    /**
     * Completa el proceso de onboarding para el usuario autenticado
     */
    @PostMapping("/complete")
    public ResponseEntity<OnboardingResponseDTO> completeOnboarding(
            @AuthenticationPrincipal UserDetails userDetails,
            @Valid @RequestBody OnboardingRequestDTO request) {

        Long usuarioId = getUserIdFromUserDetails(userDetails);
        OnboardingResponseDTO response = onboardingService.completeOnboarding(usuarioId, request);
        return ResponseEntity.ok(response);
    }

    /**
     * Actualiza solo deportes y equipamiento (configuracion del perfil)
     */
    @PutMapping("/sports")
    public ResponseEntity<Void> actualizarDeportes(
            @AuthenticationPrincipal UserDetails userDetails,
            @RequestBody ActualizarDeportesDTO request) {

        Long usuarioId = getUserIdFromUserDetails(userDetails);
        onboardingService.actualizarDeportes(usuarioId, request.getSports(), request.getEquipment());
        return ResponseEntity.noContent().build();
    }

    /**
     * Obtiene los objetivos nutricionales calculados del usuario
     */
    @GetMapping("/nutrition-targets")
    public ResponseEntity<NutritionTargetsDTO> getNutritionTargets(
            @AuthenticationPrincipal UserDetails userDetails) {

        Long usuarioId = getUserIdFromUserDetails(userDetails);
        NutritionTargetsDTO targets = onboardingService.getNutritionTargets(usuarioId);
        return ResponseEntity.ok(targets);
    }

    /**
     * Actualiza el perfil del usuario (recalcula los objetivos)
     */
    @PutMapping("/profile")
    public ResponseEntity<OnboardingResponseDTO> updateProfile(
            @AuthenticationPrincipal UserDetails userDetails,
            @Valid @RequestBody OnboardingRequestDTO request) {

        Long usuarioId = getUserIdFromUserDetails(userDetails);
        OnboardingResponseDTO response = onboardingService.updateProfile(usuarioId, request);
        return ResponseEntity.ok(response);
    }

    /**
     * Verifica si el usuario ha completado el onboarding
     */
    @GetMapping("/status")
    public ResponseEntity<Boolean> getOnboardingStatus(
            @AuthenticationPrincipal UserDetails userDetails) {

        Long usuarioId = getUserIdFromUserDetails(userDetails);
        boolean isComplete = onboardingService.isOnboardingComplete(usuarioId);
        return ResponseEntity.ok(isComplete);
    }

    private Long getUserIdFromUserDetails(UserDetails userDetails) {
        Usuario usuario = usuarioRepository.findByUsername(userDetails.getUsername())
                .orElseThrow(() -> new ResourceNotFoundException("Usuario no encontrado"));
        return usuario.getId();
    }
}
