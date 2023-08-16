import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FindatutorComponent } from './findatutor.component';

describe('FindatutorComponent', () => {
  let component: FindatutorComponent;
  let fixture: ComponentFixture<FindatutorComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [FindatutorComponent]
    });
    fixture = TestBed.createComponent(FindatutorComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
