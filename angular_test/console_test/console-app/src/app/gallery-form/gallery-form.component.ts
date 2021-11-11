import { Component, OnInit } from '@angular/core';
import { FormControl, Validators } from '@angular/forms';
import { GalleryService } from '../gallery.service';
import { IGalleryEntryModel } from '../model/galleryEntryModel';
import { IGalleryModel } from '../model/galleryModel';

@Component({
  selector: 'app-gallery-form',
  templateUrl: './gallery-form.component.html',
  styleUrls: ['./gallery-form.component.css']
})
export class GalleryFormComponent implements OnInit {

  galleryModel!: IGalleryModel;
  code!: FormControl;
  name!: FormControl;

  constructor(private galleryService:GalleryService) { }

  ngOnInit(): void {
    this.galleryModel = this.galleryService.getGallery();

    this.code = new FormControl(this.galleryModel.code, [Validators.required]);
    this.name = new FormControl(this.galleryModel.name, [Validators.required]);
  }

  createNewEntry(): void {
    console.log("New Entry");

    const newEntry: IGalleryEntryModel={
      code: "",
      full: "",
      half: "",
      small: "",
      thumb:""
    };

    this.galleryModel.entries.push(newEntry);

  }

  doUpdate(): void {

    this.galleryModel.code = this.code.value;
    this.galleryModel.name = this.name.value;

    console.log("Update!!!!!");
    console.log(this.galleryModel);
    console.log(this.galleryModel.publicGallery);
  }

  getCodeErrorMessage() {
    return this.code.hasError('required') ? 'You must enter a value' : '';
  }

  getNameErrorMessage() {
    return this.code.hasError('required') ? 'You must enter a value' : '';
  }

  onDelete(entryModel: IGalleryEntryModel){
    const toDelete = this.galleryModel.entries.indexOf(entryModel);
    this.galleryModel.entries = this.galleryModel.entries.filter( (val,idx) =>  toDelete != idx);
  }

}
