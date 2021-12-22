import { Directive, ElementRef, EventEmitter, Input, OnChanges, OnDestroy, Output, SimpleChanges } from '@angular/core';

import { ModalBehaviorOptions, Modal, ModalClickEvent, ModalOptions } from 'moonkit';

import { MnkService } from './mnk.service';

@Directive({ selector: '[libModal]' })
export class ModalDirective implements OnChanges, OnDestroy {

  @Output() modalClick: EventEmitter<CustomEvent<ModalClickEvent>> = new EventEmitter();

  @Input() modalStructure: ModalBehaviorOptions['modalContext'];
  @Input() modalHeader: ModalBehaviorOptions['headerContext'];
  @Input() modalBody: ModalBehaviorOptions['bodyContext'];
  @Input() appModal: Partial<ModalOptions> = {};

  public modalInstance: Modal;

  constructor(public trigger: ElementRef<HTMLElement>, private helper: MnkService) {
    this.appModal.componentAttribute === undefined && (this.appModal.componentAttribute = this.helper.getComponentAttribute(this.trigger.nativeElement)[0]);
    this.modalInstance = new Modal(this.trigger.nativeElement, this.appModal, (ev) => this.modalClick.emit(ev));
    this.modalStructure !== undefined && (this.modalInstance.modalContext = this.modalStructure);
    this.modalHeader !== undefined && (this.modalInstance.headerContext = this.modalHeader);
    this.modalBody !== undefined && (this.modalInstance.bodyContext = this.modalBody);
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (this.modalInstance instanceof Modal) {
      'modalStructure' in changes && (this.modalInstance.modalContext = changes.modalStructure.currentValue);
      'modalHeader' in changes && (this.modalInstance.headerContext = changes.modalHeader.currentValue);
      'modalBody' in changes && (this.modalInstance.bodyContext = changes.modalBody.currentValue);
      if ('appModal' in changes) {
        (changes.appModal.currentValue || {}).componentAttribute === undefined && (changes.appModal.currentValue.componentAttribute = this.helper.getComponentAttribute(this.trigger.nativeElement)[0]);
        this.modalInstance.options = changes.appModal.currentValue;
      }
    }
  }

  ngOnDestroy() { this.modalInstance instanceof Modal && this.modalInstance.destroy(); }

}
