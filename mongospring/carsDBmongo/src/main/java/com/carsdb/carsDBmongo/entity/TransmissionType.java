package com.carsdb.carsDBmongo.entity;

public enum TransmissionType {
	
	Manual("Manual"),
	Automatic("Automatic"),
	SemiAutomatic("SemiAutomatic");

	private String type;
	
	TransmissionType(String type){
		this.type= type;
	}

	public String getType() {
		return type;
	}

	public void setType(String type) {
		this.type = type;
	}
	
	
	
}
