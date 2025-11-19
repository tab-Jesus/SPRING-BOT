package com.jesus.cea.repository;

import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;

import com.jesus.cea.entity.Usuario;

public interface UsuarioRepository extends JpaRepository<Usuario, Long> {
    Optional<Usuario> findByUsername(String username);
}