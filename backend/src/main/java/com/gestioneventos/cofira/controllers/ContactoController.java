package com.gestioneventos.cofira.controllers;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpEntity;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.client.RestTemplate;

import java.util.List;
import java.util.Map;

/**
 * Formulario de contacto público. Reenvía el mensaje a un webhook de Discord
 * (la URL se inyecta por variable de entorno DISCORD_CONTACTO_WEBHOOK, nunca se
 * versiona). Antes el formulario solo hacia console.log y el mensaje se perdia.
 */
@RestController
@RequestMapping("/api/contacto")
public class ContactoController {

    @Value("${cofira.discord.contacto-webhook:}")
    private String webhookDiscord;

    private final RestTemplate restTemplate = new RestTemplate();

    public record ContactoRequest(String nombre, String email, String asunto, String mensaje) {
    }

    @PostMapping
    public ResponseEntity<Map<String, Object>> enviar(@RequestBody ContactoRequest req) {
        if (esVacio(req.nombre()) || esVacio(req.email()) || esVacio(req.mensaje())) {
            return ResponseEntity.badRequest()
                    .body(Map.of("ok", false, "error", "Faltan campos obligatorios (nombre, email y mensaje)."));
        }
        if (esVacio(webhookDiscord)) {
            // No fingimos éxito: si no hay canal configurado, avisamos.
            return ResponseEntity.status(HttpStatus.SERVICE_UNAVAILABLE)
                    .body(Map.of("ok", false, "error", "El contacto no esta configurado en el servidor."));
        }

        String descripcion = "**Nombre:** " + req.nombre()
                + "\n**Email:** " + req.email()
                + "\n**Asunto:** " + (esVacio(req.asunto()) ? "(sin asunto)" : req.asunto())
                + "\n**Mensaje:**\n" + req.mensaje();
        if (descripcion.length() > 4000) {
            descripcion = descripcion.substring(0, 4000);
        }

        Map<String, Object> payload = Map.of(
                "username", "Cofira · contacto",
                "embeds", List.of(Map.of(
                        "title", "📨 Nuevo mensaje de contacto",
                        "color", 3066993,
                        "description", descripcion)));

        try {
            HttpHeaders cabeceras = new HttpHeaders();
            cabeceras.setContentType(MediaType.APPLICATION_JSON);
            restTemplate.postForEntity(webhookDiscord, new HttpEntity<>(payload, cabeceras), String.class);
            return ResponseEntity.ok(Map.of("ok", true, "message", "¡Mensaje recibido! Te responderemos pronto."));
        } catch (Exception excepcion) {
            return ResponseEntity.status(HttpStatus.BAD_GATEWAY)
                    .body(Map.of("ok", false, "error", "No se pudo entregar el mensaje. Intentalo mas tarde."));
        }
    }

    private boolean esVacio(String valor) {
        return valor == null || valor.isBlank();
    }
}
