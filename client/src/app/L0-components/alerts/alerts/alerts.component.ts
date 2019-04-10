import { Component, OnInit, Input } from '@angular/core';

@Component({
  selector: 'L0-alerts',
  templateUrl: './alerts.component.html',
  styleUrls: ['./alerts.component.css']
})
export class AlertsComponent implements OnInit {
  @Input() alertMsg;
  @Input() alertClass = '';
  @Input() aligmentClass = '';
  class;
  constructor() { }

  ngOnInit() {
    this.class = this.alertClass + ' ' + this.aligmentClass;
  }

}
