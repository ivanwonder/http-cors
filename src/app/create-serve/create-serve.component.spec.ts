import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CreateServeComponent } from './create-serve.component';

describe('CreateServeComponent', () => {
  let component: CreateServeComponent;
  let fixture: ComponentFixture<CreateServeComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CreateServeComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CreateServeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
