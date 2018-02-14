package com.carsdb.carsDBmongo.entity;

public class ComposedImageDto {

	private String thumb;
	private String main_URL;
	private String main_path;
	
	public String getThumb() {
		return thumb;
	}
	public void setThumb(String thumb) {
		this.thumb = thumb;
	}
	public String getMain_URL() {
		return main_URL;
	}
	public void setMain_URL(String main_URL) {
		this.main_URL = main_URL;
	}
	public String getPath() {
		return main_path;
	}
	public void setPath(String main_path) {
		this.main_path = main_path;
	}
	
}
