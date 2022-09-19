import { faThumbsDown } from "@fortawesome/free-solid-svg-icons";

const errorsMap = new Map([
  ['0', 'Unable to reach server. Please contact your system administrator.'],
  ['401', 'Unauthorized. Please contact your system administrator.'],
  ['404','Page not found. Please contact your system administrator.'],
  ['default', 'Unknown error. Please contact your system administrator.'],
  ['500','Server error. Please contact your system administrator.']
]);

function parseError(error: any): ApiErrorModel{
  let title ='Error';
  let messages = [];
  error = error.error;


  if (error) {
    if (error.message) {
      messages.push(error.error.message);
    }else if(error.errors){
      title = error.title;

      if(Array.isArray(error.errors)){
        error.errors.forEach(element => {
          messages.push(element)
        });
      }else{
        for (const i in error.errors) {
          const arr = error.errors[i];
          arr.forEach(element => {
            messages.push(element)
          });
        }
      }
    }
    else{
      for (const i in error) {
        if(i === 'data'){title = error[i]; continue;}
        if(i === 'message'){title = error[i]; continue;}

        // tslint:disable-next-line: forin
        for (const j in error[i]) {
          messages.push(error[i][j]);
        }
      }
    }
  }


  if (typeof title !== 'string'){
    title = 'Error'
  }

  return new ApiErrorModel(title, messages);
}

export const parseErrorMessage = (error: any): ApiErrorModel => {
  if (error.status == 400){ return parseError(error)}

  const errorMessage = errorsMap.get(error.status.toString()) || errorsMap.get('default');
  return new ApiErrorModel('Error', [errorMessage]);
}

export class ApiErrorModel{
  title: string;
  messages: ApiErrorWithRecommendationModel[];

  constructor(title: string, messages: string[]) {
    this.title = title;
    this.messages = [];
    messages.forEach(m=> this.messages.push(new ApiErrorWithRecommendationModel(m)))
  }
}

export class ApiErrorWithRecommendationModel{
  message: string;
  recommendation: string;

  constructor(error: string) {
    if(error.includes('Recommendation: ')){
      const recommSplit = error.split('Recommendation: ');
      this.message = recommSplit[0];
      this.recommendation = recommSplit[1];
    }else{
      this.message = error;

    }

  }
}
