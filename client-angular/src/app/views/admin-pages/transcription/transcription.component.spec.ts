import { ComponentFixture, TestBed } from '@angular/core/testing';
import { transcriptionComponent } from './transcription.component';


describe('transcriptionComponent', () => {
  let component: transcriptionComponent;
  let fixture: ComponentFixture<transcriptionComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [transcriptionComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(transcriptionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
