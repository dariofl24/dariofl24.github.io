package com.carsdb.carsDBmongo.entity;

public class Transmission {
	
	private TransmissionType type;
	private int speeds;
	public TransmissionType getType() {
		return type;
	}
	public void setType(TransmissionType type) {
		this.type = type;
	}
	public int getSpeeds() {
		return speeds;
	}
	public void setSpeeds(int speeds) {
		this.speeds = speeds;
	}

}
