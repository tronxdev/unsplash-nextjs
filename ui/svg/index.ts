import OutlineDownload from './OutlineDownload';
import OutlinePhoto from './OutlinePhoto';
import OutlineSearch from './OutlineSearch';
import OutlineStack from './OutlineStack';
import OutlineStar from './OutlineStar';
import OutlineUsers from './OutlineUsers';
import SolidPhoto from './SolidPhoto';
import SolidStack from './SolidStack';
import SolidStar from './SolidStar';
import SolidUsers from './SolidUsers';

const SVG = {
  OutlineDownload,
  OutlinePhoto,
  OutlineSearch,
  OutlineStack,
  OutlineStar,
  OutlineUsers,
  SolidPhoto,
  SolidStack,
  SolidStar,
  SolidUsers,
};

export type Kind =
  | 'OutlineDownload'
  | 'OutlinePhoto'
  | 'OutlineSearch'
  | 'OutlineStack'
  | 'OutlineStar'
  | 'OutlineUsers'
  | 'SolidPhoto'
  | 'SolidStack'
  | 'SolidStar'
  | 'SolidUsers';

export default SVG;
