package com.carsdb.carsDBmongo.entity;

public class ImageParagraph extends Paragraph {
	
	private String largeImgUrl;
	private String textImgUrl;
	
	public String getLargeImgUrl() {
		return largeImgUrl;
	}
	public void setLargeImgUrl(String largeImgUrl) {
		this.largeImgUrl = largeImgUrl;
	}
	public String getTextImgUrl() {
		return textImgUrl;
	}
	public void setTextImgUrl(String textImgUrl) {
		this.textImgUrl = textImgUrl;
	}
	
}
