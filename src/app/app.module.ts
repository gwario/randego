import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppComponent } from './app.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

import { MatGridListModule } from '@angular/material/grid-list';
import { MatToolbarModule } from '@angular/material/toolbar';

import { MatFormFieldModule } from '@angular/material/form-field';
import { MatSliderModule } from '@angular/material/slider';
import { MccColorPickerModule } from 'material-community-components';
import { MatButtonModule } from '@angular/material/button';
import { MatInputModule } from '@angular/material/input';
import { ReactiveFormsModule } from '@angular/forms';

import { MatCardModule } from '@angular/material/card';
import { BoxComponent } from './box/box.component';
import { BoxItemComponent } from './box-item/box-item.component';
import { BoxItemCreatorComponent } from './box-item-creator/box-item-creator.component';
import { BuilderComponent } from './builder/builder.component';
import { BuilderControlsComponent } from './builder-controls/builder-controls.component';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';

@NgModule({
  declarations: [
    AppComponent,
    BoxComponent,
    BoxItemComponent,
    BoxItemCreatorComponent,
    BuilderComponent,
    BuilderControlsComponent
  ],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    MatGridListModule, MatToolbarModule,
    MatFormFieldModule, MatSliderModule, MccColorPickerModule, MatButtonModule, MatInputModule, ReactiveFormsModule,
    MatCardModule, NgbModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
