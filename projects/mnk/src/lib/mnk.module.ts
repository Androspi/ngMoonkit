import { NgModule } from '@angular/core';

import { AutocompleteDirective } from './mnk-autocomplete.directive';
import { CollapsableDirective } from './mnk-collapsable.directive';
import { FullScreenDirective } from './mnk-full-screen.directive';
import { LinkDirective } from './mnk-link.directive';
import { ModalDirective } from './mnk-modal.directive';
import { SelectDirective } from './mnk-select.directive';
import { TooltipDirective } from './mnk-tooltip.directive';

const DECLARATIONS = [
  AutocompleteDirective,
  CollapsableDirective,
  FullScreenDirective,
  TooltipDirective,
  SelectDirective,
  ModalDirective,
  LinkDirective,
];

@NgModule({
  declarations: DECLARATIONS,
  exports: DECLARATIONS,
  imports: [],
})
export class MnkModule { }
