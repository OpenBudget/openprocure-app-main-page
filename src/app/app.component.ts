import { Component, ViewChild, ElementRef } from '@angular/core';
import { HttpClient } from '@angular/common/http';

declare const GOVBUY_GONFIG: any;

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.less']
})
export class AppComponent {
  @ViewChild('tabButtons') tabButtons: ElementRef;
  @ViewChild('searchGuide') searchGuide: ElementRef;

  active = 'supplier';
  data: any = window['prefetchedData'].details;
  modal: any = {title: 'Hi', message: 'Yo'};
  sections = GOVBUY_GONFIG.cards;
  modals = GOVBUY_GONFIG.modals;
  tooltips = GOVBUY_GONFIG.tooltips;

  constructor() {
  }

  action(todo: string) {
    if (todo.indexOf('href') === 0) {
      let href = todo.slice(5);
      href = 'https://next.obudget.org' + href;
      window.location.href = href;
    } else if (todo.indexOf('search') === 0) {
      window.scrollTo({top: 0, behavior: 'smooth'});
    } else {
      const modal_id = todo.slice(6);
      const modal: any = this.modals[modal_id];
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
