import { Component, Input, forwardRef } from '@angular/core';
import { ControlValueAccessor, NG_VALUE_ACCESSOR, Validator, FormControl, NG_VALIDATORS } from '@angular/forms';

@Component({
    selector: 'multiple-select',
    templateUrl: './multiple-select.component.html',
    providers: [
        {
            provide: NG_VALUE_ACCESSOR,
            useExisting: forwardRef(() => MultipleSelectComponent),
            multi: true
        },
        {
            provide: NG_VALIDATORS,
            useExisting: forwardRef(() => MultipleSelectComponent),
            multi: true
        }
    ]
})
export class MultipleSelectComponent implements ControlValueAccessor, Validator {

    private duplicateError: boolean;
    private missingError: boolean;

    private _selections: any[];
    get selections(): any[] {
        return this._selections;
    }
    set selections(array: any[]) {
        while (array.length < this.options.length) {
            array.push({ value: '' });
        }
        this._selections = array;
    }

    public options: string[] = ['A', 'B', 'C', 'D'];

    // the method set in registerOnChange, it is just
    // a placeholder for a method that takes one parameter,
    // we use it to emit changes back to the form
    private propagateChange = (_: any) => { };

    // this is the initial value set to the component
    public writeValue(obj: any) {
        if (obj && (obj.length !== undefined)) {
            this.selections = obj;
            this.validateControl();
        }
    }

    // registers 'fn' that will be fired when changes are made
    // this is how we emit the changes back to the form
    public registerOnChange(fn: any) {
        this.propagateChange = fn;
    }

    // not used, used for touch input
    public registerOnTouched() { }

    // returns null when valid else the validation object
    // in this case we're checking if the json parsing has
    // passed or failed from the onChange method
    public validate(c: FormControl) {
        let errors: any = null;
        if (this.duplicateError || this.missingError) {
            errors = {};
            if (this.duplicateError) {
                errors.duplicates = { valid: false };
            }
            if (this.missingError) {
                errors.missing = { valid: false };
            }
        }
        return errors;
    }

    // change events from the textarea
    public onChange(event: Event): void {

        // validate
        this.validateControl();

        // update the form
        this.propagateChange(this.selections);

    }

    private validateControl(): void {
        this.missingError = this.valuesMissing(this.selections);
        // only validate for duplicates if no values are missing.
        this.duplicateError = (this.missingError) ? false : this.duplicateExists(this.selections);
    }

    private valuesMissing(array: any[]): boolean {
        let valueMissing = false;
        for (let i = 0; i < array.length; i++) {
            if (!array[i].value || array[i].value === '') {
                valueMissing = true;
                break;
            }
        }
        return valueMissing;
    }

    private duplicateExists(array: any[]): boolean {
        const sorted = array.slice().sort(this.sortByValue);
        let duplicateFound = false;
        for (let i = 0; i < array.length - 1; i++) {
            if (sorted[i + 1].value === sorted[i].value) {
                duplicateFound = true;
                break;
            }
        }
        return duplicateFound;
    }

    private sortByValue(a: any, b: any): number {
        if (a.value < b.value) {
            return -1;
        } else if (a.value === b.value) {
            return 0;
        } else {
            return 1;
        }
    }

}
