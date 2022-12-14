import { saveAs } from 'file-saver';

export default function (url: string, filename: string) {
  saveAs(url, filename);
}
