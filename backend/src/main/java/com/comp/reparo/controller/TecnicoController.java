package com.comp.reparo.controller;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import com.comp.reparo.model.Tecnico;
import com.comp.reparo.repository.TecnicoRepository;

@RestController
@RequestMapping("/tecnicos")
public class TecnicoController {

    @Autowired
    private TecnicoRepository repository;

    @GetMapping(value = "/", produces = "application/json")
    public ResponseEntity<List<Tecnico>> findAll() {
        List<Tecnico> list = repository.findAll();
        return new ResponseEntity<>(list, HttpStatus.OK);
    }

    @GetMapping(value = "/{id}", produces = "application/json")
    public ResponseEntity<Tecnico> findById(@PathVariable Long id) {
        Tecnico tecnico = repository.findById(id).orElseThrow();
        return new ResponseEntity<>(tecnico, HttpStatus.OK);
    }

    @PostMapping(value = "/", produces = "application/json")
    public ResponseEntity<Tecnico> create(@RequestBody Tecnico tecnico) {
        Tecnico created = repository.save(tecnico);
        return new ResponseEntity<>(created, HttpStatus.OK);
    }

    @PutMapping(value = "/", produces = "application/json")
    public ResponseEntity<Tecnico> update(@RequestBody Tecnico tecnico) {
        Tecnico updated = repository.save(tecnico);
        return new ResponseEntity<>(updated, HttpStatus.OK);
    }

    @DeleteMapping(value = "/{id}", produces = "application/text")
    public String delete(@PathVariable("id") Long id) {
        repository.deleteById(id);
        return "ok";
    }
}