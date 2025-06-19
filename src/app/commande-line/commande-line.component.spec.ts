import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CommandeLineComponent } from './commande-line.component';

describe('CommandeLineComponent', () => {
  let component: CommandeLineComponent;
  let fixture: ComponentFixture<CommandeLineComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CommandeLineComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(CommandeLineComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
