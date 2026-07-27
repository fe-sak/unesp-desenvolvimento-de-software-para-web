package com.comp.reparo.controller;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.*;

import com.comp.reparo.model.Aparelho;
import com.comp.reparo.model.User;
import com.comp.reparo.repository.AparelhoRepository;

@RestController
@RequestMapping("/aparelhos")
public class AparelhoController {

    @Autowired
    private AparelhoRepository repository;

    private User getCurrentUser() {
        return (User) SecurityContextHolder.getContext().getAuthentication().getPrincipal();
    }

    @GetMapping(value = "/", produces = "application/json")
    public ResponseEntity<List<Aparelho>> findAll() {
        User user = getCurrentUser();
        List<Aparelho> list;
        if (!user.isAdmin() && user.getCliente() != null) {
            list = repository.findByClienteId(user.getCliente().getId());
        } else {
            list = repository.findAll();
        }
        return new ResponseEntity<>(list, HttpStatus.OK);
    }

    @GetMapping(value = "/{id}", produces = "application/json")
    public ResponseEntity<Aparelho> findById(@PathVariable Long id) {
        Aparelho aparelho = repository.findById(id).orElseThrow();
        return new ResponseEntity<>(aparelho, HttpStatus.OK);
    }

    @PostMapping(value = "/", produces = "application/json")
    public ResponseEntity<Aparelho> create(@RequestBody Aparelho aparelho) {
        Aparelho created = repository.save(aparelho);
        return new ResponseEntity<>(created, HttpStatus.OK);
    }

    @PutMapping(value = "/", produces = "application/json")
    public ResponseEntity<Aparelho> update(@RequestBody Aparelho aparelho) {
        Aparelho updated = repository.save(aparelho);
        return new ResponseEntity<>(updated, HttpStatus.OK);
    }

    @DeleteMapping(value = "/{id}", produces = "application/text")
    public String delete(@PathVariable("id") Long id) {
        repository.deleteById(id);
        return "ok";
    }
}
