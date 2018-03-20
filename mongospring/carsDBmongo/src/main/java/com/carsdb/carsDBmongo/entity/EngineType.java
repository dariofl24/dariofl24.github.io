package com.carsdb.carsDBmongo.entity;

public enum EngineType {

	InLine("In-Line"),
	InW("In-W"),
	InBoxter("In-Boxter"),
	InV("In-V"),
	Electric("Electric");
	
	private final String code;
	
	EngineType(String code){
		this.code= code;
	}
	
	@Override 
    public String toString(){ 
        return code; 
    }
	
}
