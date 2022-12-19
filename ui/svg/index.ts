import OutlineDownload from './OutlineDownload';
import OutlineSearch from './OutlineSearch';
import OutlineStar from './OutlineStar';
import SolidPhoto from './SolidPhoto';
import SolidStar from './SolidStar';

const SVG = {
  OutlineDownload,
  OutlineSearch,
  OutlineStar,
  SolidPhoto,
  SolidStar,
};

export type Kind =
  | 'OutlineDownload'
  | 'OutlineSearch'
  | 'OutlineStar'
  | 'SolidPhoto'
  | 'SolidStar';

export default SVG;
