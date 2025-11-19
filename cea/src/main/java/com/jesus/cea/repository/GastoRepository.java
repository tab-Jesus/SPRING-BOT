package com.jesus.cea.repository;

import org.springframework.data.jpa.repository.JpaRepository;

import com.jesus.cea.entity.Gasto;

public interface GastoRepository extends JpaRepository<Gasto, Long> {
}