import { Injectable } from '@angular/core';
import { IGalleryEntryModel } from './model/galleryEntryModel';

@Injectable({
  providedIn: 'root'
})
export class GalleryEntryService {

  constructor() { }

  getGalleryEntries(): IGalleryEntryModel[] {
    return [
      {
        code: "code_0",
        full:'https://img.automexico.com/2021/02/19/0M2xJlFh/mercedes-benz-logo-cover-1280x720-1-1250x720-9ac5.jpg',
        half:'https://di-uploads-pod4.dealerinspire.com/fletcherjonesmercedesbenzofhenderson/uploads/2019/08/2019-C-Class-Sedan-front.jpg',
        small:"https://www.diariomotor.com/imagenes/picscache/1920x1600c/mercedes-eqs-2021-15_1920x1600c.jpg",
        thumb:'https://topgear.nl/thumbs/hd/2021/04/elektrische-mercedes-s-klasse-1.jpg'
      },
      {
        code: "code_1",
        full:'https://www.motor16.com/images/modelos/300/308/1.jpg',
        half:'https://acroadtrip.blob.core.windows.net/catalogo-imagenes/m/RT_V_a1e9b17ba7e540efaeacc60d79d66c75.jpg',
        small:"https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQefTPcysrpttkgviX5KiblgNq3QtBSPIgZmw&usqp=CAU",
        thumb:'https://i.gaw.to/vehicles/photos/40/23/402352-2021-audi-r8.jpg'
      }
    ];
  }

}
