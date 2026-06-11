package com.gestioneventos.cofira.controllers;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.gestioneventos.cofira.api.UsuarioControllerApi;
import com.gestioneventos.cofira.dto.usuario.CrearUsuarioDTO;
import com.gestioneventos.cofira.dto.usuario.ModificarUsuarioDTO;
import com.gestioneventos.cofira.dto.usuario.UsuarioDetalleDTO;
import com.gestioneventos.cofira.dto.usuario.UsuarioListadoDTO;
import com.gestioneventos.cofira.services.UsuarioService;

import jakarta.validation.Valid;

@RestController
@RequestMapping("/api/usuarios")
public class UsuarioController implements UsuarioControllerApi {

    private final UsuarioService usuarioService;

    public UsuarioController(UsuarioService usuarioService) {
        this.usuarioService = usuarioService;
    }

    // Listar todos los usuarios: solo administradores.
    @GetMapping
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<Page<UsuarioListadoDTO>> listarUsuarios(@RequestParam(required = false) String nombre,
                                                                   Pageable pageable) {
        // Si el nombre es vacío o solo espacios, tratarlo como null
        String nombreFiltro = (nombre != null && !nombre.trim().isEmpty()) ? nombre : null;
        Page<UsuarioListadoDTO> usuarios = usuarioService.listarUsuarios(nombreFiltro, pageable);
        return ResponseEntity.ok(usuarios);
    }

    // Ver un usuario por id: el propio usuario o un administrador.
    @GetMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN') or #id == authentication.principal.id")
    public ResponseEntity<UsuarioDetalleDTO> obtenerUsuario(@PathVariable Long id) {
        UsuarioDetalleDTO usuario = usuarioService.obtenerUsuario(id);
        return ResponseEntity.ok(usuario);
    }

    // Públicos: solo para comprobar disponibilidad de email/username en el registro.
    @GetMapping("/email")
    public ResponseEntity<UsuarioDetalleDTO> obtenerUsuarioPorEmail(@RequestParam("email") String email) {
        UsuarioDetalleDTO usuario = usuarioService.obtenerUsuarioByEmail(email);
        return ResponseEntity.ok(usuario);
    }

    @GetMapping("/username")
    public ResponseEntity<UsuarioDetalleDTO> obtenerUsuarioPorUsername(@RequestParam("username") String username) {
        UsuarioDetalleDTO usuario = usuarioService.obtenerUsuarioByUsername(username);
        return ResponseEntity.ok(usuario);
    }

    // Crear usuario directamente (alta administrativa): solo administradores.
    @PostMapping
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<UsuarioDetalleDTO> crearUsuario(@RequestBody @Valid CrearUsuarioDTO crearUsuarioDTO) {
        UsuarioDetalleDTO nuevoUsuario = usuarioService.crearUsuario(crearUsuarioDTO);
        return ResponseEntity.status(HttpStatus.CREATED).body(nuevoUsuario);
    }

    // Actualizar un usuario: el propio usuario o un administrador.
    @PutMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN') or #id == authentication.principal.id")
    public ResponseEntity<UsuarioDetalleDTO> actualizarUsuario(@PathVariable Long id,
                                                                @RequestBody @Valid ModificarUsuarioDTO modificarUsuarioDTO) {
        UsuarioDetalleDTO usuarioActualizado = usuarioService.actualizarUsuario(id, modificarUsuarioDTO);
        return ResponseEntity.ok(usuarioActualizado);
    }

    // Eliminar un usuario: solo administradores.
    @DeleteMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<?> eliminarUsuario(@PathVariable Long id) {
        usuarioService.eliminarUsuario(id);
        return ResponseEntity.noContent().build();
    }
}
