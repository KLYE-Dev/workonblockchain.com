import { Component, OnInit, Input } from '@angular/core';

@Component({
  selector: 'app-i-forme-stackexchange-url',
  templateUrl: './stackexchange-url.component.html',
  styleUrls: ['./stackexchange-url.component.css']
})
export class StackexchangeUrlComponent implements OnInit {
  @Input() stackexchange_account: string;
  errMsg;
  constructor() { }

  ngOnInit() {
  }

  selfValidate() {
    if (this.stackexchange_account) {
      const regex = new RegExp("^(http:\\/\\/www\\.|https:\\/\\/www\\.|http:\\/\\/|https:\\/\\/)?[a-z0-9]+([\\-\\.]{1}[a-z0-9]+)*\\.[a-z]{2,10}(:[0-9]{1,5})?(\\/.*)?$");
      if (!regex.test(this.stackexchange_account)) {
        this.errMsg = 'Enter url in proper format';
        return false;
      }
      delete this.errMsg;
      return true;
    }
    else return true;
  }

}
