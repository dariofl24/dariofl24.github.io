package com.carsdb.carsDBmongo.entity;

public class TechDetails {

	private int numberCylinders;
	
	private EngineType engineType;
	
	private PowerTrainType powerTrain;
	
	private float displacement_cc;
	
	private float torque_nm;
	
	private float aceleration_0_100;
	
	private float maxSpeed;
	
	private Transmission transmission;
	
	public PowerTrainType getPowerTrain() {
		return powerTrain;
	}
	
	public void setPowerTrain(PowerTrainType powerTrain) {
		this.powerTrain = powerTrain;
	}
	
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
	
	public float getDisplacement_cc() {
		return displacement_cc;
	}
	
	public void setDisplacement_cc(float displacement_cc) {
		this.displacement_cc = displacement_cc;
	}
	
	public float getTorque_nm() {
		return torque_nm;
	}
	
	public void setTorque_nm(float torque_nm) {
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
	
	@Override
	public String toString() {
		return "TechDetails [numberCylinders=" + numberCylinders + ", engineType=" + engineType + ", powerTrain="
				+ powerTrain + ", displacement_cc=" + displacement_cc + ", torque_nm=" + torque_nm
				+ ", aceleration_0_100=" + aceleration_0_100 + ", maxSpeed=" + maxSpeed + ", transmission="
				+ transmission + "]";
	}
	
}
