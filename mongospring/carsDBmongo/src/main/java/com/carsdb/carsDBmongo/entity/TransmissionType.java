package com.carsdb.carsDBmongo.entity;

public enum TransmissionType {
	
	Manual(""),
	Automatic(""),
	SemiAutomatic("");

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
