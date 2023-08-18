import { AbstractControl, ValidationErrors, ValidatorFn } from "@angular/forms";

export function prohibited(reg: RegExp): ValidatorFn {
    return (fc: AbstractControl): ValidationErrors | null => {
        if(!fc.value) {
            return null;
        }
        let notAllowed = reg.test(fc.value.toLowerCase());

        if (notAllowed) {

            return {
                prohibited: { value: fc.value }
            };
        } else {
            return null;
        }
    }
}