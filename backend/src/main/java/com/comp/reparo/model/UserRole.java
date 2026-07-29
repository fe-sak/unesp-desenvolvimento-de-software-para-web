package com.comp.reparo.model;

public enum UserRole {
    USER,
    TECNICO,
    ADMIN;

    public String getRoleName() {
        return "ROLE_" + name();
    }
}