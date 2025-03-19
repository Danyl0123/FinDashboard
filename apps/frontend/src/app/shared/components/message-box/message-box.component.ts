import { Component, computed, inject } from '@angular/core';
import { MessageBoxService } from '../../services/message-box.service';

@Component({
  selector: 'app-message-box',
  standalone: true,
  imports: [],
  templateUrl: './message-box.component.html',
  styleUrl: './message-box.component.css',
})
export class MessageBoxComponent {
  private readonly messageBoxService = inject(MessageBoxService);

  activeMessages = computed(
    () =>
      this.messageBoxService.dataInfos().length +
        this.messageBoxService.dataErrors().length >
      0
  );

  infos = computed(() => this.messageBoxService.dataInfos());
  errors = computed(() => this.messageBoxService.dataErrors());

  hideInfo(info: string) {
    this.messageBoxService.removeInfo(info);
  }

  hideError(info: string) {
    this.messageBoxService.removeError(info);
  }

  hideAll() {
    this.messageBoxService.clear();
  }
}
