import {Component, OnInit, Input, forwardRef, Output, EventEmitter, OnChanges, SimpleChanges} from '@angular/core';
import {ControlValueAccessor, NG_VALUE_ACCESSOR} from '@angular/forms';

const DEFAULT_COLOR_CHECKED = '#0099CC';
const DEFAULT_COLOR_UNCHECKED = '#e0e0e0';
const DEFAULT_LABEL_CHECKED = '';
const DEFAULT_LABEL_UNCHECKED = '';
const DEFAULT_SWITCH_COLOR = '#fff';
const DISABLED_COLOR = '#dbdbdb';
const DISABLED_BUTTON_COLOR = 'silver';

export const isObject = (value) => {
  return typeof value === 'object';
};

export const has = (object, key) => {
  return isObject(object) && object.hasOwnProperty(key);
};

export const get = (object, key, defaultValue) => {
  return has(object, key) ? object[key] : defaultValue;
};

export const px = value => {
  return `${value}px`;
};

export const translate = (x, y) => {
  return `translate(${x}, ${y})`;
};

export type toggleConfig = {
  checked: string,
  unchecked: string,
};

interface Style {
  width: string;
  height: string;
  transition: string;
}

interface CoreStyle extends Style {
  backgroundColor: string | toggleConfig;
  borderRadius: string;
}

interface ButtonStyle extends Style {
  transform: string;
  background: string | toggleConfig;
}

interface LabelStyle {
  lineHeight: string;
  fontSize: string;
  color: string | toggleConfig;
}

@Component({
  selector: 'ng-toggle',
  templateUrl: './ng-toggle.component.html',
  styleUrls: ['./ng-toggle.component.scss'],
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => NgToggleComponent),
      multi: true
    }
  ]
})
export class NgToggleComponent implements OnInit, OnChanges, ControlValueAccessor {

  @Input() public value: boolean = true;
  @Input() public name: string = '';
  @Input() public disabled: boolean = false;

  @Input() public height: number = 25;
  @Input() public width: number = 45;
  @Input() public margin: number = 2;
  @Input() public fontSize: number;
  @Input() public speed: number = 300;
  @Input() public color: string | toggleConfig;
  @Input() public switchColor: string | toggleConfig;
  @Input() public labels: boolean | toggleConfig = true;
  @Input() public checkedLabel: string = '';
  @Input() public uncheckedLabel: string = '';
  @Input() public fontColor: string | toggleConfig;

  @Output() public change = new EventEmitter();

  public cssColors: boolean = false;
  public toggled: boolean;

  private onChange = (_: any) => {
  }
  private onTouch = () => {
  }

  constructor() {
  }

  public ngOnChanges(changes: SimpleChanges): void {
    if (changes.value) {
      this.toggled = this.value;
    }
  }

  public ngOnInit(): void {
    this.toggled = this.value;
  }

  public writeValue(value: any): void {
    if (value) {
      this.value = value || false;
    } else {
      this.value = false;
    }

    this.toggled = this.value;
  }
  public registerOnChange(fn: any): void {
    this.onChange = fn;
  }
  public registerOnTouched(fn: any): void {
    this.onTouch = fn;
  }
  public setDisabledState(isDisabled: boolean): void {
    this.disabled = isDisabled;
  }

  public get coreStyle(): CoreStyle {
    return {
      width: px(this.width),
      height: px(this.height),
      transition: `all ${this.speed}ms`,
      backgroundColor: this.cssColors
        ? null
        : (this.disabled ? this.colorDisabled : this.colorCurrent),
      borderRadius: px(Math.round(this.height / 2))
    };
  }

  public get buttonRadius(): number {
    return this.height - this.margin * 2;
  }

  public get distance(): string {
    return px(this.width - this.height + this.margin);
  }

  public get buttonStyle(): ButtonStyle {
    const transition = `all ${this.speed}ms`;
    const margin = px(this.margin);
    const transform = this.toggled
      ? translate(this.distance, margin)
      : translate(margin, margin);
    let background = this.switchColor
      ? this.switchColorCurrent
      : null;
    background = this.disabled ? DISABLED_BUTTON_COLOR : background;
    return {
      width: px(this.buttonRadius),
      height: px(this.buttonRadius),
      transition,
      transform,
      background,
    };
  }

  public get labelStyle(): LabelStyle {
    return {
      lineHeight: px(this.height),
      fontSize: this.fontSize ? px(this.fontSize) : null,
      color: this.fontColor ? this.fontColorCurrent : null
    };
  }

  public get colorChecked(): string | toggleConfig {
    const { color } = this;
    if (!isObject(color)) {
      return color || DEFAULT_COLOR_CHECKED;
    }
    return get(color, 'checked', DEFAULT_COLOR_CHECKED);
  }

  public get colorUnchecked(): string {
    return get(this.color, 'unchecked', DEFAULT_COLOR_UNCHECKED);
  }

  public get colorDisabled(): string {
    return get(this.color, 'disabled', DISABLED_COLOR);
  }

  public get colorCurrent(): string | toggleConfig {
    return this.toggled
      ? this.colorChecked
      : this.colorUnchecked;
  }

  public get labelChecked(): string {
    return get(this.labels, 'checked', DEFAULT_LABEL_CHECKED);
  }

  public get labelUnchecked(): string {
    return get(this.labels, 'unchecked', DEFAULT_LABEL_UNCHECKED);
  }

  public get switchColorChecked(): string {
    return get(this.switchColor, 'checked', DEFAULT_SWITCH_COLOR);
  }

  public get switchColorUnchecked(): string {
    return get(this.switchColor, 'unchecked', DEFAULT_SWITCH_COLOR);
  }

  public get switchColorCurrent(): string | toggleConfig {
    if (!isObject(this.switchColor)) {
      return this.switchColor || DEFAULT_SWITCH_COLOR;
    }
    return this.toggled
      ? this.switchColorChecked
      : this.switchColorUnchecked;
  }

  public get fontColorChecked(): string {
    return get(this.fontColor, 'checked', DEFAULT_SWITCH_COLOR);
  }

  public get fontColorUnchecked(): string {
    return get(this.fontColor, 'unchecked', DEFAULT_SWITCH_COLOR);
  }

  public get fontColorCurrent(): string | toggleConfig {
    if (!isObject(this.fontColor)) {
      return this.fontColor || DEFAULT_SWITCH_COLOR;
    }
    return this.toggled
      ? this.fontColorChecked
      : this.fontColorUnchecked;
  }

  public toggle(): void {
    const toggled = !this.toggled;
    this.toggled = toggled;

    this.value = toggled;
    this.onTouch();
    this.onChange(toggled);
    this.change.emit(toggled);
  }
}
