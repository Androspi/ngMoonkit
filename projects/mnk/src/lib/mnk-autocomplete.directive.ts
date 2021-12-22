import { Directive, ElementRef, EventEmitter, Input, OnChanges, OnDestroy, OnInit, Output, SimpleChanges } from '@angular/core';

import { Autocomplete, AutocompleteOptions, ListItemSelectedEvent } from 'moonkit';

import { MnkService } from './mnk.service';

@Directive({ selector: '[libAutocomplete]' })
export class AutocompleteDirective implements OnChanges, OnInit, OnDestroy {

  @Output() itemChanges: EventEmitter<ListItemSelectedEvent> = new EventEmitter();
  @Input() appAutocomplete: Partial<Omit<AutocompleteOptions, 'data' | 'excludedElements'>>;
  @Input() autocompleteExcludedElements: AutocompleteOptions['excludedElements'] = [];
  @Input() autocompleteValue: AutocompleteOptions['defaultValue'];
  @Input() autocompleteData: AutocompleteOptions['data'] = [];

  autocompleteInstance: Autocomplete;
  autocompleteOptions: AutocompleteOptions = {
    dataFields: { value: undefined, text: undefined },
    componentAttribute: undefined,
    defaultValue: undefined,
    excludedElements: [],
    templateContext: {},
    itemLimit: Infinity,
    parent: undefined,
    minSearchKeys: 0,
    searchDelay: 0,
    keywords: [],
    methods: {},
    data: [],
  };

  constructor(
    private helper: MnkService,
    private el: ElementRef
  ) { }

  ngOnChanges(changes: SimpleChanges) {
    if ('appAutocomplete' in changes) {
      const appAutocomplete: Partial<Omit<AutocompleteOptions, 'data'>> = changes.appAutocomplete.currentValue;
      Object.keys(appAutocomplete).forEach(key => key in this.autocompleteOptions && (this.autocompleteOptions[key] = appAutocomplete[key]));
      this.autocompleteInstance instanceof Autocomplete && (this.autocompleteInstance.options = this.appAutocomplete);
    }
    if ('autocompleteData' in changes) {
      const autocompleteData: AutocompleteOptions['data'] = changes.autocompleteData.currentValue;
      this.autocompleteOptions.data = autocompleteData;
      this.autocompleteInstance instanceof Autocomplete && (this.autocompleteInstance.data = autocompleteData);
    }
    if ('autocompleteExcludedElements' in changes) {
      const autocompleteExcludedElements: AutocompleteOptions['excludedElements'] = changes.autocompleteExcludedElements.currentValue;
      this.autocompleteOptions.excludedElements = autocompleteExcludedElements;
      this.autocompleteInstance instanceof Autocomplete && (this.autocompleteInstance.excludedElements = autocompleteExcludedElements);
    }
    if ('autocompleteValue' in changes) {
      const autocompleteValue: AutocompleteOptions['defaultValue'] = changes.autocompleteValue.currentValue;
      this.autocompleteOptions.defaultValue = autocompleteValue;
      this.autocompleteInstance instanceof Autocomplete && (this.autocompleteInstance.defaultValue = autocompleteValue);
    }
  }

  ngOnInit(): void {
    const attr: Attr = this.helper.getComponentAttribute(this.el.nativeElement)[0];
    this.autocompleteOptions.componentAttribute === undefined && (this.autocompleteOptions.componentAttribute = attr);
    this.autocompleteInstance = new Autocomplete(this.el.nativeElement, this.autocompleteOptions);
    this.autocompleteInstance.events.itemSelected.subscribe({ next: event => this.itemChanges.emit(event) });
    this.el.nativeElement.addEventListener('autocompletemethods', (event: CustomEvent<{ action: string }>) => {
      switch (event.detail.action) { case 'clearSelection': this.clearSelection(); break; }
    });
  }

  /** Limpia el formulario */
  private clearSelection() {
    const trigger = this.autocompleteInstance.trigger;
    (trigger instanceof HTMLInputElement || trigger instanceof HTMLTextAreaElement || trigger instanceof HTMLSelectElement) && (trigger.value = '');
  }

  ngOnDestroy() { this.autocompleteInstance instanceof Autocomplete && this.autocompleteInstance.destroy(); }

}
