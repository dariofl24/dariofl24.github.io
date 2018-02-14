package com.carsdb.carsDBmongo.dto;

import java.util.Date;
import java.util.List;

import com.carsdb.carsDBmongo.entity.ExteriorInfoDto;
import com.carsdb.carsDBmongo.entity.ImageDto;
import com.carsdb.carsDBmongo.entity.ImageParagraph;
import com.carsdb.carsDBmongo.entity.OpenGraphData;
import com.carsdb.carsDBmongo.entity.Paragraph;
import com.carsdb.carsDBmongo.entity.TechDetails;

public class CarModelInfoDto {

	private String id;

	private String manufacturer;

	private int year;

	private int generation;

	private String name;

	private ExteriorInfoDto exteriorInfo;

	private OpenGraphData openGraphData;

	private List<ImageParagraph> imageParagraphs;
	private List<Paragraph> paragraphs;
	private List<TechDetails> techDetails;

	private List<ImageDto> carrouselImages;

	private ImageDto coverImageSmall;
	private ImageDto coverImageMedium;

	private Date dateAdded;
	private Date lastEdited;
	
	
	public String getId() {
		return id;
	}
	public void setId(String id) {
		this.id = id;
	}
	public String getManufacturer() {
		return manufacturer;
	}
	public void setManufacturer(String manufacturer) {
		this.manufacturer = manufacturer;
	}
	public int getYear() {
		return year;
	}
	public void setYear(int year) {
		this.year = year;
	}
	public int getGeneration() {
		return generation;
	}
	public void setGeneration(int generation) {
		this.generation = generation;
	}
	public String getName() {
		return name;
	}
	public void setName(String name) {
		this.name = name;
	}
	public ExteriorInfoDto getExteriorInfo() {
		return exteriorInfo;
	}
	public void setExteriorInfo(ExteriorInfoDto exteriorInfo) {
		this.exteriorInfo = exteriorInfo;
	}
	public OpenGraphData getOpenGraphData() {
		return openGraphData;
	}
	public void setOpenGraphData(OpenGraphData openGraphData) {
		this.openGraphData = openGraphData;
	}
	public List<ImageParagraph> getImageParagraphs() {
		return imageParagraphs;
	}
	public void setImageParagraphs(List<ImageParagraph> imageParagraphs) {
		this.imageParagraphs = imageParagraphs;
	}
	public List<Paragraph> getParagraphs() {
		return paragraphs;
	}
	public void setParagraphs(List<Paragraph> paragraphs) {
		this.paragraphs = paragraphs;
	}
	public List<TechDetails> getTechDetails() {
		return techDetails;
	}
	public void setTechDetails(List<TechDetails> techDetails) {
		this.techDetails = techDetails;
	}
	public List<ImageDto> getCarrouselImages() {
		return carrouselImages;
	}
	public void setCarrouselImages(List<ImageDto> carrouselImages) {
		this.carrouselImages = carrouselImages;
	}
	public ImageDto getCoverImageSmall() {
		return coverImageSmall;
	}
	public void setCoverImageSmall(ImageDto coverImageSmall) {
		this.coverImageSmall = coverImageSmall;
	}
	public ImageDto getCoverImageMedium() {
		return coverImageMedium;
	}
	public void setCoverImageMedium(ImageDto coverImageMedium) {
		this.coverImageMedium = coverImageMedium;
	}
	public Date getDateAdded() {
		return dateAdded;
	}
	public void setDateAdded(Date dateAdded) {
		this.dateAdded = dateAdded;
	}
	public Date getLastEdited() {
		return lastEdited;
	}
	public void setLastEdited(Date lastEdited) {
		this.lastEdited = lastEdited;
	}

}
