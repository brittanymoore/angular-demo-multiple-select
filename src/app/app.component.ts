import { Component, ViewEncapsulation } from '@angular/core';
import { FormGroup, FormBuilder } from '@angular/forms';

@Component({
    selector: 'my-app',
    templateUrl: './app.component.html',
    styleUrls: [ './app.component.scss' ],
    encapsulation: ViewEncapsulation.None // apply styles globally
})
export class AppComponent {

    public selections: any[] = [];
    public reactiveForm: FormGroup;

    constructor(private fb: FormBuilder) {
        this.reactiveForm = this.fb.group({
            selections: [[]]
        });
    }

}
