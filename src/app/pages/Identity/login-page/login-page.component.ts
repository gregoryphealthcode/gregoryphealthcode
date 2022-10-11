import { AfterViewInit, Component, OnInit, } from '@angular/core';
import { ReactiveFormBase } from 'src/app/shared/base/reactiveForm.base';
import { AuthService } from 'src/app/shared/services/auth.service';
import { FormBuilder, Validators } from '@angular/forms';
import { AppInfoService } from 'src/app/shared/services/app-info.service';

@Component({
  selector: 'app-login-page',
  templateUrl: './login-page.component.html',
  styleUrls: ['./login-page.component.scss']
})
export class LoginPageComponent extends ReactiveFormBase implements OnInit, AfterViewInit {
  public passwordMode = 'password';
  public passwordButtonOptions = {
    icon: 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAACQAAAAkCAYAAADhAJiYAAACoElEQVRYR+2XO4xNURSG/49kNBr9FCIS85Aw0wgKiQwhxGPUVDRI0HllhHiUFF7JTEXtMTGCDIUC0XgkXoWg0CtUJPyyb86VPefefc6ZezPJLe4uz3r9e61/rb0O6rBDh+FRF1BZRboZmpMM2V4labuk1ZJ6gaUhkO3Pkr5LeiFpEnhZBiAvn1XJbG+VdBoYrhLI9mtJY8BUFf2gUwmQ7UWSxoFdVR3HerZvSdoH/CizLwVke7GkB0BfmbMiue1PkjYD34r0CgHZDiCmgd68E9sfJE0EsJK+ZvIlkjZJ2gsMNLEJ/NoABHBNTxKQ7SHgVTMr2wclXQP+JuTzshJdT8iHgcCvhtMUkO01wLOEs3DDx1XKZ3s98CThZy3wvLTLbI8A0wknB4CrVcDUdWwHm8tVLzcjQ7Z3ArcTxu8lrQD+RMGWSToPjIZvtoPtiZgjtudLegsMJvzuACbrsv+AbO8GbqRub/sIcCmW2z4OnGtC3kEgkL52bB8GLhb43gPcDPIaINv7gStFpbDd36w7bIdBOZYDeg/YFgHqAz6W+K/RAdtHgQtlvLC9APidSHsDqHjo2u4BflWIcawdQC4JENNhIfCzEqBWS2Z7CtiSyNh9ILx7dQ4FTr2rVLLIaFaktj0AhM5rOLbzpD6Ub4gc52aSOgJV1Pbhhitzbd8v6Wyu7U/GBM7a/g2wPAF+FLhTlzVMatsbgUcJ41YGY7KDs1gzhnDnPx1R+TrncY0HWsH6EQg9LumhpC+SeiSF3WkkWz8aOGO79fUjAtU5C1oEKqywE/VuKhtweXn26Ialrf0VNjcvwp/GKWCoCqhsyT8D3K2iH3RKd+pE+9d/g8Iity4H+qmksHjN/W9Q1Vu2o9dShtoJWGbbBdTNUFkGyuT/ADJJhR6tSYiJAAAAAElFTkSuQmCC', type: 'text',
    location: 'after',
    focusStateEnabled: false,
    elementAttr: { class: 'password-btn' },
    onClick: () => {
      this.passwordMode = this.passwordMode === 'text' ? 'password' : 'text';
    }
  };

  constructor(
    private authService: AuthService,
    private formBuilder: FormBuilder,
    public appInfo: AppInfoService
  ) {
    super();
  }

  protected httpRequest = x => this.authService.login(x.username, x.password);

  ngOnInit(): void {
    this.setForm();
  }

  ngAfterViewInit(): void {
    setTimeout(()=>{
      let x = (<HTMLInputElement>document.querySelector('#login-page_username_textbox input'));
       x.focus();
    },350);
  }

  private setForm() {
    this.editForm = this.formBuilder.group({
      username: [
        undefined,
        Validators.compose([
          Validators.minLength(3),
          Validators.required,
       //   Validators.pattern(this.appInfo.getEmailFormat())
        ])
      ],
      password: [
        undefined,
        Validators.compose([Validators.required])
      ]
    });
  }
}
