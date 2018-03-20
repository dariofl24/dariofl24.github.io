package com.carsdb.carsDBmongo.entity;

public class ComposedImageDto {

	private String thumbUrl;
	private String mainImagePath;
	
	public String getThumbUrl() {
		return thumbUrl;
	}
	
	public void setThumbUrl(String thumbUrl) {
		this.thumbUrl = thumbUrl;
	}
	
	public String getMainImagePath() {
		return mainImagePath;
	}
	
	public void setMainImagePath(String mainImagePath) {
		this.mainImagePath = mainImagePath;
	}

	@Override
	public String toString() {
		return "ComposedImageDto [thumbUrl=" + thumbUrl + ", mainImagePath=" + mainImagePath + "]";
	}
	
	
	
}
