import {
  CUSTOM_ELEMENTS_SCHEMA,
  ModuleWithProviders,
  NgModule,
} from '@angular/core';
import { CommonModule, TitleCasePipe } from '@angular/common';
import { RouterLink, RouterModule } from '@angular/router';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
// import { BsDropdownModule } from 'ngx-bootstrap/dropdown';
import { NumberOnlyDirective } from './directives/onlynumber.directive';
import { CharacterOnlyDirective } from './directives/onlycharacter.directive';
import { DisabledDirective } from './directives/disabled.directive';
import { AlertComponent } from './alert';
import { NgxSpinnerModule } from 'ngx-spinner';
import { LoadingComponent } from './loading/loading.component';
import { } from './loading/loading.component';
import { GrdFilterPipe } from './filters-pipes/grd-filter.pipe';
// import { DataTablesModule } from 'angular-datatables';
// import { ModalModule } from 'ngx-bootstrap/modal';
// import { UiSwitchModule } from 'ngx-toggle-switch';
// import { ToastrModule } from 'ngx-toastr';
import { FormDirective } from './directives/focusInvalidInput.directive';
import { NatualNumbersOnlyDirective } from './directives/naturalNum.directive';
import { CharNumOnlyDirective } from './directives/onlyCharNum.directive';
import { SpecialNumOnlyDirective } from './directives/onlyspecialNum.directive';
import { DateAgoPipe } from './filters-pipes/date-ago.pipe';
import { ModalModule } from 'ngx-bootstrap/modal';
import { NgxPaginationModule } from 'ngx-pagination';
export { AuthGuard } from './guard/auth.guard';
import { PaginationModule } from 'ngx-bootstrap/pagination';

const SHARED_COMPONENTS: any = [
  // NumberOnlyDirective,
  // CharacterOnlyDirective,
  // DisabledDirective,
  // AlertComponent,
  // LoadingComponent,
  // GrdFilterPipe,
  // FormDirective,
  // NatualNumbersOnlyDirective,
  // SpecialNumOnlyDirective,
  // DateAgoPipe,
  // CharNumOnlyDirective,
];

const SHARED_MODULES: any = [
  CommonModule,
  FormsModule,
  // DataTablesModule,
  RouterModule,
  // BsDropdownModule.forRoot(),
  ModalModule,
  RouterLink,
  RouterModule,
  ReactiveFormsModule,
  NgxSpinnerModule,
  // DataTablesModule,
  // UiSwitchModule,
  // BsDropdownModule.forRoot(),
  NgxPaginationModule,
  PaginationModule,
];

@NgModule({
  imports: [
    CommonModule,
    RouterModule,
    NgxSpinnerModule,
  ],
  providers: [],
  declarations: SHARED_COMPONENTS,
  exports: [SHARED_COMPONENTS, SHARED_MODULES],
  // entryComponents: [],
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
})
export class SharedUiModule {
  static forRoot(): ModuleWithProviders<SharedUiModule> {
    return {
      ngModule: SharedUiModule,
      providers: [],
    };
  }
}
