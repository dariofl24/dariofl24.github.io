package com.carsdb.carsDBmongo.entity;

public class OpenGraphData {

	private String url;
	private String title;
	private String description;
	private String image;
	
	public String getUrl() {
		return url;
	}
	public void setUrl(String url) {
		this.url = url;
	}
	public String getTitle() {
		return title;
	}
	public void setTitle(String title) {
		this.title = title;
	}
	public String getDescription() {
		return description;
	}
	public void setDescription(String description) {
		this.description = description;
	}
	public String getImage() {
		return image;
	}
	public void setImage(String image) {
		this.image = image;
	}
	
	@Override
	public String toString() {
		return "OpenGraphData [url=" + url + ", title=" + title + ", description=" + description + ", image=" + image
				+ "]";
	}
	
	
	
}
