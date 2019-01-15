import { Pipe, PipeTransform } from '@angular/core';
import { DomSanitizer, SafeUrl } from '@angular/platform-browser';

@Pipe({name: 'safeContent'})
export class safeContent implements PipeTransform {

    constructor(private sanitizer:DomSanitizer){}

    transform(html) {
        return this.sanitizer.bypassSecurityTrustUrl(html);
    }

}