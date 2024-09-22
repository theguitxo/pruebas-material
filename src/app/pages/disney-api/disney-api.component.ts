import { JsonPipe, NgIf } from '@angular/common';
import { Component, inject, Injector, OnInit, Signal } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import {
  DisneyAPIService,
  ResponseCharacterList,
} from '../../services/disney-api.service';

@Component({
  selector: 'app-disney-api',
  standalone: true,
  imports: [JsonPipe, NgIf],
  templateUrl: './disney-api.component.html',
})
export class DisneyAPIComponent implements OnInit {
  private readonly disneyAPIService!: DisneyAPIService;

  private injector = inject(Injector);

  characters!: Signal<ResponseCharacterList | undefined>;

  constructor() {
    this.disneyAPIService = inject(DisneyAPIService);
  }

  ngOnInit(): void {
    this.characters = toSignal(this.disneyAPIService.getAllCharacters(), {
      initialValue: undefined,
      injector: this.injector,
    });
  }
}
