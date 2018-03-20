package com.carsdb.carsDBmongo.entity;

public enum PowerTrainType {
	
	GASOLINE("Gasoline"),
	DIESEL("Diesel"),
	HYBRID("Hybrid"),
	PLUGIN_HYBRIB("Plugin Hybrid"),
	ELECTRIC("Electric");
	
	private final String code;
	
	PowerTrainType(String code){
		this.code = code;
	}

	@Override 
    public String toString(){ 
        return code; 
    }
	
}
