import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DemoRequest } from './demo-request';

describe('DemoRequest', () => {
  let component: DemoRequest;
  let fixture: ComponentFixture<DemoRequest>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DemoRequest]
    })
    .compileComponents();

    fixture = TestBed.createComponent(DemoRequest);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
