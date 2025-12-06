package com.jesus.cea.entity;

import org.springframework.boot.CommandLineRunner;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.crypto.password.PasswordEncoder;

import com.jesus.cea.repository.UsuarioRepository;

@Configuration
public class DataInitializer {

    @Bean
    CommandLineRunner initDatabase(UsuarioRepository repo, PasswordEncoder encoder) {
        return args -> {
            // Crear ADMIN si no existe
            if (!repo.existsByUsername("admin")) {
                Usuario admin = new Usuario();
                admin.setUsername("admin");
                admin.setPassword(encoder.encode("admin123")); // Contraseña encriptada
                admin.setRole("ADMIN");
                admin.setEmail("admin@empresa.com");
                admin.setActivo(true);
                repo.save(admin);
                System.out.println(" Usuario ADMIN creado: user: admin / pass: admin123");
            }

            // Crear USER si no existe
            if (!repo.existsByUsername("empleado")) {
                Usuario user = new Usuario();
                user.setUsername("empleado");
                user.setPassword(encoder.encode("user123")); // Contraseña encriptada
                user.setRole("USER");
                user.setEmail("empleado@empresa.com");
                user.setActivo(true);
                repo.save(user);
                System.out.println(" Usuario EMPLEADO creado: user: empleado / pass: user123");
            }
        };
    }
}