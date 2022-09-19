import { Directive, Input } from "@angular/core";

@Directive()
export class AppButtonBase{
  @Input() icon: string;
  @Input() iconPosition: 'left' | 'right' = 'left';

  @Input() text: string;
  @Input() disabled = false;
  @Input() showDropdownIcon = false;
  @Input() type: 'link' | 'default' | 'secondary' |'outlined' = 'default';
  @Input() size: 'xxs' | 'xs' | 'sm' | 'default' | 'lg' | 'xl' = 'default';
  @Input() color: 'primary' | 'grey' | 'warning' = 'primary';
  @Input() loading: boolean;

  get btnClass(){
    let cssClass = 'app-btn';

    switch (this.type) {
      case 'link':
        cssClass += ' btn-link'
        break;
      case 'outlined':
          cssClass += ' btn-outlined'
          break;
      case 'secondary':
          cssClass += ' btn-secondary'
          break;
      case 'default':
        cssClass += ' btn-default'
        break;
    }

    switch (this.size) {
      case 'xxs':
        cssClass += ' app-btn-xxs'
        break;
      case 'xs':
        cssClass += ' app-btn-xs'
        break;
      case 'sm':
          cssClass += ' app-btn-sm'
          break;
      case 'lg':
          cssClass += ' app-btn-lg'
          break;
      case 'xl':
          cssClass += ' app-btn-xl'
          break;
    }

    switch (this.color) {
      case 'primary':
          cssClass += ' btn-primary-color'
          break;
      case 'grey':
          cssClass += ' btn-grey-color'
          break;
      case 'warning':
        cssClass += ' btn-warning-color'
        break;
    }

    return cssClass;
  }
}
