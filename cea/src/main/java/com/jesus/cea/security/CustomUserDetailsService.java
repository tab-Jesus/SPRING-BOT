package com.jesus.cea.security;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.userdetails.User;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Service;

import com.jesus.cea.entity.Usuario;
import com.jesus.cea.repository.UsuarioRepository;

@Service
public class CustomUserDetailsService implements UserDetailsService {

    @Autowired
    private UsuarioRepository usuarioRepository;

    @Override
    public UserDetails loadUserByUsername(String email) throws UsernameNotFoundException {
        // Buscamos el usuario en TU base de datos
        Usuario usuario = usuarioRepository.findByUsername(email) // O findByEmail si lo llamaste así
                .orElseThrow(() -> new UsernameNotFoundException("Usuario no encontrado: " + email));

        // Se lo entregamos a Spring Security para que valide la contraseña
        return User.builder()
                .username(usuario.getUsername())
                .password(usuario.getPassword())
                .roles(usuario.getRole())
                .build();
    }
}