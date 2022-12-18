import { Nullable } from '../../typescript';
import { Entity } from '../entities';
import * as User from '../users';
import * as Photo from '../photos';

export interface Basic extends Entity {
  cover_photo: Nullable<Photo.Basic>;
  description: Nullable<string>;
  featured: boolean;
  /**
   * This is different from `updated_at` because that may also change when a photo inside changes or
   * is deleted.
   */
  last_collected_at: string;
  links: {
    self: string;
    html: string;
    photos: string;
    download?: string;
    related?: string;
  };
  preview_photos: Nullable<Photo.VeryBasic[]>;
  published_at: string;
  title: string;
  total_photos: number;
  updated_at: string;
  user: User.Basic;
}
