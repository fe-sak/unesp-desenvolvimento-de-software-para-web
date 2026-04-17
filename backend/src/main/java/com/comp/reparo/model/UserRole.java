package com.comp.reparo.model;

public enum UserRole {
    USER,
    ADMIN;

    public String getRoleName() {
        return "ROLE_" + name();
    }
}