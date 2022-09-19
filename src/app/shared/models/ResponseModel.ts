import { StatusCode } from 'src/app/_helpers/StatusCode';

export class  ResponseModel {
    isSuccess: boolean;
    payload: string;
    statusCode: StatusCode;
    message: string;
}

