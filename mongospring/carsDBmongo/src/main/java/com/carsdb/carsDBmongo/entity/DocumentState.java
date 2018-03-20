package com.carsdb.carsDBmongo.entity;

public enum DocumentState {
	
	Draft("Draft"),
	Publish("Publish");
	
	private final String code;
	
	DocumentState(String code){
		this.code= code;
	}

}
