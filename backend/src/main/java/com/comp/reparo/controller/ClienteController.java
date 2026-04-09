package com.comp.reparo.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import com.comp.reparo.model.Cliente;
import com.comp.reparo.repository.ClienteRepository;

import java.util.List;

@RestController
@RequestMapping("/clientes")
public class ClienteController {

    @Autowired
    private ClienteRepository repository;

    @GetMapping(value = "/", produces = "application/json")
    public ResponseEntity<List<Cliente>> findAll() {
        List<Cliente> list = repository.findAll();
        return new ResponseEntity<>(list, HttpStatus.OK);
    }

    @GetMapping(value = "/{id}", produces = "application/json")
    public ResponseEntity<Cliente> findById(@PathVariable Long id) {
        Cliente cliente = repository.findById(id).orElseThrow();
        return new ResponseEntity<>(cliente, HttpStatus.OK);
    }

    @PostMapping(value = "/", produces = "application/json")
    public ResponseEntity<Cliente> create(@RequestBody Cliente cliente) {
        Cliente created = repository.save(cliente);
        return new ResponseEntity<>(created, HttpStatus.OK);
    }

    @PutMapping(value = "/", produces = "application/json")
    public ResponseEntity<Cliente> update(@RequestBody Cliente cliente) {
        Cliente updated = repository.save(cliente);
        return new ResponseEntity<>(updated, HttpStatus.OK);
    }

    @DeleteMapping(value = "/{id}", produces = "application/text")
    public String delete(@PathVariable("id") Long id) {
        repository.deleteById(id);
        return "ok";
    }
}