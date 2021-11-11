import { Component, EventEmitter, Inject, Input, OnInit, Output } from '@angular/core';
import {MatDialog, MatDialogRef, MAT_DIALOG_DATA} from '@angular/material/dialog';
import { IGalleryEntryModel } from '../model/galleryEntryModel';

@Component({
  selector: 'app-image-composed-input',
  templateUrl: './image-composed-input.component.html',
  styleUrls: ['./image-composed-input.component.css']
})
export class ImageComposedInputComponent implements OnInit {

  @Input() galleryEntryModel!: IGalleryEntryModel;
  @Output() notifyDelete = new EventEmitter();

  constructor(public dialog: MatDialog) {}

  ngOnInit(): void {

  }

  doDelete(): void {
    this.openDialog();
  }

  openDialog(): void {

    const dialogRef = this.dialog.open(DialogOverviewExampleDialog, {width: '250px'});

    dialogRef.afterClosed().subscribe(result => {
      
      if(result){
        console.log('Delete');
        this.notifyDelete.emit(this.galleryEntryModel);
      }else{
        console.log('No-Delete');
      }

    });
  }

}

@Component({
  selector: 'dialog-overview-example-dialog',
  templateUrl: 'dialog-overview-example-dialog.html',
})
export class DialogOverviewExampleDialog {

  constructor(public dialogRef: MatDialogRef<DialogOverviewExampleDialog>) {}

  onNoClick(): void {
    this.dialogRef.close();
  }

}