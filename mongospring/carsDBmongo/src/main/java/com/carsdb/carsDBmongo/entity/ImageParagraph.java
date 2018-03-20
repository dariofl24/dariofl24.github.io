package com.carsdb.carsDBmongo.entity;

public class ImageParagraph {
	
	private String largeImgUrlLink;
	
	private String textImgUrl;
	
	private boolean imageLeft;
	
	private int position;
	
	private String text;

	public String getText() {
		return text;
	}

	public void setText(String text) {
		this.text = text;
	}
	
	public String getTextImgUrl() {
		return textImgUrl;
	}
	
	public void setTextImgUrl(String textImgUrl) {
		this.textImgUrl = textImgUrl;
	}
	
	public boolean isImageLeft() {
		return imageLeft;
	}
	
	public void setImageLeft(boolean imageLeft) {
		this.imageLeft = imageLeft;
	}

	public int getPosition() {
		return position;
	}

	public void setPosition(int position) {
		this.position = position;
	}

	public String getLargeImgUrlLink() {
		return largeImgUrlLink;
	}

	public void setLargeImgUrlLink(String largeImgUrlLink) {
		this.largeImgUrlLink = largeImgUrlLink;
	}

	@Override
	public String toString() {
		return "ImageParagraph [largeImgUrlLink=" + largeImgUrlLink + ", textImgUrl=" + textImgUrl + ", imageLeft="
				+ imageLeft + ", position=" + position + ", text=" + text + "]";
	}
	
	
	
}
