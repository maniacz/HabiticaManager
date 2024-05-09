import { Injectable } from '@angular/core';
import { Tag } from '../models/tag';
import { firstValueFrom } from 'rxjs';
import { DataService } from './data.service';

@Injectable({
  providedIn: 'root'
})
export class TagService {

  constructor(private dataService: DataService) { }

  async getTag(tagName: string): Promise<Tag | undefined> {
    const allTags = await firstValueFrom(this.dataService.fetchTags());
    return allTags.find(t => t.name === tagName);
  }
}
