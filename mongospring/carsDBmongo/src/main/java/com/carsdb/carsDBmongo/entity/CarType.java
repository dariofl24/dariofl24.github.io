package com.carsdb.carsDBmongo.entity;

public enum CarType {
	
	HATCHBACK("Hatch Back"),
	SEDAN("Sedan"),
	COUPE("Coupe"),
	STATIONWAGEN("Station Wagen"),
	CABRIO("Cabrio"),
	CROSSOVER("Crossover"),
	SUV("SUV"),
	PICKUP("Pickup");
	
	private final String code;
	
	CarType(String code){
		this.code= code;
	}

}
