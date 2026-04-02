package com.comp.reparo.controller;

import java.util.List;

import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.comp.reparo.model.Tecnico;
import com.comp.reparo.repository.TecnicoRepository;

@RestController
@RequestMapping("/tecnicos")
public class TecnicoController {

    private final TecnicoRepository repository;

    public TecnicoController(TecnicoRepository repository) {
        this.repository = repository;
    }

    @GetMapping
    public List<Tecnico> findAll() {
        return repository.findAll();
    }

    @PostMapping
    public Tecnico create(@RequestBody Tecnico t) {
        return repository.save(t);
    }
}