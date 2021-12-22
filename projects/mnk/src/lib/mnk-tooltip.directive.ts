import { Directive, ElementRef, Input, OnChanges, OnDestroy, SimpleChanges } from '@angular/core';

import { Tooltip, TooltipOptions } from 'moonkit';

import { MnkService } from './mnk.service';

@Directive({ selector: '[libTooltip]' })
export class TooltipDirective implements OnChanges, OnDestroy {

  @Input() appTooltip: Partial<TooltipOptions>;
  tooltipInstance: Tooltip;

  constructor(
    private helper: MnkService,
    private el: ElementRef
  ) {
    const attr: Attr = this.helper.getComponentAttribute(this.el.nativeElement)[0];
    this.tooltipInstance = new Tooltip(this.el.nativeElement, attr, this.appTooltip || {});
  }

  ngOnChanges(changes: SimpleChanges) {
    if ('appTooltip' in changes) {
      this.destroy();
      this.tooltipInstance.options = changes.appTooltip.currentValue;
      this.tooltipInstance.init();
    }
  }

  private destroy() { if (this.tooltipInstance instanceof Tooltip) { this.tooltipInstance.destroy(); } }

  ngOnDestroy() { this.destroy(); }

}
