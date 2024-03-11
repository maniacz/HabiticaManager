import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TagFiltersComponent } from './tag-filters.component';

describe('TagFiltersComponent', () => {
  let component: TagFiltersComponent;
  let fixture: ComponentFixture<TagFiltersComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [TagFiltersComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(TagFiltersComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
