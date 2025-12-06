package com.jesus.cea.repository;

import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.jesus.cea.entity.Usuario;

@Repository
public interface UsuarioRepository extends JpaRepository<Usuario, Long> {
    
    // Buscar usuario por username
    Optional<Usuario> findByUsername(String username);
    
    // Verificar si existe un usuario por username
    boolean existsByUsername(String username);
    
    // Si quieres buscar por username y email
    Optional<Usuario> findByUsernameAndEmail(String username, String email);
    
    // NOTA: findByUsernameAndPassword NO es necesario porque usamos verificación manual
    // en el controlador para mayor seguridad
}