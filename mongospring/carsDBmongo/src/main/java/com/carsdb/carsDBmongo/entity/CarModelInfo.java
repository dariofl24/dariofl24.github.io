package com.carsdb.carsDBmongo.entity;

import java.util.Date;
import java.util.List;
import java.util.Optional;

import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

import com.google.common.collect.Lists;

@Document(collection = "carModelInfo")
public class CarModelInfo {

	@Id
    private String id;
	
	private String name;
	
	private String manufacturer;
	
	private int year;
	
	private int generation;
	
	private ExteriorInfoDto exteriorInfo;
	
	private OpenGraphData openGraphData;
	
	private TechDetails techDetails;
	
	private List<ImageParagraph> imageParagraphs;
	
	private List<ComposedImageDto> composedImageDto;
	
	private List<ImageDto> carrouselImages;
	
	private ImageDto coverImageSmall;
	private ImageDto coverImageMedium;
	
	private Date dateAdded;
	private Date lastEdited;
	
	private DocumentState documentState;
	
	private boolean featured;
	

	public CarModelInfo(){
		
		exteriorInfo = new ExteriorInfoDto();
		openGraphData = new OpenGraphData();
		imageParagraphs = Lists.newArrayList();
		techDetails = new TechDetails();
		carrouselImages = Lists.newArrayList();
		
		coverImageSmall = new ImageDto();
		coverImageMedium = new ImageDto();
	}
	
	public CarModelInfo(String manufacturer,int year,int generation,String name){
		this();
		this.name = name;
		this.manufacturer = manufacturer;
		this.year= year;
		this.generation= generation;
		
		StringBuilder sb = new StringBuilder();
		
		sb.append( Optional.ofNullable(manufacturer).orElse("").replace(" ","_").toLowerCase() );
		sb.append( Optional.ofNullable(name).orElse("").replace(" ","_").toLowerCase() );
		sb.append( Optional.ofNullable(year+"").orElse("").replace(" ","_").toLowerCase() );
		sb.append( Optional.ofNullable(generation+"").orElse("").replace(" ","_").toLowerCase() );
		
		this.setId(sb.toString());
	}
	
	public int getGeneration() {
		return generation;
	}

	public void setGeneration(int generation) {
		this.generation = generation;
	}

	public ExteriorInfoDto getExteriorInfo() {
		return exteriorInfo;
	}

	public void setExteriorInfo(ExteriorInfoDto exteriorInfo) {
		this.exteriorInfo = exteriorInfo;
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

	public String getName() {
		return name;
	}

	public void setName(String name) {
		this.name = name;
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

	public List<ImageDto> getCarrouselImages() {
		return carrouselImages;
	}

	public void setCarrouselImages(List<ImageDto> carrouselImages) {
		this.carrouselImages = carrouselImages;
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
	
	
	
	public List<ComposedImageDto> getComposedImageDto() {
		return composedImageDto;
	}

	public void setComposedImageDto(List<ComposedImageDto> composedImageDto) {
		this.composedImageDto = composedImageDto;
	}

	public String getId() {
		return id;
	}

	public void setId(String id) {
		this.id = id;
	}

	public TechDetails getTechDetails() {
		return techDetails;
	}

	public void setTechDetails(TechDetails techDetails) {
		this.techDetails = techDetails;
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
	
	public DocumentState getDocumentState() {
		return documentState;
	}

	public void setDocumentState(DocumentState documentState) {
		this.documentState = documentState;
	}
	
	public boolean isFeatured() {
		return featured;
	}

	public void setFeatured(boolean featured) {
		this.featured = featured;
	}

	@Override
	public String toString() {
		return "CarModelInfo [id=" + id + ", name=" + name + ", manufacturer=" + manufacturer + ", year=" + year
				+ ", generation=" + generation + ", exteriorInfo=" + exteriorInfo + ", openGraphData=" + openGraphData
				+ ", techDetails=" + techDetails + ", imageParagraphs=" + imageParagraphs + ", composedImageDto="
				+ composedImageDto + ", carrouselImages=" + carrouselImages + ", coverImageSmall=" + coverImageSmall
				+ ", coverImageMedium=" + coverImageMedium + ", dateAdded=" + dateAdded + ", lastEdited=" + lastEdited
				+ ", documentState=" + documentState + ", featured=" + featured + "]";
	}

	
	
}
