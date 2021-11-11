import { IGalleryEntryModel } from "./galleryEntryModel";

export interface IGalleryModel {
    id: string;
    code: string;
    name: string;
    publicGallery:boolean;
    entries:IGalleryEntryModel[];
}
