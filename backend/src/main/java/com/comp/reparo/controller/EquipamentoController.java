package com.comp.reparo.controller;

import java.util.List;

import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.comp.reparo.model.Equipamento;
import com.comp.reparo.repository.EquipamentoRepository;

@RestController
@RequestMapping("/equipamentos")
public class EquipamentoController {

    private final EquipamentoRepository repository;

    public EquipamentoController(EquipamentoRepository repository) {
        this.repository = repository;
    }

    @GetMapping
    public List<Equipamento> findAll() {
        return repository.findAll();
    }

    @PostMapping
    public Equipamento create(@RequestBody Equipamento e) {
        return repository.save(e);
    }
}