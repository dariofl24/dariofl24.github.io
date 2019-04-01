package com.carsdb.carsDBmongo.entity;

public enum CarType {
	
	HATCHBACK("Hatch Back"),
	SEDAN("Sedan"),
	COUPE("Coupe"),
	STATIONWAGEN("Station Wagen"),
	CABRIO("Cabrio"),
	CROSSOVER("Crossover"),
	SUV("SUV"),
	PICKUP("Pickup"),
	COUPE_SUV("Coupe SUV"),
	COUPE_SEDAN("Coupe Sedan");
	
	private final String code;
	
	CarType(String code){
		this.code= code;
	}

	@Override 
    public String toString(){ 
        return code; 
    }
	
}
