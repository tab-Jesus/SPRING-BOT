package com.jesus.cea.controller;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.jesus.cea.entity.Usuario;
import com.jesus.cea.repository.UsuarioRepository;

@RestController
@RequestMapping("/api/usuarios") // CAMBIO IMPORTANTE: Aquí atendemos usuarios, no auth
public class UsuarioController {

    @Autowired
    private UsuarioRepository usuarioRepository;

    @Autowired
    private PasswordEncoder passwordEncoder;

    // Endpoint para registrar nuevos usuarios (encriptando la contraseña)
    @PostMapping
    public Usuario crearUsuario(@RequestBody Usuario usuario) {
        // Encriptamos la contraseña antes de guardar
        String passEncriptada = passwordEncoder.encode(usuario.getPassword());
        usuario.setPassword(passEncriptada);
        return usuarioRepository.save(usuario);
    }

    // Endpoint para listar todos los usuarios
    @GetMapping
    public List<Usuario> listarUsuarios() {
        return usuarioRepository.findAll();
    }
}