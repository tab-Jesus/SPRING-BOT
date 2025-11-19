package com.jesus.cea.entity;

import java.time.LocalDate;
import java.time.LocalDateTime;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.Table;
import lombok.Data;
import lombok.NoArgsConstructor;

@Entity
@Table(name = "gastos")
@Data 
@NoArgsConstructor 
public class Gasto {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false)
    private LocalDate fecha;

    private Double valorTotalSinIVA;
    private Double ivaTotal;
    private Double valorTotalConIVA;

    @Column(nullable = false)
    private String nombreUsuario; 

    @Column(nullable = false)
    private String lugar;

    private String descripcion;

    @Column(updatable = false)
    private LocalDateTime fechaRegistro;

    private boolean procesado = false;
    private boolean contabilizado = false;

    public Gasto(LocalDate fecha, Double valorTotalSinIVA, Double ivaTotal, Double valorTotalConIVA, String nombreUsuario, String lugar, String descripcion) {
        this.fecha = fecha;
        this.valorTotalSinIVA = valorTotalSinIVA;
        this.ivaTotal = ivaTotal;
        this.nombreUsuario = nombreUsuario;
        this.lugar = lugar;
        this.descripcion = descripcion;
        this.fechaRegistro = LocalDateTime.now();
        
        validarTotales(valorTotalConIVA); 
        this.valorTotalConIVA = valorTotalConIVA;
    }

    private void validarTotales(Double totalConIVA) {
        if (totalConIVA <= 0) throw new IllegalArgumentException("El total debe ser mayor a 0");
        
        double calculado = this.valorTotalSinIVA + this.ivaTotal;
        if (Math.abs(calculado - totalConIVA) > 0.01) {
            throw new IllegalArgumentException("El valor total con IVA no coincide con la suma (Sin IVA + IVA).");
        }
    }
    
    public boolean puedeSerEliminado() {
        return !this.contabilizado;
    }
}