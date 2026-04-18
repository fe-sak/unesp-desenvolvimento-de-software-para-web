package com.comp.reparo;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.boot.context.properties.ConfigurationPropertiesScan;

@SpringBootApplication
@ConfigurationPropertiesScan
public class ReparoApplication {

	public static void main(String[] args) {
		SpringApplication.run(ReparoApplication.class, args);
	}

}
