package com.carsdb.carsDBmongo.entity;

public class TechDetails {

	private int numberCylinders;
	private EngineType engineType;
	private int displacement_cc;
	private int torque_nm;
	private float aceleration_0_100;
	private float maxSpeed;
	private Transmission transmission;
	
	public int getNumberCylinders() {
		return numberCylinders;
	}
	public void setNumberCylinders(int numberCylinders) {
		this.numberCylinders = numberCylinders;
	}
	
	public Transmission getTransmission() {
		return transmission;
	}
	public void setTransmission(Transmission transmission) {
		this.transmission = transmission;
	}
	public EngineType getEngineType() {
		return engineType;
	}
	public void setEngineType(EngineType engineType) {
		this.engineType = engineType;
	}
	public int getDisplacement_cc() {
		return displacement_cc;
	}
	public void setDisplacement_cc(int displacement_cc) {
		this.displacement_cc = displacement_cc;
	}
	public int getTorque_nm() {
		return torque_nm;
	}
	public void setTorque_nm(int torque_nm) {
		this.torque_nm = torque_nm;
	}
	public float getAceleration_0_100() {
		return aceleration_0_100;
	}
	public void setAceleration_0_100(float aceleration_0_100) {
		this.aceleration_0_100 = aceleration_0_100;
	}
	public float getMaxSpeed() {
		return maxSpeed;
	}
	public void setMaxSpeed(float maxSpeed) {
		this.maxSpeed = maxSpeed;
	}
	
}
