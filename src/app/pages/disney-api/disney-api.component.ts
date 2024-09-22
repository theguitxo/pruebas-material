import { JsonPipe, NgIf } from '@angular/common';
import {
  Component,
  effect,
  inject,
  Injector,
  OnInit,
  Signal,
} from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { MatTableModule } from '@angular/material/table';
import {
  DisneyAPIService,
  ResponseCharacterList,
} from '../../services/disney-api.service';

@Component({
  selector: 'app-disney-api',
  standalone: true,
  imports: [JsonPipe, NgIf, MatTableModule],
  templateUrl: './disney-api.component.html',
})
export class DisneyAPIComponent implements OnInit {
  private readonly disneyAPIService!: DisneyAPIService;

  private injector = inject(Injector);

  characters!: Signal<ResponseCharacterList | undefined>;

  constructor() {
    this.disneyAPIService = inject(DisneyAPIService);
  }

  dataSource: { _id: number; name: string }[] = [];
  displayedColumns = ['_id', 'name'];

  ngOnInit(): void {
    this.initEffects();
    this.initSignals();
  }

  private initSignals(): void {
    this.characters = toSignal(this.disneyAPIService.getAllCharacters(), {
      initialValue: undefined,
      injector: this.injector,
    });
  }

  private initEffects(): void {
    effect(
      () => {
        this.dataSource =
          this.characters()?.data.map((item) => ({
            _id: item._id,
            name: item.name,
          })) || [];
      },
      { injector: this.injector }
    );
  }
}
