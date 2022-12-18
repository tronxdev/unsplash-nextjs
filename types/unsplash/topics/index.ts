import { Nullable, NonEmptyArray } from '../../typescript';
import { Entity } from '../entities';
import * as Photo from '../photos';
import * as User from '../users';

export interface Basic extends Entity {
  cover_photo: Nullable<Photo.Basic>;
  current_user_contributions: Photo.VeryBasic[];
  description: Nullable<string>;
  ends_at: Nullable<string>;
  featured: boolean;
  links: {
    self: string;
    html: string;
    photos: string;
  };
  owners: NonEmptyArray<User.Basic>;
  preview_photos: Nullable<Photo.VeryBasic[]>;
  published_at: string;
  starts_at: string;
  status: 'open' | 'closed';
  slug: string;
  title: string;
  total_photos: number;
  updated_at: string;
}

export interface Full extends Basic {
  top_contributors: User.Basic[];
}
