package com.jesus.cea.service;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.jesus.cea.entity.Gasto;
import com.jesus.cea.repository.GastoRepository;

@Service
public class GastoService {

    @Autowired
    private GastoRepository repository;

    public List<Gasto> listar() {
        return repository.findAll();
    }

    public Gasto guardar(Gasto gasto) {
        return repository.save(gasto);
    }

    public void eliminar(Long id) {
        Gasto g = repository.findById(id).orElseThrow(() -> new RuntimeException("No encontrado"));
        
        if (!g.puedeSerEliminado()) {
            throw new RuntimeException("No se puede eliminar un gasto contabilizado");
        }
        repository.deleteById(id);
    }
}