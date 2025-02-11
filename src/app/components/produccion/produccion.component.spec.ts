import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ProduccionComponent } from './produccion.component';

describe('ProduccionComponent', () => {
  let component: ProduccionComponent;
  let fixture: ComponentFixture<ProduccionComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ProduccionComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ProduccionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
