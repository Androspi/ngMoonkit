import { Directive, ElementRef, EventEmitter, Input, OnChanges, OnDestroy, OnInit, Output, SimpleChanges } from '@angular/core';

import { Select, SelectArea, SelectOptions, ListItemSelectedEvent, ListOptions } from 'moonkit';

import { MnkService } from './mnk.service';

@Directive({ selector: '[libSelect]' })
export class SelectDirective implements OnInit, OnChanges, OnDestroy {

  @Output() itemChanges: EventEmitter<ListItemSelectedEvent> = new EventEmitter();
  @Input() selectTemplateContext: Partial<SelectArea>;
  @Input() selectValue: SelectOptions['defaultValue'];
  @Input() appSelect: Partial<SelectOptions>;
  @Input() selectData: ListOptions['data'];

  public selectInstance: Select;
  public selectOptions: SelectOptions = {
    componentAttribute: undefined,
    defaultValue: undefined,
    useAutocomplete: false,
    placeholder: undefined,
    templateContext: {},
    listOptions: {},
    name: undefined,
  };

  constructor(private select: ElementRef<HTMLSelectElement>, private helper: MnkService) { }

  ngOnChanges(changes: SimpleChanges) {
    if ('appSelect' in changes && ![null, undefined].includes(changes.appSelect.currentValue)) {
      const appSelect: this['appSelect'] = changes.appSelect.currentValue;
      Object.keys(appSelect).forEach(key => key in this.selectOptions && (this.selectOptions[key] = appSelect[key]));
      this.selectInstance instanceof Select && (this.selectInstance.options = appSelect);
    }
    if ('selectData' in changes) {
      const selectData: this['selectData'] = changes.selectData.currentValue;
      this.selectOptions.listOptions.data = selectData;
      this.selectInstance instanceof Select && (this.selectInstance.listData = selectData);
    }
    if ('selectValue' in changes && changes.selectValue.currentValue !== changes.selectValue.previousValue) {
      const selectValue: this['selectValue'] = changes.selectValue.currentValue;
      this.selectOptions.defaultValue = selectValue;
      this.selectInstance instanceof Select && (this.selectInstance.defaultValue = selectValue);
    }
    if ('selectTemplateContext' in changes && changes.selectTemplateContext.currentValue !== undefined) {
      const selectTemplateContext: this['selectTemplateContext'] = changes.selectTemplateContext.currentValue;
      this.selectOptions.templateContext = selectTemplateContext;
      this.selectInstance instanceof Select && (this.selectInstance.templateContext = selectTemplateContext);
    }
  }

  ngOnInit(): void {
    const attr: Attr = this.helper.getComponentAttribute(this.select.nativeElement)[0];
    this.selectOptions.componentAttribute === undefined && (this.selectOptions.componentAttribute = attr);
    this.selectInstance = new Select(this.select.nativeElement, this.selectOptions);
    this.selectInstance.events.itemSelected.subscribe({ next: event => this.itemChanges.emit(event) });
    this.selectOptions.defaultValue !== undefined && (this.selectInstance.defaultValue = this.selectOptions.defaultValue);
  }

  ngOnDestroy() { this.selectInstance instanceof Select && this.selectInstance.destroy(); }

}
