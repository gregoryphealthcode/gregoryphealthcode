
export class DialogFormResponse {
  saved: boolean;
  data: any;
  constructor(recordSaved: boolean, data: any) {
    this.saved = recordSaved;
    this.data = data;
  }
}
