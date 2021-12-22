import { Router } from '@angular/router';

export class MnkRouter {

  /** @see {@link queryParameters} */
  private QUERYPARAMETERS: Record<string | number, string>;
  /** @see {@link routeId} */
  private ROUTEID: string | number;
  /** @see {@link target} */
  private TARGET: 'blank' | 'same';
  /** @see {@link parameters} */
  private PARAMETERS: string[];

  /** Parametros query de la ruta */
  public get queryParameters(): MnkRouter['QUERYPARAMETERS'] { return this.QUERYPARAMETERS; }
  public set queryParameters(val: MnkRouter['QUERYPARAMETERS']) { this.QUERYPARAMETERS = val; this.set(); }
  /** Parametros variable de la ruta */
  public get parameters(): MnkRouter['PARAMETERS'] { return this.PARAMETERS; }
  public set parameters(val: MnkRouter['PARAMETERS']) { this.PARAMETERS = val; this.set(); }
  /** Id de la ruta */
  public get routeId(): MnkRouter['ROUTEID'] { return this.ROUTEID; }
  public set routeId(val: MnkRouter['ROUTEID']) { this.ROUTEID = val; this.set(); }
  /** Ventana objetivo */
  public get target(): MnkRouter['TARGET'] { return this.TARGET; }
  public set target(val: MnkRouter['TARGET']) {
    this.TARGET = val;
    if (this.trigger instanceof HTMLAnchorElement) {
      val === 'blank' && (this.trigger.target = '_blank');
    }
  }

  constructor(public trigger: Element, private ROUTER: Router) { this.trigger.addEventListener('click', this.navigate); }

  /** Actualiza la propiedad href de los elementos HTMLAnchorElement */
  set() {
    if (this.trigger instanceof HTMLAnchorElement) {
      let route: string = typeof this.ROUTEID === 'string' ? this.ROUTEID : '';
      if (![null, undefined].includes(this.PARAMETERS)) {
        route += this.PARAMETERS.reduce((sign, value) => `${sign}${value}/`, '/').slice(0, -1);
      }
      if (![null, undefined].includes(this.QUERYPARAMETERS)) {
        route += (Object.entries(this.QUERYPARAMETERS).reduce((sign, [key, value]) => `${sign}${key}=${value}&`, '?').slice(0, -1));
      }
      this.trigger.href = route;
    }
  }
  /**
   * Navega hacia la ruta destino
   * @param event Información del evento
   */
  navigate = (event: MouseEvent) => {
    event.preventDefault();
    if (this.ROUTEID !== undefined) {
      if (typeof this.ROUTEID === 'string') {
        switch (this.TARGET) {
          case 'blank':
            if (this.ROUTEID.match(/^(http|https):\/\//g) !== null) {
              window.open(this.ROUTEID, '_blank');
            } else {
              const url = this.ROUTER.createUrlTree([this.ROUTEID, ...this.PARAMETERS || []], { queryParams: this.QUERYPARAMETERS || {} });
              window.open(url.toString(), '_blank');
            }
            break;
          default:
            if (this.ROUTEID.match(/^(http|https):\/\//g) !== null) {
              window.location.href = this.ROUTEID;
            } else { this.ROUTER.navigate([this.ROUTEID, ...this.PARAMETERS || []], { queryParams: this.QUERYPARAMETERS || {} }); }
            break;
        }
      } else { console.warn(`routeId must be defined`); }
    }
  }

  /** Elimina los eventos del elemento */
  destroy() { this.trigger.removeEventListener('click', this.navigate); }

}
