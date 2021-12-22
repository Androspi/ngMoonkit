import { Directive, ElementRef, EventEmitter, AfterViewInit, OnDestroy, Output } from '@angular/core';

import { ContainerTemplate, ContainerTemplateContext, TemplateEvent, TemplateOperators } from 'htmon';

import { MnkService } from './mnk.service';

@Directive({ selector: '[libFullScreen]' })
export class FullScreenDirective implements AfterViewInit, OnDestroy {

  @Output() templateReady: EventEmitter<ContainerTemplate> = new EventEmitter();

  public template: ContainerTemplate;
  public trigger: ContainerTemplate;

  constructor(private el: ElementRef<Element>, private helper: MnkService) { }

  ngAfterViewInit() {
    if (!(this.trigger instanceof ContainerTemplate)) {
      const attr: Attr = this.helper.getComponentAttribute(this.el.nativeElement as HTMLElement)[0];
      const triggerMethods = { openTemplate: this.openTemplate };
      const triggerContext: Partial<ContainerTemplateContext> = {
        styles: { position: 'absolute', width: '100%', bottom: '0', left: '0', textAlign: 'center' },
        type: 'container',
        rows: [{
          classes: 'primary-button opaque-background-1 over-opaque-background-3 background-theme-after border-color-theme-important',
          addEvents: [['click', { name: 'openTemplate' }]],
          attributes: { theme: 'primary-color-theme' },
          type: 'container',
          tag: 'button',
          rows: [{
            styles: { verticalAlign: 'middle', lineHeight: '1', marginRight: '0.33em' },
            classes: 'material-icons',
            text: 'settings_overscan',
            type: 'element',
            tag: 'i'
          }, {
            styles: { verticalAlign: 'middle', lineHeight: '1' },
            text: 'Ver en pantalla completa',
            type: 'element',
            tag: 'span'
          }]
        }]
      };
      this.trigger = TemplateOperators.createTemplate(this.el.nativeElement, triggerContext, triggerMethods, attr);
      (this.el.nativeElement as HTMLElement).style.paddingBottom = `${this.trigger.target[this.trigger.target instanceof HTMLElement ? 'offsetHeight' : 'clientHeight']}px`;
      this.templateReady.next(this.trigger);
    } else { }
  }

  public openTemplate = async () => {
    this.template instanceof ContainerTemplate && await this.template.destroy();
    const attr: Attr = this.helper.getComponentAttribute(this.el.nativeElement as HTMLElement)[0];
    const templateMethods = { closeTemplate: this.closeTemplate };
    const templateContext: Partial<ContainerTemplateContext> = {
      addEvents: [['keyup', { name: 'closeTemplate' }]],
      classes: 'modal-surface modal-surface-active',
      attributes: { tabIndex: '0' },
      type: 'container',
      rows: [{
        addEvents: [['click', { name: 'closeTemplate' }]],
        classes: 'modal-content',
        type: 'container',
        rows: [{
          styles: { width: '90vw', height: '90vh' },
          classes: 'primary-modal',
          type: 'container',
          rows: [{
            styles: { width: '100%', height: '100%', maxHeight: '90vh' },
            classes: 'modal-body-style',
            type: 'container',
            rows: [{
              addEvents: [['click', { name: 'closeTemplate' }]],
              classes: 'material-icons modal-close-icon-style',
              attributes: { tabindex: '0' },
              type: 'element',
              text: 'close',
            }, {
              node: { element: this.el.nativeElement },
              type: 'element'
            }]
          }]
        }]
      }]
    };
    this.template = TemplateOperators.createTemplate(this.el.nativeElement.parentElement, templateContext, templateMethods, attr);
    (this.el.nativeElement as HTMLElement).style.paddingBottom = '0';
    (this.template.target as HTMLElement).focus();
    this.trigger.styles = { display: 'none' };
  }

  public closeTemplate = (event: (MouseEvent | KeyboardEvent) & TemplateEvent) => {
    if (
      (event instanceof MouseEvent && event.target === event.templateEvent.target.target) ||
      event instanceof KeyboardEvent && event.key === 'Escape'
    ) {
      (this.template.parent as Element).appendChild(this.el.nativeElement);
      this.template instanceof ContainerTemplate && this.template.destroy();
      this.trigger.styles = { display: 'block' };
      (this.el.nativeElement as HTMLElement).style.paddingBottom = `${this.trigger.target[this.trigger.target instanceof HTMLElement ? 'offsetHeight' : 'clientHeight']}px`;
    }
  }

  ngOnDestroy() {
    this.trigger instanceof ContainerTemplate && this.trigger.destroy();
    if (this.template instanceof ContainerTemplate && !this.template.isDestroyed) {
      (this.template.parent as Element).appendChild(this.el.nativeElement);
      this.template.destroy();
    }
  }

}
