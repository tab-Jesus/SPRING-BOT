package com.jesus.cea.controller;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.jesus.cea.entity.Gasto;
import com.jesus.cea.service.GastoService;

@RestController
@RequestMapping("/api/gastos")
public class GastoController {

    @Autowired
    private GastoService service;

    @GetMapping
    public List<Gasto> listar() {
        return service.listar();
    }

    @PostMapping
    public Gasto crear(@RequestBody Gasto gasto) {
        return service.guardar(gasto);
    }
    
    @DeleteMapping("/{id}")
    public void eliminar(@PathVariable Long id) {
        service.eliminar(id);
    }
}