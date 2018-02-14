package com.carsdb.carsDBmongo.entity;

public enum TractionType {
	
	REAR("Rear-Wheel-Drive"),
	FRONT("Front-Wheel-Drive"),
	All("All-Wheel-Drive");
	
	private final String code;
	
	TractionType(String code){
		this.code= code;
	}

}
