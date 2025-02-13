import { Injectable } from '@angular/core';
import * as CryptoJS from 'crypto-js';

@Injectable({
  providedIn: 'root'
})
export class IdEncryptorService {
  private secretKey = 'clave-secreta-super-segura-ñ-@#$$@^#%$234358694f'; // Cambia esto por una clave segura

  encodeId(id: number): string {
    return CryptoJS.AES.encrypt(id.toString(), this.secretKey).toString();
  }

  decodeId(encryptedId: string): number {
    const bytes = CryptoJS.AES.decrypt(encryptedId, this.secretKey);
    return Number(bytes.toString(CryptoJS.enc.Utf8));
  }
}
    