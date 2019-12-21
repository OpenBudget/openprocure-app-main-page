import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppComponent } from './app.component';

import { BudgetKeyCommonModule, THEME_ID_TOKEN, LANG_TOKEN, THEME_TOKEN } from 'budgetkey-ng2-components';
import { getAuthServiceConfigProvider } from 'budgetkey-ng2-auth';
import { HttpClientModule } from '@angular/common/http';

declare let BUDGETKEY_NG2_COMPONENTS_THEME: any;
declare const BUDGETKEY_THEME_ID: any;
declare const BUDGETKEY_LANG: any;

export const LANG = typeof(BUDGETKEY_LANG) === 'undefined' ? 'he' : BUDGETKEY_LANG;

const providers: any[] = [
  getAuthServiceConfigProvider('https://next.obudget.org', 'jwt', 'jwt', 'https://next.obudget.org/p/'),
  {provide: THEME_ID_TOKEN, useValue: typeof(BUDGETKEY_THEME_ID) === 'undefined' ? null : BUDGETKEY_THEME_ID},
  {provide: LANG_TOKEN, useValue: LANG}
];

if (typeof(BUDGETKEY_NG2_COMPONENTS_THEME) !== 'undefined') {
  BUDGETKEY_NG2_COMPONENTS_THEME = Object.assign({}, BUDGETKEY_NG2_COMPONENTS_THEME);
  providers.push({provide: THEME_TOKEN,
                  useValue: BUDGETKEY_NG2_COMPONENTS_THEME});
}


@NgModule({
  declarations: [
    AppComponent
  ],
  imports: [
    BrowserModule,
    BudgetKeyCommonModule,
  ],
  providers: providers,
  bootstrap: [AppComponent]
})
export class AppModule { }
