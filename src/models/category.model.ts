import {Entity, model, property, hasMany} from '@loopback/repository';
import {Question} from './question.model';

@model()
export class Category extends Entity {
  @property({
    type: 'string',
    id: true,
    defaultFn: 'uuid',
    postgresql: {
      dataType: 'uuid',
    },
  })
  id: string;

  @property({
    type: 'string',
    required: true,
  })
  name: string;

  @hasMany(() => Question)
  questions: Question[];

  constructor(data?: Partial<Category>) {
    super(data);
  }
}

export interface CategoryRelations {
  // describe navigational properties here
}

export type CategoryWithRelations = Category & CategoryRelations;
