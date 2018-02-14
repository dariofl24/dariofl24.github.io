package com.carsdb.carsDBmongo.entity;

public class ExteriorInfoDto {

	private int doors;
	private TractionType tracktion;
	private CarType type;
	private int lenght_mm;
	private int wide_mm;
	private int tall_mm;
	
	public int getDoors() {
		return doors;
	}
	public void setDoors(int doors) {
		this.doors = doors;
	}
	public TractionType getTracktion() {
		return tracktion;
	}
	public void setTracktion(TractionType tracktion) {
		this.tracktion = tracktion;
	}
	public CarType getType() {
		return type;
	}
	public void setType(CarType type) {
		this.type = type;
	}
	public int getLenght_mm() {
		return lenght_mm;
	}
	public void setLenght_mm(int lenght_mm) {
		this.lenght_mm = lenght_mm;
	}
	public int getWide_mm() {
		return wide_mm;
	}
	public void setWide_mm(int wide_mm) {
		this.wide_mm = wide_mm;
	}
	public int getTall_mm() {
		return tall_mm;
	}
	public void setTall_mm(int tall_mm) {
		this.tall_mm = tall_mm;
	}
	
}
