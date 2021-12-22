import { Directive, ElementRef, Input, OnChanges, OnDestroy, SimpleChanges } from '@angular/core';
import { Router } from '@angular/router';

import { MnkRouter } from './mnk-router';

@Directive({ selector: '[libLink]' })
export class LinkDirective implements OnChanges, OnDestroy {

  @Input() queryParams: MnkRouter['QUERYPARAMETERS'];
  @Input() params: MnkRouter['PARAMETERS'];
  @Input() appLink: MnkRouter['ROUTEID'];
  @Input() target: MnkRouter['TARGET'];

  /** Instancia de la clase MnkRouter */
  routerInstace: MnkRouter;

  constructor(
    private elementRef: ElementRef<Element>,
    private router: Router,
  ) { this.routerInstace = new MnkRouter(this.elementRef.nativeElement, this.router); }

  ngOnChanges(changes: SimpleChanges) {
    if (this.routerInstace instanceof MnkRouter) {
      if ('appLink' in changes && ![null, undefined].includes(changes.appLink.currentValue)) {
        this.routerInstace.routeId = changes.appLink.currentValue;
      }
      if ('params' in changes && ![null, undefined].includes(changes.params.currentValue)) {
        this.routerInstace.parameters = changes.params.currentValue;
      }
      if ('queryParams' in changes && ![null, undefined].includes(changes.queryParams.currentValue)) {
        this.routerInstace.queryParameters = changes.queryParams.currentValue;
      }
      if ('target' in changes) { this.routerInstace.target = changes.target.currentValue; }
    }
  }

  ngOnDestroy(): void { this.routerInstace instanceof MnkRouter && this.routerInstace.destroy(); }

}
