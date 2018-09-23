import {Component, ViewChild, ElementRef} from '@angular/core';

@Component({
  selector: 'my-app',
  template: ` 
      <budgetkey-container [showHeader]="true" [showSearchBar]="false">
        <div class='background-graphic'>
          <div class='layer'></div>
          <div class='layer'></div>
          <div class='layer'></div>
          <div class='layer'></div>
          <div class="main-text layer">
            <h1>
            ב-{{data.year}} רכשה המדינה סחורות ושירותים ביותר מ-{{(data.total_amount/1000000000) | number:'1.0-0' }} מיליארד ₪. <br/>
            פעולות הרכש כללו {{data.num_central | number}}
            <span [bkTooltip]='tooltips.central'>מכרזים מרכזיים</span>            
            של מנהל הרכש
            ו-{{data.num_office | number}} 
            <span [bkTooltip]='tooltips.office'>מכרזים משרדיים</span>
            של {{data.num_office_publishers | number}} משרדים.
            בנוסף, אושרו {{data.num_exemptions | number}} פעולות רכש 
            <span [bkTooltip]='tooltips.exemptions'>בפטור ממכרז</span>
             בשנה זו.
            </h1>
            <budgetkey-search-bar [searchTerm]="''"
                                  (navigate)="onNavigate($event)"
            ></budgetkey-search-bar>
            <div class="search-guide" #searchGuide>
            </div>
          </div>
        </div>
        <div class="tab-buttons">
          <div class="subtitle"  #tabButtons>
            <img src='assets/img/partnership.svg'>
          </div>
          <div class="tab-button-row">
            <div class="tab-button" (click)="active='supplier'"
                [ngClass]="{active: active=='supplier'}"
            >
              <div class="text">
                אני רוצה לעבוד עם הממשלה כספק
              </div>
            </div>
            <div class="tab-button" (click)="active='gov'"
                [ngClass]="{active: active=='gov'}"
            >
              <div class="text">
                אני בממשלה, עם מי כדאי לי לעבוד?
              </div>
            </div>
          </div>
        </div>
        <div class="tab-contents-container">
          <div class="card-row" *ngFor='let row of sections[active]'>
            <div class='card-row-header'>{{ row.title }}</div>
            <div class='card-row-cards'>
              <div class='card' *ngFor='let card of row.cards'>
                <div class='card-icon'>
                  <img src='assets/img/hexagon.svg'>
                  <img class='internal' 
                       [src]='"assets/img/" + card.icon + ".svg"'>
                </div>
                <div class='card-title'>{{ card.title }}</div>
                <div class='card-text'>{{ card.text }}</div>
                <div class='card-action'
                     (click)='action(card.action.target)'
                >{{ card.action.text }}</div>
              </div>
            </div>
          </div>
        </div>
        <div class="disclaimer">
        </div>
        <ng-container *ngIf='modal.visible'>
          <modal [title]='modal.title'
                 (close)='modal.visible = false'
          >
            <span [innerHtml]='modal.text'></span>
          </modal>
        </ng-container>
      </budgetkey-container>
  `,
})
export class AppComponent {

  @ViewChild('tabButtons') tabButtons: ElementRef;
  @ViewChild('searchGuide') searchGuide: ElementRef;

  private active: string = 'supplier';
  private data: any = window['prefetchedData'].details;
  private modal: any = {title: 'Hi', message: 'Yo'};
  private configuration = require("json-loader!yaml-loader!./configuration.yaml");
  private sections = this.configuration.cards;
  private modals = this.configuration.modals;
  private tooltips = this.configuration.tooltips;

  constructor() {
  }

  ngOnInit() {
  }

  action(todo: string) {
    if (todo.indexOf('href') === 0) {
      let href = todo.slice(5);
      href = 'https://next.obudget.org' + href;
      window.location.href = href;
    } else if (todo.indexOf('search') === 0) {
      window.scrollTo({top: 0, behavior: 'smooth'});
    } else {
      let modal_id = todo.slice(6);
      let modal: any = this.modals[modal_id];
      if (modal) {
        this.modal.visible = true;
        this.modal.title = modal.title;
        this.modal.text = modal.text;
      }
    }
  }

  onNavigate(url: string) {
    window.location.href = url;
  }
}
