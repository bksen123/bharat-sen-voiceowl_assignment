import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PlanPaymentDetailsComponent } from './plan-payment-details.component';

describe('PlanPaymentDetailsComponent', () => {
  let component: PlanPaymentDetailsComponent;
  let fixture: ComponentFixture<PlanPaymentDetailsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PlanPaymentDetailsComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PlanPaymentDetailsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
