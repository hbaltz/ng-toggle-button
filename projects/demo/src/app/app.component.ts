import { Component } from '@angular/core';
import { FormGroup, FormControl } from '@angular/forms';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  public title: string = 'ng-toggle-button';
  public test: boolean = true;
  public switchTest: boolean = true;
  public switchTestValue: boolean = true;

  public config = {
    value: true,
    name: '',
    disabled: false,
    height: 25,
    width: 50,
    margin: 3,
    fontSize: 10,
    speed: 300,
    color: {
      unchecked: '#BFCBD9',
      checked: '#BFCBD9',
    },
    switchColor: {checked: '#00a388', unchecked: 'red'},
    labels: {
      unchecked: 'off',
      checked: 'on',
    },
    checkedLabel: '',
    uncheckedLabel: '',
    fontColor: {checked: '#fafafa', unchecked: '#f45a32'}
  };

  public myForm: FormGroup;

  constructor() {
    this.myForm = new FormGroup({
      show: new FormControl()
    });
  }

  public switch(): void {
    this.switchTest = !this.switchTest;
  }

  public switchValue(): void {
    this.switchTestValue = !this.switchTestValue;
  }

}
