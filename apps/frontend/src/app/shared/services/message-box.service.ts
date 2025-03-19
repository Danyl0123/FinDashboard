import { formatDate } from '@angular/common';
import { Injectable, signal } from '@angular/core';
import { registerLocaleData } from '@angular/common';
import localeUk from '@angular/common/locales/uk';
registerLocaleData(localeUk);
@Injectable({
  providedIn: 'root',
})
export class MessageBoxService {
  dataInfos = signal<string[]>([]);
  dataErrors = signal<string[]>([]);

  sendError(err: string, timeOut = 10 * 1000) {
    const formatedDate = formatDate(new Date(), 'dd.MM.yyyy HH:mm:ss', 'uk-UA');
    const message = `${formatedDate} : ${err} `;

    this.dataErrors.update((errors) => [...errors, message]);
    setTimeout(() => this.removeError(message), timeOut);
  }

  sendInfo(info: string, timeOut = 10 * 1000) {
    const formatedDate = formatDate(new Date(), 'dd.MM.yyyy HH:mm:ss', 'uk-UA');
    const message = `${formatedDate} : ${info} `;

    this.dataInfos.update((infos) => [...infos, message]);
    setTimeout(() => this.removeInfo(message), timeOut);
  }

  removeError(error: string) {
    this.dataErrors.update((errors) => errors.filter((err) => err !== error));
  }

  removeInfo(info: string) {
    this.dataInfos.update((infos) => infos.filter((inf) => inf !== info));
  }

  clear() {
    this.dataErrors.set([]);
    this.dataInfos.set([]);
  }
}
