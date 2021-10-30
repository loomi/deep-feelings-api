import {Entity, model, property} from '@loopback/repository';

@model()
export class Survey extends Entity {
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

  @property({
    type: 'object',
    required: true,
  })
  answers: object;


  constructor(data?: Partial<Survey>) {
    super(data);
  }
}

export interface SurveyRelations {
  // describe navigational properties here
}

export type SurveyWithRelations = Survey & SurveyRelations;
